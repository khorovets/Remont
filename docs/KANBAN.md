# Kanban задач проекта Remont.by

> Каждая задача атомарна: 1 задача = 1 файл / 1 компонент / 1 эндпоинт.
> Задачи выполняются строго по порядку ID.
> После выполнения ставить `[x]` и коммитить.

---

## Фаза 0. Инфраструктура проекта

- [ ] **0.1** Инициализация монорепо (pnpm workspaces)
  - Файлы: `package.json`, `pnpm-workspace.yaml`, `turbo.json`
  - Создать корневой package.json с workspaces

- [ ] **0.2** Конфигурация TypeScript
  - Файлы: `tsconfig.base.json`, `packages/shared/tsconfig.json`, `packages/frontend/tsconfig.json`
  - Общий базовый tsconfig + расширения для shared и frontend

- [ ] **0.3** ESLint + Prettier
  - Файлы: `.eslintrc.js`, `.prettierrc`, `.eslintignore`, `.prettierignore`
  - Конфиг ESLint для Next.js + TypeScript

- [ ] **0.4** Переменные окружения
  - Файл: `.env.example`
  - DATABASE_URL, JWT_SECRET, переменные

- [ ] **0.5** Docker Compose для БД
  - Файл: `docker-compose.yml`
  - PostgreSQL 16 + pgAdmin, порты, volumes

- [ ] **0.6** Инициализация пакета shared
  - Файл: `packages/shared/package.json`
  - Пустая точка входа, экспорт

- [ ] **0.7** Инициализация Next.js приложения
  - Файлы: `packages/frontend/package.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`
  - Next.js 14, Tailwind CSS, shadcn/ui config

- [ ] **0.8** Структура папок проекта
  - Создать все директории согласно ARCHITECTURE.md
  - Директории: `src/app/(public)/`, `src/app/(dashboard)/`, `src/components/ui/`, `src/components/layout/`, `src/components/contractors/`, `src/components/orders/`, `src/components/portfolio/`, `src/components/auth/`, `src/components/shared/`, `src/hooks/`, `src/lib/`, `src/styles/`

- [ ] **0.9** README.md с инструкцией по запуску
  - Файл: `README.md`
  - Описание проекта, как развернуть, как запустить, ссылки на документацию

- [ ] **0.10** Глобальные стили Tailwind
  - Файл: `packages/frontend/src/styles/globals.css`
  - Tailwind директивы, базовые стили, переменные

---

## Фаза 1. База данных (Prisma)

- [ ] **1.1** Prisma модель User + Role enum
  - Файл: `packages/frontend/prisma/schema.prisma`
  - Модель User со всеми полями согласно DATA_MODEL.md

- [ ] **1.2** Prisma модель Region + City
  - Добавить в schema.prisma
  - Модели Region и City

- [ ] **1.3** Prisma модель Category
  - Добавить в schema.prisma
  - Модель Category с parent_id (дерево)

- [ ] **1.4** Prisma модель ContractorSkill
  - Добавить в schema.prisma
  - Связь User ↔ Category, поля rating, reviews_count

- [ ] **1.5** Prisma модель Portfolio
  - Добавить в schema.prisma
  - Связь User ↔ Category, поле photo_url

- [ ] **1.6** Prisma модель Order + OrderStatus enum
  - Добавить в schema.prisma
  - Модель Order со всеми полями

- [ ] **1.7** Prisma модель OrderResponse + ResponseStatus enum
  - Добавить в schema.prisma
  - Модель OrderResponse

- [ ] **1.8** Prisma модель Review
  - Добавить в schema.prisma
  - Модель Review

- [ ] **1.9** Prisma модель Message (закладка)
  - Добавить в schema.prisma
  - Модель Message для чата

- [ ] **1.10** Prisma модель Favorite
  - Добавить в schema.prisma
  - Модель Favorite (избранное)

- [ ] **1.11** Prisma модель FeatureFlag
  - Добавить в schema.prisma
  - Модель FeatureFlag

- [ ] **1.12** Prisma модель Subscription + UserSubscription (закладка)
  - Добавить в schema.prisma
  - Обе модели

- [ ] **1.13** Prisma модель AdBanner (закладка)
  - Добавить в schema.prisma
  - Модель AdBanner

- [ ] **1.14** Первая миграция
  - Команда: `npx prisma migrate dev --name init`
  - Проверить что все таблицы создались

- [ ] **1.15** Prisma Client инициализация
  - Файл: `packages/frontend/src/lib/prisma.ts`
  - Singleton PrismaClient

- [ ] **1.16** Сидер категорий
  - Файл: `packages/frontend/prisma/seed.ts`
  - Заполнить 13 групп + ~80 категорий из CATEGORIES.md

- [ ] **1.17** Сидер регионов и городов
  - Добавить в seed.ts
  - Заполнить 7 регионов + ~110 городов из CITIES.md

---

## Фаза 2. Общие типы и схемы (пакет shared)

- [ ] **2.1** Типы пользователя и ролей
  - Файл: `packages/shared/src/types/user.ts`
  - User, Role, безопасный тип (без password_hash)

- [ ] **2.2** Типы категорий, городов, регионов
  - Файл: `packages/shared/src/types/dictionaries.ts`
  - Category, City, Region

- [ ] **2.3** Типы заказов и откликов
  - Файл: `packages/shared/src/types/order.ts`
  - Order, OrderResponse, статусы

- [ ] **2.4** Типы портфолио, отзывов, избранного
  - Файл: `packages/shared/src/types/portfolio.ts`
  - Portfolio, Review, Favorite

- [ ] **2.5** Типы API-ответов
  - Файл: `packages/shared/src/types/api.ts`
  - ApiResponse<T>, ApiError, PaginatedResponse<T>

- [ ] **2.6** Константы (роли, статусы)
  - Файл: `packages/shared/src/constants/index.ts`
  - ROLE, ORDER_STATUS, RESPONSE_STATUS

- [ ] **2.7** Zod-схема регистрации
  - Файл: `packages/shared/src/schemas/auth.ts`
  - registerSchema, loginSchema

- [ ] **2.8** Zod-схема профиля и компетенций
  - Файл: `packages/shared/src/schemas/profile.ts`
  - updateProfileSchema, skillsSchema

- [ ] **2.9** Zod-схема заказа и отклика
  - Файл: `packages/shared/src/schemas/order.ts`
  - createOrderSchema, respondSchema

- [ ] **2.10** Zod-схема отзыва
  - Файл: `packages/shared/src/schemas/review.ts`
  - createReviewSchema

- [ ] **2.11** Баррель-экспорт shared
  - Файл: `packages/shared/src/index.ts`
  - Экспортировать все типы, схемы, константы

---

## Фаза 3. Утилиты и middleware

- [ ] **3.1** JWT-утилиты (создание и проверка токена)
  - Файл: `packages/frontend/src/lib/jwt.ts`
  - Функции createToken, verifyToken (jose)

- [ ] **3.2** Хеширование паролей
  - Файл: `packages/frontend/src/lib/password.ts`
  - Функции hashPassword, comparePassword (bcrypt)

- [ ] **3.3** API-клиент (fetch-обёртка)
  - Файл: `packages/frontend/src/lib/api.ts`
  - Функция apiClient с автоподстановкой JWT и обработкой ошибок

- [ ] **3.4** Утилита форматирования цены
  - Файл: `packages/frontend/src/lib/utils.ts`
  - formatPrice (BYN), formatDate, cn (classnames)

- [ ] **3.5** Auth middleware для API-роутов
  - Файл: `packages/frontend/src/lib/auth-middleware.ts`
  - Функция getAuthUser — извлекает user из JWT из заголовка

- [ ] **3.6** Middleware проверки роли
  - Файл: `packages/frontend/src/lib/role-middleware.ts`
  - Функция requireRole(role) — выбрасывает 403 если роль не та

- [ ] **3.7** Zod-валидация тела запроса
  - Файл: `packages/frontend/src/lib/validate.ts`
  - Функция validateBody(schema) — парсит и возвращает данные или ошибку

- [ ] **3.8** Ответ API (хелпер)
  - Файл: `packages/frontend/src/lib/response.ts`
  - Функции successResponse(data, status), errorResponse(code, message, status)

---

## Фаза 4. API — Аутентификация

- [ ] **4.1** POST /api/v1/auth/register
  - Файл: `packages/frontend/src/app/api/v1/auth/register/route.ts`
  - Регистрация: валидация, проверка дубликата email, хеширование пароля, создание user, возврат JWT

- [ ] **4.2** POST /api/v1/auth/login
  - Файл: `packages/frontend/src/app/api/v1/auth/login/route.ts`
  - Логин: проверка email+пароль, возврат JWT

- [ ] **4.3** GET /api/v1/auth/me
  - Файл: `packages/frontend/src/app/api/v1/auth/me/route.ts`
  - Возврат текущего пользователя по JWT

---

## Фаза 5. API — Справочники

- [ ] **5.1** GET /api/v1/categories
  - Файл: `packages/frontend/src/app/api/v1/categories/route.ts`
  - Список категорий, опциональный фильтр по group_id

- [ ] **5.2** GET /api/v1/categories/groups
  - Файл: `packages/frontend/src/app/api/v1/categories/groups/route.ts`
  - Только группы (13 штук)

- [ ] **5.3** GET /api/v1/cities
  - Файл: `packages/frontend/src/app/api/v1/cities/route.ts`
  - Список городов с фильтром по region_id и поиском

- [ ] **5.4** GET /api/v1/regions
  - Файл: `packages/frontend/src/app/api/v1/regions/route.ts`
  - Список областей (7)

---

## Фаза 6. API — Профиль и компетенции

- [ ] **6.1** GET /api/v1/profile/[id]
  - Файл: `packages/frontend/src/app/api/v1/profile/[id]/route.ts`
  - Публичный профиль: user + city + skills + portfolio + reviews

- [ ] **6.2** PATCH /api/v1/profile
  - Файл: `packages/frontend/src/app/api/v1/profile/route.ts`
  - Редактирование своего профиля

- [ ] **6.3** GET /api/v1/profile/skills
  - Файл: `packages/frontend/src/app/api/v1/profile/skills/route.ts`
  - Свои компетенции (CONTRACTOR)

- [ ] **6.4** PUT /api/v1/profile/skills
  - Файл: `packages/frontend/src/app/api/v1/profile/skills/route.ts`
  - Сохранить список компетенций (полная замена)

---

## Фаза 7. API — Портфолио

- [ ] **7.1** POST /api/v1/portfolio
  - Файл: `packages/frontend/src/app/api/v1/portfolio/route.ts`
  - Загрузка фото (multer), запись в БД

- [ ] **7.2** GET /api/v1/portfolio/[contractor_id]
  - Файл: `packages/frontend/src/app/api/v1/portfolio/[contractor_id]/route.ts`
  - Портфолио исполнителя, сгруппированное по категориям

- [ ] **7.3** DELETE /api/v1/portfolio/[id]
  - Файл: `packages/frontend/src/app/api/v1/portfolio/[id]/route.ts`
  - Удаление фото (владелец)

- [ ] **7.4** Конфигурация загрузки файлов (multer)
  - Файл: `packages/frontend/src/lib/upload.ts`
  - Настройка multer: директория, лимиты, фильтры

---

## Фаза 8. API — Каталог исполнителей

- [ ] **8.1** GET /api/v1/contractors
  - Файл: `packages/frontend/src/app/api/v1/contractors/route.ts`
  - Список исполнителей с фильтрацией (category_id, rating, city_id, region_id, search) и пагинацией

---

## Фаза 9. API — Заказы

- [ ] **9.1** POST /api/v1/orders
  - Файл: `packages/frontend/src/app/api/v1/orders/route.ts`
  - Создание заказа (CUSTOMER)

- [ ] **9.2** GET /api/v1/orders
  - Файл: `packages/frontend/src/app/api/v1/orders/route.ts`
  - Список заказов с фильтрацией и пагинацией

- [ ] **9.3** GET /api/v1/orders/[id]
  - Файл: `packages/frontend/src/app/api/v1/orders/[id]/route.ts`
  - Детали заказа с откликами

- [ ] **9.4** PATCH /api/v1/orders/[id]
  - Файл: `packages/frontend/src/app/api/v1/orders/[id]/route.ts`
  - Изменение заказа (статус и т.д.)

---

## Фаза 10. API — Отклики

- [ ] **10.1** POST /api/v1/orders/[id]/respond
  - Файл: `packages/frontend/src/app/api/v1/orders/[id]/respond/route.ts`
  - Отклик на заказ (CONTRACTOR)

- [ ] **10.2** GET /api/v1/orders/[id]/responses
  - Файл: `packages/frontend/src/app/api/v1/orders/[id]/responses/route.ts`
  - Список откликов на заказ

- [ ] **10.3** PATCH /api/v1/orders/[id]/responses/[response_id]
  - Файл: `packages/frontend/src/app/api/v1/orders/[id]/responses/[response_id]/route.ts`
  - Принять/отклонить отклик (CUSTOMER)

---

## Фаза 11. API — Личные кабинеты

- [ ] **11.1** GET /api/v1/dashboard/customer/orders
  - Файл: `packages/frontend/src/app/api/v1/dashboard/customer/orders/route.ts`
  - Мои заказы

- [ ] **11.2** GET /api/v1/dashboard/contractor/responses
  - Файл: `packages/frontend/src/app/api/v1/dashboard/contractor/responses/route.ts`
  - Мои отклики

---

## Фаза 12. API — Избранное

- [ ] **12.1** GET /api/v1/favorites
  - Файл: `packages/frontend/src/app/api/v1/favorites/route.ts`
  - Список избранных

- [ ] **12.2** POST /api/v1/favorites/[contractor_id]
  - Файл: `packages/frontend/src/app/api/v1/favorites/[contractor_id]/route.ts`
  - Добавить в избранное

- [ ] **12.3** DELETE /api/v1/favorites/[contractor_id]
  - Файл: `packages/frontend/src/app/api/v1/favorites/[contractor_id]/route.ts`
  - Удалить из избранного

---

## Фаза 13. API — Отзывы

- [ ] **13.1** POST /api/v1/reviews
  - Файл: `packages/frontend/src/app/api/v1/reviews/route.ts`
  - Создание отзыва с пересчётом рейтинга ContractorSkill

---

## Фаза 14. Frontend — Layout и навигация

- [ ] **14.1** Корневой layout
  - Файл: `packages/frontend/src/app/layout.tsx`
  - html, body, провайдеры

- [ ] **14.2** Компонент Header
  - Файл: `packages/frontend/src/components/layout/Header.tsx`
  - Лого, навигация, кнопки входа/ЛК

- [ ] **14.3** Компонент Footer
  - Файл: `packages/frontend/src/components/layout/Footer.tsx`
  - Ссылки, копирайт

- [ ] **14.4** Компонент Navbar
  - Файл: `packages/frontend/src/components/layout/Navbar.tsx`
  - Основная навигация: каталог, заказы

- [ ] **14.5** Публичный layout (групповой route)
  - Файл: `packages/frontend/src/app/(public)/layout.tsx`
  - Header + Footer обёртка для публичных страниц

- [ ] **14.6** Dashboard layout
  - Файл: `packages/frontend/src/app/(dashboard)/layout.tsx`
  - Боковое меню ЛК + protected route

---

## Фаза 15. Frontend — Аутентификация

- [ ] **15.1** Хук useAuth
  - Файл: `packages/frontend/src/hooks/use-auth.ts`
  - Состояние авторизации, login, register, logout, user

- [ ] **15.2** AuthProvider
  - Файл: `packages/frontend/src/components/auth/AuthProvider.tsx`
  - React Context для авторизации

- [ ] **15.3** Компонент ProtectedRoute
  - Файл: `packages/frontend/src/components/auth/ProtectedRoute.tsx`
  - Редирект на /auth/login если не авторизован

- [ ] **15.4** Страница регистрации
  - Файл: `packages/frontend/src/app/(public)/auth/register/page.tsx`
  - Форма: email, пароль, роль, имя, фамилия, телефон, город

- [ ] **15.5** Компонент RegisterForm
  - Файл: `packages/frontend/src/components/auth/RegisterForm.tsx`
  - React Hook Form + Zod, выбор роли

- [ ] **15.6** Страница входа
  - Файл: `packages/frontend/src/app/(public)/auth/login/page.tsx`
  - Форма входа

- [ ] **15.7** Компонент LoginForm
  - Файл: `packages/frontend/src/components/auth/LoginForm.tsx`
  - React Hook Form + Zod

---

## Фаза 16. Frontend — Главная страница

- [ ] **16.1** Главная страница
  - Файл: `packages/frontend/src/app/page.tsx`
  - Приветствие, топ-исполнители, популярные категории, поиск

- [ ] **16.2** Секция популярных категорий
  - Файл: `packages/frontend/src/components/home/PopularCategories.tsx`
  - Сетка из 6-8 иконок категорий со ссылками на поиск

- [ ] **16.3** Секция топ-исполнителей
  - Файл: `packages/frontend/src/components/home/TopContractors.tsx`
  - Горизонтальная прокрутка топ-5 исполнителей

- [ ] **16.4** Секция последних заказов
  - Файл: `packages/frontend/src/components/home/RecentOrders.tsx`
  - 5 последних открытых заказов

---

## Фаза 17. Frontend — Каталог исполнителей

- [ ] **17.1** Страница каталога исполнителей
  - Файл: `packages/frontend/src/app/(public)/contractors/page.tsx`
  - Серверный компонент, принимает searchParams

- [ ] **17.2** Компонент ContractorCard
  - Файл: `packages/frontend/src/components/contractors/ContractorCard.tsx`
  - Карточка: фото, имя, рейтинг, категории, город

- [ ] **17.3** Компонент ContractorGrid
  - Файл: `packages/frontend/src/components/contractors/ContractorGrid.tsx`
  - Сетка из ContractorCard

- [ ] **17.4** Компонент FilterPanel
  - Файл: `packages/frontend/src/components/contractors/FilterPanel.tsx`
  - Чекбоксы категорий, слайдер рейтинга, выбор города

- [ ] **17.5** Компонент FilterCategories
  - Файл: `packages/frontend/src/components/contractors/FilterCategories.tsx`
  - Группы с чекбоксами категорий внутри

- [ ] **17.6** Компонент FilterRating
  - Файл: `packages/frontend/src/components/contractors/FilterRating.tsx`
  - Radio: не важно / от 3★ / от 4★ / от 5★

- [ ] **17.7** Компонент FilterCity
  - Файл: `packages/frontend/src/components/contractors/FilterCity.tsx`
  - Select/autocomplete выбора города

- [ ] **17.8** Компонент SearchBar
  - Файл: `packages/frontend/src/components/shared/SearchBar.tsx`
  - Поиск по имени исполнителя

- [ ] **17.9** Компонент Pagination
  - Файл: `packages/frontend/src/components/shared/Pagination.tsx`
  - Пагинация с номерами страниц

- [ ] **17.10** Хук useContractors
  - Файл: `packages/frontend/src/hooks/use-contractors.ts`
  - Хук для загрузки списка с параметрами фильтрации

- [ ] **17.11** Компонент RatingStars
  - Файл: `packages/frontend/src/components/shared/RatingStars.tsx`
  - Отображение звёзд рейтинга

- [ ] **17.12** Скелетон ContractorCardSkeleton
  - Файл: `packages/frontend/src/components/contractors/ContractorCardSkeleton.tsx`
  - Плейсхолдер при загрузке

---

## Фаза 18. Frontend — Профиль исполнителя

- [ ] **18.1** Страница профиля исполнителя
  - Файл: `packages/frontend/src/app/(public)/contractors/[id]/page.tsx`
  - Серверный компонент, данные с API

- [ ] **18.2** Компонент ContractorProfileHeader
  - Файл: `packages/frontend/src/components/contractors/ContractorProfileHeader.tsx`
  - Имя, фото, город, опыт, о себе

- [ ] **18.3** Компонент SkillsList
  - Файл: `packages/frontend/src/components/contractors/SkillsList.tsx`
  - Список компетенций с рейтингом по каждой

- [ ] **18.4** Компонент PortfolioGrid (на странице профиля)
  - Файл: `packages/frontend/src/components/portfolio/PortfolioGrid.tsx`
  - Сетка фото работ сгруппированная по категориям

- [ ] **18.5** Компонент ReviewsList
  - Файл: `packages/frontend/src/components/contractors/ReviewsList.tsx`
  - Список отзывов с рейтингом

- [ ] **18.6** Компонент ReviewCard
  - Файл: `packages/frontend/src/components/contractors/ReviewCard.tsx`
  - Один отзыв

---

## Фаза 19. Frontend — Доска заказов

- [ ] **19.1** Страница доски заказов
  - Файл: `packages/frontend/src/app/(public)/orders/page.tsx`
  - Список заказов с фильтрацией

- [ ] **19.2** Компонент OrderCard
  - Файл: `packages/frontend/src/components/orders/OrderCard.tsx`
  - Карточка заказа в списке

- [ ] **19.3** Компонент OrderFilters
  - Файл: `packages/frontend/src/components/orders/OrderFilters.tsx`
  - Фильтры: категория, бюджет, город, статус

- [ ] **19.4** Страница карточки заказа
  - Файл: `packages/frontend/src/app/(public)/orders/[id]/page.tsx`
  - Детали заказа + блок откликов + кнопка «Откликнуться»

- [ ] **19.5** Компонент OrderDetail
  - Файл: `packages/frontend/src/components/orders/OrderDetail.tsx`
  - Детали: описание, бюджет, сроки, заказчик

- [ ] **19.6** Компонент ResponseList
  - Файл: `packages/frontend/src/components/orders/ResponseList.tsx`
  - Список откликов на заказ (видно владельцу)

- [ ] **19.7** Компонент RespondForm
  - Файл: `packages/frontend/src/components/orders/RespondForm.tsx`
  - Форма отклика: цена, сообщение

---

## Фаза 20. Frontend — Создание заказа

- [ ] **20.1** Компонент OrderForm
  - Файл: `packages/frontend/src/components/orders/OrderForm.tsx`
  - Полная форма создания заказа: категория, описание, бюджет, срок, город, адрес

---

## Фаза 21. Frontend — Личный кабинет (общее)

- [ ] **21.1** Страница ЛК — профиль
  - Файл: `packages/frontend/src/app/(dashboard)/profile/page.tsx`
  - Редактирование профиля

- [ ] **21.2** Компонент ProfileEditForm
  - Файл: `packages/frontend/src/components/auth/ProfileEditForm.tsx`
  - Форма: имя, фамилия, телефон, город, о себе

---

## Фаза 22. Frontend — ЛК Исполнителя

- [ ] **22.1** Страница ЛК — мои компетенции
  - Файл: `packages/frontend/src/app/(dashboard)/skills/page.tsx`
  - Управление списком компетенций

- [ ] **22.2** Компонент SkillsCheckboxGroup
  - Файл: `packages/frontend/src/components/contractors/SkillsCheckboxGroup.tsx`
  - Чекбоксы категорий, сохранение через PUT /api/v1/profile/skills

- [ ] **22.3** Страница ЛК — портфолио
  - Файл: `packages/frontend/src/app/(dashboard)/portfolio/page.tsx`
  - Загрузка фото, просмотр своих работ

- [ ] **22.4** Компонент PortfolioUploader
  - Файл: `packages/frontend/src/components/portfolio/PortfolioUploader.tsx`
  - Кнопка загрузки, выбор категории, описание, превью

- [ ] **22.5** Страница ЛК — мои отклики
  - Файл: `packages/frontend/src/app/(dashboard)/responses/page.tsx`
  - Список своих откликов на заказы

---

## Фаза 23. Frontend — ЛК Заказчика

- [ ] **23.1** Страница ЛК — мои заказы
  - Файл: `packages/frontend/src/app/(dashboard)/orders/page.tsx`
  - Список своих заказов, кнопка «Создать заказ»

- [ ] **23.2** Компонент MyOrdersList
  - Файл: `packages/frontend/src/components/orders/MyOrdersList.tsx`
  - Список заказов со статусами и количеством откликов

- [ ] **23.3** Страница ЛК — избранное
  - Файл: `packages/frontend/src/app/(dashboard)/favorites/page.tsx`
  - Список избранных исполнителей

---

## Фаза 24. Оптимизация, рефакторинг, тесты

- [ ] **24.1** Добавить loading.tsx для всех страниц со списками
  - Файлы: `loading.tsx` в папках `contractors/`, `orders/`, `dashboard/*/`

- [ ] **24.2** Добавить error.tsx для всех страниц
  - Файлы: `error.tsx` в ключевых папках

- [ ] **24.3** Мета-теги (SEO) для публичных страниц
  - Добавить generateMetadata на ключевые страницы

- [ ] **24.4** Оптимизация Prisma-запросов (select вместо include)
  - Рефакторинг всех API-роутов: заменить include на select

- [ ] **24.5** Настройка Vitest
  - Файл: `vitest.config.ts`
  - Конфигурация для unit-тестов

- [ ] **24.6** Тест: регистрация и логин
  - Файл: `packages/frontend/src/__tests__/auth.test.ts`
  - Unit-тесты на функции API

- [ ] **24.7** Тест: CRUD заказов
  - Файл: `packages/frontend/src/__tests__/orders.test.ts`

- [ ] **24.8** Тест: отклики на заказы
  - Файл: `packages/frontend/src/__tests__/responses.test.ts`

- [ ] **24.9** Тест: фильтрация исполнителей
  - Файл: `packages/frontend/src/__tests__/contractors.test.ts`

- [ ] **24.10** Настройка Playwright для E2E
  - Файл: `playwright.config.ts`

- [ ] **24.11** E2E: регистрация → поиск → создание заказа → отклик
  - Файл: `packages/frontend/e2e/critical-path.spec.ts`

- [ ] **24.12** Финальный рефакторинг и проверка
  - Пройти все страницы, проверить воркфлоу

---

## Фаза 25. Деплой

- [x] **25.1** Конфигурация CI/CD (GitHub Actions)
  - Файл: `.github/workflows/ci.yml`
  - Шаги: checkout → setup pnpm → install → typecheck → lint → test
  - Review agent: `scripts/review-and-merge.sh` (авто-апрув + squash merge)
  - Документация: `docs/CI_CD.md` (branch protection, токен, вмешательство человека)

- [ ] **25.2** Подготовка к деплою
  - Проверка .env, настройка CORS, проверка безопасности

- [ ] **25.3** Деплой на VPS / Railway
  - Инструкция в README.md

---

**Всего задач: ~140**