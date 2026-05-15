# Архитектура проекта Remont.by

## Общее описание

Платформа для соединения заказчиков ремонтных работ и исполнителей по всей Беларуси.
Сайт позволяет заказчикам размещать заказы на ремонт/отделку, а исполнителям —
находить заказы по своим компетенциям и получать рейтинг по категориям.

## Технологический стек

### Frontend
- **Next.js 14** (App Router) + TypeScript — SSR, Server Components, file-based routing
- **Tailwind CSS** + **shadcn/ui** — стилизация и готовые компоненты
- **React Hook Form** + **Zod** — формы и валидация
- **jose** — работа с JWT на клиенте

### Backend
- **Next.js API Routes** (`/api/v1/`) — бэкенд внутри того же проекта
- **Prisma ORM** + **PostgreSQL 16** — работа с БД
- **Zod** — валидация входных данных (общие схемы с frontend)
- **jose** — создание/проверка JWT
- **multer** — загрузка файлов (фото портфолио)
- **bcrypt** — хеширование паролей

### Инфраструктура
- **pnpm workspaces** — монорепо
- **Docker Compose** — PostgreSQL + pgAdmin для разработки
- **GitHub Actions** — CI/CD (lint → typecheck → test → build)
- **Vitest** — unit-тесты
- **Playwright** — E2E-тесты

### Хранение
- PostgreSQL 16 — основная БД
- Локальная файловая система — фото портфолио (MVP)
- S3-совместимое хранилище — в будущем

## Структура проекта

```
Remont/
├── package.json                    # root workspace
├── pnpm-workspace.yaml
├── turbo.json                      # turborepo config
├── tsconfig.base.json              # общий tsconfig
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── docker-compose.yml              # PostgreSQL + pgAdmin
│
├── packages/
│   ├── shared/                     # общие типы, схемы валидации (Zod)
│   │   ├── src/
│   │   │   ├── types/              # TypeScript типы
│   │   │   ├── schemas/            # Zod-схемы валидации
│   │   │   └── constants/          # константы (роли, статусы)
│   │   └── package.json
│   │
│   └── frontend/                   # Next.js приложение
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── package.json
│       ├── prisma/
│       │   ├── schema.prisma       # схема БД
│       │   ├── migrations/
│       │   └── seed.ts             # сидеры (категории, города)
│       └── src/
│           ├── app/                # Next.js App Router
│           │   ├── layout.tsx      # корневой layout
│           │   ├── page.tsx        # главная /
│           │   ├── (public)/       # групповой layout для публичных страниц
│           │   │   ├── contractors/
│           │   │   │   ├── page.tsx           # /contractors — каталог
│           │   │   │   └── [id]/
│           │   │   │       └── page.tsx       # /contractors/:id — профиль
│           │   │   ├── orders/
│           │   │   │   ├── page.tsx           # /orders — доска заказов
│           │   │   │   └── [id]/
│           │   │   │       └── page.tsx       # /orders/:id — карточка заказа
│           │   │   ├── auth/
│           │   │   │   ├── login/page.tsx
│           │   │   │   └── register/page.tsx
│           │   │   └── layout.tsx
│           │   └── (dashboard)/     # ЛК (требует авторизации)
│           │       ├── layout.tsx
│           │       ├── profile/
│           │       │   └── page.tsx
│           │       ├── portfolio/
│           │       │   └── page.tsx
│           │       ├── orders/
│           │       │   └── page.tsx
│           │       ├── responses/
│           │       │   └── page.tsx
│           │       └── favorites/
│           │           └── page.tsx
│           ├── components/
│           │   ├── ui/             # shadcn/ui компоненты
│           │   ├── layout/         # Header, Footer, Navbar
│           │   ├── contractors/    # ContractorCard, ContractorGrid, FilterPanel
│           │   ├── orders/         # OrderCard, OrderForm
│           │   ├── portfolio/      # PortfolioGrid, PortfolioUploader
│           │   ├── auth/           # LoginForm, RegisterForm, ProtectedRoute
│           │   └── shared/         # SearchBar, Pagination, RatingStars
│           ├── hooks/              # useAuth, useContractors, useOrders
│           ├── lib/                # api-client, auth, utils
│           └── styles/             # globals.css
│
├── docs/                           # документация
│   ├── ARCHITECTURE.md
│   ├── KANBAN.md
│   ├── DATA_MODEL.md
│   ├── API_SPEC.md
│   ├── CATEGORIES.md
│   ├── CITIES.md
│   └── CONVENTIONS.md
│
└── scripts/                        # вспомогательные скрипты
    └── db-setup.sh
```

## Принципы архитектуры

### 1. Монорепо с общими типами
Пакет `@remont/shared` содержит все TypeScript-типы и Zod-схемы.
Frontend и backend используют одни и те же схемы валидации — исключает рассинхрон.

### 2. API-first
Каждый эндпоинт задокументирован в `docs/API_SPEC.md`.
Все ответы имеют формат:
```json
{
  "data": { ... },
  "error": null
}
```
или
```json
{
  "data": null,
  "error": { "code": "VALIDATION_ERROR", "message": "..." }
}
```

### 3. Ролевая модель
| Роль | Права |
|---|---|
| `customer` | Создавать заказы, просматривать исполнителей, писать отзывы |
| `contractor` | Отмечать компетенции, загружать портфолио, откликаться на заказы |

Один пользователь может иметь только одну роль.

### 4. Рейтинг по категориям
Рейтинг не привязан к пользователю глобально. Он привязан к паре
(исполнитель, категория). Один исполнитель может иметь 5★ за плитку
и 3★ за электрику.

### 5. Аутентификация (JWT)
- Токен выдаётся при логине, срок 7 дней
- Хранится в localStorage
- Передаётся в заголовке `Authorization: Bearer <token>`
- Middleware проверяет токен на защищённых маршрутах

### 6. Загрузка файлов (MVP)
Фото портфолио хранятся локально в `/public/uploads/portfolio/`.
В будущем — миграция на S3.

### 7. Feature Flags
Закладываем таблицу `feature_flags` с первого дня:
- `FLAG_SUBSCRIPTIONS` — подписка для исполнителей
- `FLAG_BANNER_ADS` — рекламные баннеры
- `FLAG_AI_MATCHING` — AI-подбор исполнителей

Все новые фичи скрываются за флагами. В MVP все флаги выключены.

### 8. Готовность к AI-подбору (будущее)
- Категории имеют поле `metadata` (JSONB) с атрибутами (единица измерения, тип материала)
- Заказы имеют поле `project_description` (text) — свободное описание проекта
- AI-модуль будет отдельным микросервисом, общающимся через API

### 9. Готовность к мобильному приложению
- API полностью stateless (JWT)
- CORS настроен
- Все эндпоинты версионированы (`/api/v1/`)

## Потоки данных

### Поиск исполнителя (заказчик)
```
1. Заходит на /contractors
2. Выбирает категорию (checkboxes)
3. Выставляет фильтры (рейтинг, город)
4. Frontend → GET /api/v1/contractors?category_id=X&rating=4&city_id=Y
5. Backend → Prisma-запрос с JOIN по ContractorSkill + Portfolio
6. Возвращает пагинированный список
7. Заказчик открывает профиль /contractors/:id
8. Видит рейтинг по категориям, портфолио, отзывы
```

### Создание заказа (заказчик)
```
1. Заходит в ЛК → «Создать заказ»
2. Заполняет форму (категория, описание, бюджет, срок, город)
3. Frontend → POST /api/v1/orders { category_id, title, description, budget, deadline, city_id }
4. Заказ появляется на доске /orders
5. Исполнители видят заказ в своей ленте (по совпадению категорий)
```

### Отклик исполнителя
```
1. Исполнитель видит заказ на /orders
2. Нажимает «Откликнуться»
3. Предлагает цену (опционально), пишет сообщение
4. POST /api/v1/orders/:id/respond { price_offer, message }
5. Заказчик видит отклики в своём ЛК
```

### Рейтинг после выполнения
```
1. Заказчик отмечает заказ выполненным
2. Система предлагает оставить отзыв
3. POST /api/v1/reviews { order_id, contractor_id, rating, text }
4. Рейтинг исполнителя по данной категории пересчитывается
   (среднее арифметическое по всем отзывам в этой категории)
```

## База данных

Основная БД: PostgreSQL 16
ORM: Prisma
Полная схема: см. `docs/DATA_MODEL.md`

## Деплой (MVP)

Варианты:
- **VPS + Docker** — аренда сервера в Беларуси (hoster.by, activecloud.by)
- **Railway** — удобно для старта, автоматический деплой из GitHub

На старте достаточно одного сервера (Next.js + PostgreSQL).
В будущем — PostgreSQL выносится отдельно.