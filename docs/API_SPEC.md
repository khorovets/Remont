# Спецификация API v1

Базовый URL: `/api/v1`

Все ответы имеют единый формат:
```json
{
  "data": { ... },
  "error": null
}
```
При ошибке:
```json
{
  "data": null,
  "error": { "code": "ERROR_CODE", "message": "Описание ошибки" }
}
```

Коды ошибок:
| Код | Описание |
|---|---|
| `VALIDATION_ERROR` | Неверные входные данные |
| `UNAUTHORIZED` | Требуется авторизация |
| `FORBIDDEN` | Недостаточно прав |
| `NOT_FOUND` | Ресурс не найден |
| `CONFLICT` | Конфликт (дубликат) |
| `INTERNAL_ERROR` | Внутренняя ошибка сервера |

Аутентификация: `Authorization: Bearer <jwt_token>`
(указывается для защищённых эндпоинтов)

---

## 1. Аутентификация

### POST /api/v1/auth/register
Регистрация нового пользователя.
- Доступ: публичный
- Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "role": "CUSTOMER" | "CONTRACTOR",
  "first_name": "Имя",
  "last_name": "Фамилия",
  "phone": "+375291234567",
  "city_id": 1
}
```
- Response 201:
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "CONTRACTOR",
    "first_name": "Имя",
    "last_name": "Фамилия",
    "token": "eyJhbGciOi..."
  }
}
```

### POST /api/v1/auth/login
Вход в систему.
- Доступ: публичный
- Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- Response 200:
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "CONTRACTOR",
    "first_name": "Имя",
    "last_name": "Фамилия",
    "token": "eyJhbGciOi..."
  }
}
```

### GET /api/v1/auth/me
Текущий пользователь по токену.
- Доступ: авторизованный
- Response 200:
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "CONTRACTOR",
    "first_name": "Имя",
    "last_name": "Фамилия",
    "phone": "+375291234567",
    "avatar_url": null,
    "city_id": 1,
    "about": "...",
    "experience_years": 5
  }
}
```

---

## 2. Профиль пользователя

### PATCH /api/v1/profile
Редактирование своего профиля.
- Доступ: авторизованный
- Body (все поля опциональны):
```json
{
  "first_name": "Имя",
  "last_name": "Фамилия",
  "phone": "+375291234567",
  "city_id": 1,
  "about": "Текст о себе",
  "experience_years": 5
}
```
- Response 200:
```json
{
  "data": { "id": 1, ...обновлённые поля }
}
```

### GET /api/v1/profile/:id
Публичный профиль пользователя.
- Доступ: публичный
- Response 200:
```json
{
  "data": {
    "id": 1,
    "role": "CONTRACTOR",
    "first_name": "Имя",
    "last_name": "Фамилия",
    "avatar_url": null,
    "city": { "id": 1, "name": "Минск" },
    "about": "...",
    "experience_years": 5,
    "skills": [
      {
        "category_id": 12,
        "category_name": "Укладка плитки на стены",
        "rating": 4.8,
        "reviews_count": 15
      }
    ],
    "portfolio": [
      {
        "id": 1,
        "category_id": 12,
        "category_name": "Укладка плитки на стены",
        "photo_url": "/uploads/portfolio/1.jpg",
        "description": "Ванная комната 4м²"
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "text": "Отличная работа!",
        "customer_name": "Анна",
        "category_name": "Укладка плитки на стены",
        "created_at": "2024-01-15T..."
      }
    ]
  }
}
```

---

## 3. Компетенции исполнителя (ContractorSkill)

### GET /api/v1/profile/skills
Свои компетенции.
- Доступ: CONTRACTOR
- Response 200:
```json
{
  "data": [
    {
      "category_id": 12,
      "category_name": "Укладка плитки на стены",
      "category_group": "Плиточные работы",
      "rating": 4.8,
      "reviews_count": 15
    }
  ]
}
```

### PUT /api/v1/profile/skills
Сохранить список своих компетенций (полная замена).
- Доступ: CONTRACTOR
- Body:
```json
{
  "category_ids": [12, 15, 20, 33]
}
```
- Response 200:
```json
{
  "data": {
    "added": 4,
    "removed": 0
  }
}
```

---

## 4. Портфолио

### POST /api/v1/portfolio
Загрузить фото работы.
- Доступ: CONTRACTOR
- Content-Type: `multipart/form-data`
- Поля:
  - `photo` (file) — изображение (jpg, png, webp, макс 5MB)
  - `category_id` (int)
  - `description` (string, опционально)
- Response 201:
```json
{
  "data": {
    "id": 1,
    "category_id": 12,
    "photo_url": "/uploads/portfolio/1_1234567890.jpg",
    "description": "Ванная комната 4м²"
  }
}
```

### GET /api/v1/portfolio/:contractor_id
Портфолио исполнителя, сгруппированное по категориям.
- Доступ: публичный
- Query: `?category_id=12` (опционально — фильтр по категории)
- Response 200:
```json
{
  "data": {
    "by_category": [
      {
        "category_id": 12,
        "category_name": "Укладка плитки на стены",
        "photos": [
          { "id": 1, "photo_url": "...", "description": "..." }
        ]
      }
    ]
  }
}
```

### DELETE /api/v1/portfolio/:id
Удалить фото из портфолио.
- Доступ: CONTRACTOR (владелец)
- Response 200:
```json
{ "data": { "deleted": true } }
```

---

## 5. Справочники

### GET /api/v1/categories
Список всех категорий.
- Доступ: публичный
- Query: `?group_id=1` (опционально — по группе)
- Response 200:
```json
{
  "data": [
    {
      "id": 12,
      "name": "Укладка плитки на стены",
      "slug": "ukladka-plitki-steny",
      "group_name": "Плиточные работы",
      "group_id": 3
    }
  ]
}
```

### GET /api/v1/categories/groups
Только группы (13).
- Доступ: публичный
- Response 200:
```json
{
  "data": [
    { "id": 1, "name": "Строительные работы", "slug": "stroitelnye-raboty" }
  ]
}
```

### GET /api/v1/cities
Список городов.
- Доступ: публичный
- Query: `?region_id=7&search=мин`
- Response 200:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Минск",
      "slug": "minsk",
      "region_id": 7,
      "region_name": "г. Минск"
    }
  ]
}
```

### GET /api/v1/regions
Список областей.
- Доступ: публичный
- Response 200:
```json
{
  "data": [
    { "id": 1, "name": "Брестская область", "slug": "brestskaya-oblast" }
  ]
}
```

---

## 6. Каталог исполнителей

### GET /api/v1/contractors
Список исполнителей с фильтрацией и пагинацией.
- Доступ: публичный
- Query-параметры:

| Параметр | Тип | Описание |
|---|---|---|
| `category_id` | int[] | Фильтр по категориям (можно несколько: `?category_id=12&category_id=15`) |
| `rating` | int | Минимальный рейтинг (1-5) |
| `city_id` | int | Город |
| `region_id` | int | Область |
| `search` | string | Поиск по имени |
| `sort` | string | `rating` (по умолчанию) или `reviews` |
| `page` | int | Страница (по умолчанию 1) |
| `limit` | int | На странице (по умолчанию 20, макс 50) |

- Response 200:
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "first_name": "Иван",
        "last_name": "Петров",
        "avatar_url": null,
        "city_name": "Минск",
        "experience_years": 7,
        "skills": [
          {
            "category_id": 12,
            "category_name": "Укладка плитки на стены",
            "rating": 4.8,
            "reviews_count": 15
          }
        ],
        "portfolio_preview": [
          "/uploads/portfolio/1_thumb.jpg"
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 145,
      "total_pages": 8
    }
  }
}
```

---

## 7. Заказы

### POST /api/v1/orders
Создать заказ.
- Доступ: CUSTOMER
- Body:
```json
{
  "category_id": 12,
  "title": "Укладка плитки в ванной",
  "description": "Ванная 4м², плитка 30×60, нужна гидроизоляция",
  "project_description": "Полное описание для AI...",
  "budget_min": 500,
  "budget_max": 1000,
  "deadline": "2024-06-15",
  "city_id": 1,
  "address": "ул. Ленина, д. 5, кв. 12"
}
```
- Response 201:
```json
{
  "data": { "id": 42, ...поля заказа }
}
```

### GET /api/v1/orders
Список заказов с фильтрацией.
- Доступ: публичный
- Query-параметры:

| Параметр | Тип | Описание |
|---|---|---|
| `category_id` | int[] | Фильтр по категориям |
| `status` | string | `OPEN` (по умолчанию), `IN_PROGRESS`, `COMPLETED` |
| `city_id` | int | Город |
| `budget_min` | int | Мин. бюджет |
| `budget_max` | int | Макс. бюджет |
| `page` | int | Страница |
| `limit` | int | На странице |

- Response 200:
```json
{
  "data": {
    "items": [
      {
        "id": 42,
        "title": "Укладка плитки в ванной",
        "category_name": "Укладка плитки на стены",
        "status": "OPEN",
        "budget_min": 500,
        "budget_max": 1000,
        "deadline": "2024-06-15",
        "city_name": "Минск",
        "customer_name": "Анна",
        "responses_count": 3,
        "created_at": "2024-05-01T..."
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 50, "total_pages": 3 }
  }
}
```

### GET /api/v1/orders/:id
Детали заказа.
- Доступ: публичный
- Response 200:
```json
{
  "data": {
    "id": 42,
    "title": "Укладка плитки в ванной",
    "category_id": 12,
    "category_name": "Укладка плитки на стены",
    "description": "Ванная 4м²...",
    "budget_min": 500,
    "budget_max": 1000,
    "deadline": "2024-06-15",
    "city_name": "Минск",
    "address": "ул. Ленина, д. 5, кв. 12",
    "status": "OPEN",
    "customer": {
      "id": 5,
      "first_name": "Анна",
      "avatar_url": null
    },
    "responses": [
      {
        "id": 1,
        "contractor_id": 3,
        "contractor_name": "Иван",
        "price_offer": 800,
        "message": "Готов сделать за 3 дня",
        "status": "PENDING",
        "created_at": "..."
      }
    ],
    "created_at": "2024-05-01T..."
  }
}
```

### PATCH /api/v1/orders/:id
Изменить статус заказа (или другие поля).
- Доступ: CUSTOMER (владелец заказа)
- Body:
```json
{
  "status": "COMPLETED"
}
```
- Response 200:
```json
{
  "data": { "id": 42, "status": "COMPLETED" }
}
```

---

## 8. Отклики на заказы

### POST /api/v1/orders/:id/respond
Откликнуться на заказ.
- Доступ: CONTRACTOR
- Body:
```json
{
  "price_offer": 800,
  "message": "Готов выполнить за 3 дня. Примеры работ в профиле."
}
```
- Response 201:
```json
{
  "data": {
    "id": 15,
    "order_id": 42,
    "contractor_id": 3,
    "price_offer": 800,
    "message": "...",
    "status": "PENDING"
  }
}
```

### GET /api/v1/orders/:id/responses
Список откликов на заказ.
- Доступ: CUSTOMER (владелец) или CONTRACTOR (свой отклик)
- Response 200:
```json
{
  "data": [
    {
      "id": 15,
      "contractor_id": 3,
      "contractor_name": "Иван",
      "contractor_rating": 4.8,
      "price_offer": 800,
      "message": "...",
      "status": "PENDING",
      "created_at": "..."
    }
  ]
}
```

### PATCH /api/v1/orders/:id/responses/:response_id
Принять/отклонить отклик.
- Доступ: CUSTOMER (владелец заказа)
- Body:
```json
{
  "status": "ACCEPTED" | "REJECTED"
}
```
- Response 200:
```json
{
  "data": { "id": 15, "status": "ACCEPTED" }
}
```

---

## 9. Личные кабинеты

### GET /api/v1/dashboard/customer/orders
Мои заказы (заказчик).
- Доступ: CUSTOMER
- Query: `?status=OPEN`
- Response 200:
```json
{
  "data": [
    { "id": 42, "title": "...", "status": "OPEN", "responses_count": 3 }
  ]
}
```

### GET /api/v1/dashboard/contractor/responses
Мои отклики (исполнитель).
- Доступ: CONTRACTOR
- Query: `?status=PENDING`
- Response 200:
```json
{
  "data": [
    {
      "id": 15,
      "order_id": 42,
      "order_title": "Укладка плитки в ванной",
      "price_offer": 800,
      "status": "PENDING",
      "created_at": "..."
    }
  ]
}
```

---

## 10. Избранное

### GET /api/v1/favorites
Список избранных исполнителей.
- Доступ: CUSTOMER
- Response 200:
```json
{
  "data": [
    {
      "contractor_id": 1,
      "first_name": "Иван",
      "last_name": "Петров",
      "avatar_url": null,
      "city_name": "Минск",
      "rating_avg": 4.6
    }
  ]
}
```

### POST /api/v1/favorites/:contractor_id
Добавить в избранное.
- Доступ: CUSTOMER
- Response 201:
```json
{ "data": { "added": true } }
```

### DELETE /api/v1/favorites/:contractor_id
Удалить из избранного.
- Доступ: CUSTOMER
- Response 200:
```json
{ "data": { "removed": true } }
```

---

## 11. Отзывы

### POST /api/v1/reviews
Оставить отзыв исполнителю.
- Доступ: CUSTOMER
- Body:
```json
{
  "order_id": 42,
  "contractor_id": 1,
  "category_id": 12,
  "rating": 5,
  "text": "Отличная работа, всё аккуратно и быстро"
}
```
- Response 201:
```json
{
  "data": {
    "id": 25,
    "rating": 5,
    "text": "Отличная работа...",
    "created_at": "..."
  }
}
```

---

## Коды ошибок HTTP

| Код | Значение |
|---|---|
| 200 | Успешно |
| 201 | Создано |
| 400 | Ошибка валидации |
| 401 | Не авторизован |
| 403 | Доступ запрещён |
| 404 | Не найдено |
| 409 | Конфликт |
| 500 | Ошибка сервера |