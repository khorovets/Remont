# CI/CD и автономный пайплайн

## Обзор

Проект использует автономный CI/CD пайплайн, в котором **coding agent** пишет код,
а **review agent** автоматически проверяет, апрувит и мержит изменения в `main`.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Coding Agent    │────▶│  Review Agent     │────▶│  Main Branch     │
│  (пишет код)     │     │  (проверяет + PR) │     │  (production)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │  push в feat/*         │  typecheck/lint/test   │
        │                        │  создаёт PR            │
        │                        │  апрувит               │
        │                        │  squash merge          │
        │                        │  task done             │
```

## Структура

```
.github/
  workflows/
    ci.yml                   # GitHub Actions CI
scripts/
  review-and-merge.sh        # Авто-апрув скрипт
docs/
  CI_CD.md                   # Этот документ
```

---

## 1. GitHub Actions CI

### Файл: `.github/workflows/ci.yml`

CI запускается автоматически на:
- **push** в ветки `main` и `dev`
- **pull_request** в `main`

### Шаги

| Шаг | Команда | Описание |
|-----|---------|----------|
| Checkout | `actions/checkout@v4` | Клонирование репозитория |
| Setup pnpm | `pnpm/action-setup@v2` | Установка pnpm 8 |
| Setup Node.js | `actions/setup-node@v4` | Node.js 20 |
| Install | `pnpm install --frozen-lockfile` | Установка зависимостей |
| Prisma Generate | `pnpm prisma:generate` | Генерация Prisma Client |
| Prisma Migrate | `pnpm prisma:migrate:deploy` | Применение миграций |
| Typecheck | `pnpm typecheck` | Проверка типов TypeScript |
| Lint | `pnpm lint` | Проверка Prettier + ESLint |
| Test | `pnpm test` | Unit-тесты (Vitest) |

### Переменные окружения (CI)

```yaml
env:
  DATABASE_URL: postgresql://remont:remont_test@localhost:5432/remont_test
  JWT_SECRET: test_secret_ci
```

CI также поднимает контейнер PostgreSQL 16 (Alpine) как service container.

### Запуск CI локально

```bash
# Установить act (https://github.com/nektos/act)
brew install act

# Запустить CI локально
act push

# Запустить конкретный job
act -j ci
```

---

## 2. GitHub Branch Protection для main

### Настройка через gh CLI

```bash
# 1. Авторизоваться с токеном (нужны права admin:repo)
gh auth login --hostname github.com

# 2. Включить защиту ветки main
gh api -X PUT \
  /repos/:owner/:repo/branches/main/protection \
  --input - << 'BODY'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint, Typecheck & Test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": false
}
BODY
```

### Настройка через веб-интерфейс

1. Открыть репозиторий на GitHub → **Settings** → **Branches**
2. Нажать **Add rule** или редактировать существующую для `main`
3. **Branch name pattern**: `main`
4. Включить:
   - ✅ **Require status checks to pass before merging**
     - Выбрать: `Lint, Typecheck & Test`
     - ✅ **Require branches to be up to date before merging**
   - ✅ **Do not allow bypassing the above settings** (опционально)
5. **Applies to**: Everyone (но боты с bypass bypass protection — см. ниже)

### Bypass для ботов (токен агента)

Чтобы review agent мог мержить без апрува от человека, нужно настроить bypass.

#### Вариант A: GitHub App (рекомендуется)

1. Создать GitHub App в организации/аккаунте
2. Дать права: `Pull Requests: Read & Write`, `Contents: Read & Write`
3. Установить App на репозиторий
4. В Branch Protection → **Allow specified actors to bypass required pull requests**:
   - Добавить созданный GitHub App

#### Вариант B: Personal Access Token (PAT) с bypass

1. Создать [Fine-grained PAT](https://github.com/settings/tokens)
2. Дать права:
   - `Contents: Read and write`
   - `Pull requests: Read and write`
   - `Workflows: Read and write` (для ожидания CI)
3. В Branch Protection → **Allow specified actors to bypass**:
   - Добавить аккаунт, которому принадлежит токен

#### Вариант C: Админский bypass

```bash
# Мерж с флагом --admin (требует прав admin)
gh pr merge <PR_NUMBER> --squash --admin
```

Для этого токен должен иметь права администратора репозитория.

---

## 3. Авто-апрув скрипт (Review Agent)

### Файл: `scripts/review-and-merge.sh`

Скрипт выполняет полный цикл проверки и мержа:

```
1. Проверка конфликтов с main (rebase если нужно)
2. typecheck (pnpm typecheck)
3. lint (pnpm lint)
4. test (pnpm test)
5. Push ветки + создание Pull Request через gh CLI
6. Ожидание CI на PR + approve + squash merge
7. task done (отметка задачи в Kanban)
```

### Использование

```bash
# Базовое использование
./scripts/review-and-merge.sh

# Мерж в dev вместо main
./scripts/review-and-merge.sh --base dev

# Dry-run: только проверки, без PR и мержа
./scripts/review-and-merge.sh --dry-run

# Справка
./scripts/review-and-merge.sh --help
```

### Переменные окружения

| Переменная | Обязательно | Описание |
|------------|------------|----------|
| `GITHUB_TOKEN` | Да | GitHub PAT с правами repo, pull_requests |
| `BASE_BRANCH` | Нет | Базовая ветка для PR (по умолчанию `main`) |
| `DRY_RUN` | Нет | `true` — только проверки без мержа |

### Пример запуска

```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
./scripts/review-and-merge.sh
```

### Что если проверки не прошли?

Скрипт завершается с кодом 1 и вызывает Kanban CLI:

```bash
task comment "Auto-review failed: Typecheck failed. Return to task."
task block --reason "Typecheck failed"
```

Задача возвращается в статус, требующий доработки.

---

## 4. Интеграция с Kanban

### Схема взаимодействия

```
┌──────────────┐     task link     ┌──────────────┐
│ Coding Agent  │ ───────────────▶ │ Review Agent  │
│ (завершает    │                  │ (запускается  │
│  задачу)      │                  │  по триггеру) │
└──────────────┘                  └──────┬───────┘
                                         │
                                         │ проверки пройдены?
                                         │
                          ┌──────────────┼──────────────┐
                          ▼                             ▼
                   ┌─────────────┐              ┌─────────────┐
                   │ PR + Merge   │              │ Возврат на   │
                   │ task done    │              │ доработку    │
                   └─────────────┘              │ task block   │
                                                └─────────────┘
```

### Настройка task link

1. В Kanban CLI настройте хук после завершения задачи:

```bash
# task link — связь задачи с review agent
task link --on-done "./scripts/review-and-merge.sh"
```

2. Или добавьте в `.kanban/config.yml`:

```yaml
hooks:
  after_task_done:
    - command: "./scripts/review-and-merge.sh"
      on_status: "done"
```

### Команды Kanban CLI, используемые агентом

| Команда | Когда | Описание |
|---------|-------|----------|
| `task done` | Успешный мерж | Помечает задачу выполненной |
| `task comment "текст"` | Ошибка проверок | Добавляет комментарий к задаче |
| `task block --reason "..."` | Ошибка проверок | Возвращает задачу на доработку |

### Auto-Approve Agent (авто-апрув задач в review)

Скрипт `scripts/auto-approve.sh` автоматически апрувит все задачи, находящиеся
в колонке `review`, чтобы цепочка не вставала. Полезен, когда задачи проходят
review agent и ожидают ручного подтверждения.

#### Использование

```bash
# Бесконечный цикл — проверка каждые 10 секунд
./scripts/auto-approve.sh

# Однократный запуск
./scripts/auto-approve.sh --once

# Справка
./scripts/auto-approve.sh --help

# Через pnpm
pnpm auto-approve
```

#### Как работает

1. Вызывает `kanban task list --column review` — получает ID всех задач в review
2. Для каждой задачи вызывает `kanban task done --task-id <id>`
3. Логирует результат (успех или ошибку)
4. В режиме цикла — повторяет каждые `SLEEP_INTERVAL` секунд (по умолчанию 10)

#### Пример вывода

```
[INFO]  12:34:56 ==============================================
[INFO]  12:34:56 Auto-Approve Agent — запуск
[INFO]  12:34:56 Режим: цикл каждые 10 сек
[INFO]  12:34:56 ==============================================
[INFO]  12:34:56 Запрашиваю задачи в колонке review...
[INFO]  12:34:56 Апрувлю задачу #7...
[OK]    12:34:56 Задача #7 отмечена как выполненная
[INFO]  12:34:56 Апрувлю задачу #8...
[OK]    12:34:56 Задача #8 отмечена как выполненная
[OK]    12:34:56 Апрувнуто задач: 2
[INFO]  12:35:06 Нет задач в колонке review
```

#### Переменные окружения

| Переменная | По умолчанию | Описание |
|------------|-------------|----------|
| `SLEEP_INTERVAL` | `10` | Интервал между проверками в секундах |

#### Интеграция с review-and-merge.sh

Auto-approve можно запускать параллельно с review agent:

```bash
# Терминал 1: Review Agent (проверяет и мержит PR)
./scripts/review-and-merge.sh

# Терминал 2: Auto-Approve (апрувит задачи после успешного мержа)
./scripts/auto-approve.sh
```

Review agent вызывает `task done` автоматически после успешного мержа.
Auto-approve служит дополнительной страховкой для задач, которые могли
застрять в колонке `review`.

---

## 5. Полный цикл работы

### 1. Coding Agent завершает задачу

```bash
# Агент пишет код, коммитит изменения
git checkout -b feat/task-3.7
git add .
git commit -m "feat: Добавлен middleware Zod-валидации"

# Агент помечает задачу готовой к ревью
task review
```

### 2. Review Agent запускается

```bash
# Автоматически или вручную
./scripts/review-and-merge.sh
```

### 3. Review Agent выполняет проверки

```
[INFO]  Review & Merge Agent — start
[INFO]  Current branch:  feat/task-3.7
[INFO]  Base branch:     main
[INFO]  1/6 Checking for conflicts with main...
[OK]    No conflicts
[INFO]  2/6 Running typecheck...
[OK]    Typecheck passed
[INFO]  3/6 Running lint...
[OK]    Lint passed
[INFO]  4/6 Running tests...
[OK]    Tests passed
[OK]    All checks passed!
```

### 4. Review Agent создаёт PR и мержит

```
[INFO]  5/6 Pushing branch and creating PR...
[OK]    PR #42 created
[INFO]  6/6 Approving and squash-merging PR #42...
[OK]    PR #42 squash-merged into main
[INFO]  Отмечаю задачу как выполненную...
[OK]    Autonomous pipeline completed successfully!
```

---

## 6. Как вмешаться человеку при ошибках

### Ситуация 1: CI упал

1. Открыть PR на GitHub
2. Посмотреть детали ошибки во вкладке **Actions**
3. Исправить ошибку в коде
4. Запушить исправления — CI перезапустится автоматически
5. После прохождения CI — PR можно смержить вручную или перезапустить review agent

### Ситуация 2: Review Agent не может создать PR

```bash
# Проверить авторизацию gh CLI
gh auth status

# Проверить права токена
gh api /user --jq '.login'

# Вручную создать PR
gh pr create --base main --head feat/task-X --title "..."
```

### Ситуация 3: Конфликт с main

```bash
# Переключиться на task-ветку
git checkout feat/task-X

# Обновить main
git fetch origin main

# Сделать rebase вручную
git rebase origin/main

# Разрешить конфликты в файлах
git add <разрешённые_файлы>
git rebase --continue

# Запушить и перезапустить review agent
git push --force-with-lease origin feat/task-X
./scripts/review-and-merge.sh
```

### Ситуация 4: Нужно отклонить авто-мерж

1. Найти PR на GitHub (имеет метку от review agent)
2. Нажать **Close pull request**
3. Оставить комментарий с причиной
4. В Kanban CLI:
   ```bash
   task comment "PR отклонён: требуется <причина>"
   task block --reason "Нужны правки"
   ```

### Ситуация 5: Ручной апрув и мерж

Если авто-пайплайн не нужен для конкретной задачи:

```bash
# Создать PR вручную
git push origin feat/task-X
gh pr create --base main --head feat/task-X

# Дождаться CI (зелёная галочка)
# Нажать Merge pull request на GitHub

# Или через CLI
github pr merge <NUMBER> --squash

# Отметить задачу
task done
```

---

## 7. Настройка gh CLI и токена

### Установка gh CLI

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Linux (Fedora)
sudo dnf install gh

# Проверка
gh --version
```

### Создание токена (Personal Access Token)

1. Перейти: https://github.com/settings/tokens
2. Нажать **Generate new token** → **Fine-grained token**
3. Настроить:
   - **Token name**: `remont-review-agent`
   - **Expiration**: по необходимости (90 дней или без срока)
   - **Repository access**: Only select repositories → выбрать `Remont`
4. **Permissions**:
   - `Contents`: **Read and write** (для push, merge)
   - `Pull requests`: **Read and write** (для create, approve, merge)
   - `Workflows`: **Read and write** (для ожидания CI)
   - `Metadata`: **Read** (автоматически)
5. Нажать **Generate token** и скопировать значение

### Авторизация gh CLI

```bash
# Интерактивная авторизация
gh auth login
# Выбрать: GitHub.com → HTTPS → Authenticate with token
# Вставить токен

# Проверка
gh auth status
```

### Добавление токена в CI/CD

Для GitHub Actions токен не нужен — используется встроенный `GITHUB_TOKEN`.

Для локального запуска:

```bash
# Добавить в .env (НЕ КОММИТИТЬ!)
echo "GITHUB_TOKEN=ghp_xxxxxxxxxxxx" >> .env.local

# Или экспортировать в сессии
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
```

---

## 8. Часто задаваемые вопросы

### Q: Почему squash merge?

Squash merge объединяет все коммиты задачи в один коммит в `main`.
Это сохраняет историю чистой: каждый коммит в main = одна задача.

### Q: Что делает --delete-branch?

После успешного мержа удаляет ветку на GitHub (локальная ветка не удаляется).

### Q: Как отключить авто-пайплайн для конкретной ветки?

```bash
# Создать PR вручную, без скрипта
git push origin feat/manual-task
gh pr create --base main --head feat/manual-task
```

### Q: Скрипт падает с «gh CLI not authenticated»

```bash
# Проверить авторизацию
gh auth status

# Заново авторизоваться
gh auth login
```

### Q: Как запустить проверки без PR и мержа?

```bash
./scripts/review-and-merge.sh --dry-run
```
