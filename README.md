# Remont.by

Платформа для соединения заказчиков ремонтных работ и исполнителей по всей Беларуси. Сайт позволяет заказчикам размещать заказы на ремонт/отделку, а исполнителям — находить заказы по своим компетенциям и получать рейтинг по категориям.

## Технологический стек

| Слой            | Технологии                                                                         |
| --------------- | ---------------------------------------------------------------------------------- |
| **Frontend**    | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, jose |
| **Backend**     | Next.js API Routes (`/api/v1/`), Prisma ORM, Zod, jose, multer, bcrypt            |
| **База данных** | PostgreSQL 16                                                                      |
| **Инфраструктура** | pnpm workspaces (монорепо), Turborepo, Docker Compose, GitHub Actions          |
| **Тесты**       | Vitest (unit), Playwright (E2E)                                                    |

## Быстрый старт

### 1. Установка зависимостей

```bash
pnpm install
```

### 2. Запуск PostgreSQL (Docker)

```bash
docker compose up -d
```

Контейнеры: `remont-postgres` (PostgreSQL 16) и `remont-pgadmin` (pgAdmin на порту `5050`).

### 3. Переменные окружения

```bash
cp .env.example .env
```

При необходимости отредактируйте `.env` (JWT_SECRET, DATABASE_URL и др.).

### 4. Миграции базы данных

```bash
pnpm prisma:migrate:dev
```

### 5. Заполнение базы тестовыми данными

```bash
pnpm prisma:seed
```

### 6. Запуск в режиме разработки

```bash
pnpm dev
```

Сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000).

---

## Структура проекта

```
Remont/
├── .env.example                 # Шаблон переменных окружения
├── .eslintrc.js                 # Конфигурация ESLint (Next.js + TypeScript)
├── .prettierrc                  # Конфигурация Prettier
├── docker-compose.yml           # PostgreSQL 16 + pgAdmin
├── package.json                 # Root workspace (pnpm + turborepo)
├── pnpm-workspace.yaml          # pnpm workspaces
├── pnpm-lock.yaml               # Lock-файл зависимостей
├── turbo.json                   # Конфигурация Turborepo
├── tsconfig.base.json           # Общий TypeScript-конфиг
│
├── packages/
│   ├── shared/                  # @remont/shared — общие типы, Zod-схемы, константы
│   │   └── src/
│   │       ├── types/           # TypeScript-типы
│   │       ├── schemas/         # Zod-схемы валидации
│   │       └── constants/       # Константы (роли, статусы)
│   │
│   └── frontend/                # @remont/frontend — Next.js приложение
│       ├── prisma/
│       │   ├── schema.prisma    # Схема базы данных
│       │   ├── migrations/      # Файлы миграций
│       │   └── seed.ts          # Сидеры (категории, города)
│       └── src/
│           ├── app/             # Next.js App Router
│           │   ├── (public)/    # Публичные страницы
│           │   │   ├── contractors/     # Каталог исполнителей
│           │   │   ├── orders/          # Доска заказов
│           │   │   └── auth/            # Логин / Регистрация
│           │   └── (dashboard)/ # Личный кабинет (требует авторизации)
│           ├── components/
│           │   ├── ui/          # shadcn/ui компоненты
│           │   ├── layout/      # Header, Footer, Navbar
│           │   ├── contractors/ # Карточки, сетка, фильтры
│           │   ├── orders/      # Карточки, форма заказа
│           │   ├── portfolio/   # Сетка портфолио, загрузчик
│           │   ├── auth/        # Формы логина/регистрации
│           │   └── shared/      # SearchBar, Pagination, RatingStars
│           ├── hooks/           # useAuth, useContractors, useOrders
│           ├── lib/             # api-client, auth, utils
│           └── styles/          # globals.css
│
├── docs/                        # Документация проекта
│   ├── ARCHITECTURE.md          # Архитектура и принципы
│   ├── KANBAN.md                # Kanban-доска задач
│   ├── DATA_MODEL.md            # Схема базы данных (Prisma)
│   ├── API_SPEC.md              # Спецификация API
│   ├── CATEGORIES.md            # Категории работ
│   ├── CITIES.md                # Города Беларуси
│   ├── CI_CD.md                 # CI/CD pipeline
│   └── CONVENTIONS.md           # Правила оформления кода
│
├── scripts/
│   └── review-and-merge.sh      # Скрипт авто-апрува PR
│
└── .github/
    └── workflows/
        └── ci.yml               # GitHub Actions CI
```

---

## Документация

Полная документация в [`docs/`](docs/):

| Документ                              | Описание                                      |
| ------------------------------------- | --------------------------------------------- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура проекта, технологический стек, принципы |
| [KANBAN.md](docs/KANBAN.md)           | Kanban-доска с пошаговыми задачами            |
| [DATA_MODEL.md](docs/DATA_MODEL.md)   | Полная схема базы данных (Prisma)             |
| [API_SPEC.md](docs/API_SPEC.md)       | Спецификация всех API-эндпоинтов              |
| [CATEGORIES.md](docs/CATEGORIES.md)   | Справочник категорий ремонтных работ          |
| [CITIES.md](docs/CITIES.md)           | Справочник городов Беларуси                   |
| [CI_CD.md](docs/CI_CD.md)             | Описание CI/CD пайплайна                      |
| [CONVENTIONS.md](docs/CONVENTIONS.md) | Правила оформления кода и соглашения          |

---

## Запуск тестов

```bash
# Unit-тесты (Vitest)
pnpm run test

# Линтинг
pnpm run lint

# Проверка типов
pnpm run typecheck

# Сборка проекта
pnpm run build
```

---

## Использование Kanban

Разработка ведётся по Kanban-методологии через [`docs/KANBAN.md`](docs/KANBAN.md). Каждая задача атомарна (1 задача ≈ 1 файл/компонент/эндпоинт) и выполняется строго по порядку ID.

- Задачи группируются по фазам (Фаза 0 — Инфраструктура, Фаза 1 — Общие компоненты, и т.д.)
- После выполнения задачи ставится `[x]` в чекбоксе и делается коммит
- После каждого коммита CI-пайплайн автоматически проверяет код (lint → typecheck → test → build)
- Для автоматического ревью и мержа используется скрипт:

```bash
./scripts/review-and-merge.sh
```

Подробнее — см. [`docs/KANBAN.md`](docs/KANBAN.md) и [`docs/CI_CD.md`](docs/CI_CD.md).

---

## Лицензия

MIT

