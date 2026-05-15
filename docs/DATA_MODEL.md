# Модель данных (Prisma Schema)

Полная схема БД PostgreSQL. ORM: Prisma.

## Список таблиц

| Таблица | Назначение |
|---|---|
| `users` | Пользователи (заказчики и исполнители) |
| `regions` | Области Беларуси |
| `cities` | Города Беларуси |
| `categories` | Категории ремонтных работ |
| `contractor_skills` | Компетенции исполнителя (связь user↔category + рейтинг) |
| `portfolio` | Фото работ исполнителя по категориям |
| `orders` | Заказы от заказчиков |
| `order_responses` | Отклики исполнителей на заказы |
| `reviews` | Отзывы заказчиков об исполнителях |
| `messages` | Сообщения чата (MVP: закладка) |
| `favorites` | Избранные исполнители у заказчика |
| `feature_flags` | Функциональные флаги для постепенного включения фич |
| `subscriptions` | Тарифы подписки (закладка) |
| `user_subscriptions` | Подписки пользователей (закладка) |
| `ad_banners` | Рекламные баннеры (закладка) |

---

## Полная Prisma-схема

### users
```prisma
model User {
  id             Int       @id @default(autoincrement())
  email          String    @unique
  password_hash  String
  role           Role      @default(CUSTOMER)  // CUSTOMER | CONTRACTOR
  first_name     String?
  last_name      String?
  phone          String?
  avatar_url     String?
  city_id        Int?
  city           City?     @relation(fields: [city_id], references: [id])
  about          String?   @db.Text              // описание исполнителя
  experience_years Int?                           // опыт (лет)
  created_at     DateTime  @default(now())
  updated_at     DateTime  @updatedAt

  skills         ContractorSkill[]
  portfolio      Portfolio[]
  orders         Order[]          // заказы, которые создал (как заказчик)
  responses      OrderResponse[]   // отклики (как исполнитель)
  reviews_given  Review[]          @relation("ReviewAuthor")   // отзывы, которые написал
  reviews_received Review[]        @relation("ReviewTarget")   // отзывы, которые получил
  favorites      Favorite[]        // избранные (как заказчик)
  favorited_by   Favorite[]        @relation("FavoritedContractor")
  user_subscriptions UserSubscription[]
  messages_sent  Message[]         @relation("MessageSender")
  messages_received Message[]      @relation("MessageReceiver")

  @@map("users")
}

enum Role {
  CUSTOMER
  CONTRACTOR
}
```

### regions
```prisma
model Region {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  sort_order Int     @default(0)
  cities    City[]

  @@map("regions")
}
```

### cities
```prisma
model City {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  region_id Int
  region    Region   @relation(fields: [region_id], references: [id])
  sort_order Int     @default(0)
  users     User[]

  @@map("cities")
}
```

### categories
```prisma
model Category {
  id         Int      @id @default(autoincrement())
  parent_id  Int?
  parent     Category? @relation("CategoryTree", fields: [parent_id], references: [id])
  children   Category[] @relation("CategoryTree")
  name       String
  slug       String   @unique
  metadata   Json     @default("{}")       // { unit, material, surface, ... }
  sort_order Int      @default(0)
  created_at DateTime @default(now())

  skills     ContractorSkill[]
  portfolio  Portfolio[]
  orders     Order[]

  @@map("categories")
}
```

### contractor_skills
```prisma
model ContractorSkill {
  id            Int      @id @default(autoincrement())
  contractor_id Int
  contractor    User     @relation(fields: [contractor_id], references: [id], onDelete: Cascade)
  category_id   Int
  category      Category @relation(fields: [category_id], references: [id])
  rating        Float    @default(0)       // средний рейтинг (0–5)
  reviews_count Int      @default(0)       // количество отзывов
  created_at    DateTime @default(now())

  @@unique([contractor_id, category_id])
  @@map("contractor_skills")
}
```

### portfolio
```prisma
model Portfolio {
  id            Int      @id @default(autoincrement())
  contractor_id Int
  contractor    User     @relation(fields: [contractor_id], references: [id], onDelete: Cascade)
  category_id   Int
  category      Category @relation(fields: [category_id], references: [id])
  photo_url     String                         // путь к файлу
  description   String?  @db.Text               // описание работы
  created_at    DateTime @default(now())

  @@map("portfolio")
}
```

### orders
```prisma
model Order {
  id              Int      @id @default(autoincrement())
  customer_id     Int
  customer        User     @relation(fields: [customer_id], references: [id])
  category_id     Int
  category        Category @relation(fields: [category_id], references: [id])
  title           String                            // краткое название
  description     String   @db.Text                 // описание работ
  project_description String? @db.Text              // полное описание для AI-анализа (будущее)
  budget_min      Int?                              // BYN
  budget_max      Int?                              // BYN
  deadline        DateTime?                         // желаемый срок завершения
  city_id         Int?
  city            City?    @relation(fields: [city_id], references: [id])
  address         String?                           // адрес объекта
  status          OrderStatus @default(OPEN)        // OPEN → IN_PROGRESS → COMPLETED → CANCELLED
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt

  responses       OrderResponse[]
  reviews         Review[]

  @@map("orders")
}

enum OrderStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### order_responses
```prisma
model OrderResponse {
  id            Int      @id @default(autoincrement())
  order_id      Int
  order         Order    @relation(fields: [order_id], references: [id], onDelete: Cascade)
  contractor_id Int
  contractor    User     @relation(fields: [contractor_id], references: [id])
  price_offer   Int?                               // BYN, предложение цены
  message       String?  @db.Text                   // сопроводительное сообщение
  status        ResponseStatus @default(PENDING)    // PENDING → ACCEPTED → REJECTED
  created_at    DateTime @default(now())

  @@unique([order_id, contractor_id])
  @@map("order_responses")
}

enum ResponseStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

### reviews
```prisma
model Review {
  id            Int      @id @default(autoincrement())
  order_id      Int
  order         Order    @relation(fields: [order_id], references: [id])
  customer_id   Int
  customer      User     @relation("ReviewAuthor", fields: [customer_id], references: [id])
  contractor_id Int
  contractor    User     @relation("ReviewTarget", fields: [contractor_id], references: [id])
  category_id   Int
  category      Category @relation(fields: [category_id], references: [id])
  rating        Int                                    // 1–5
  text          String?  @db.Text                       // текст отзыва
  created_at    DateTime @default(now())

  @@map("reviews")
}
```

### messages (закладка для чата)
```prisma
model Message {
  id          Int      @id @default(autoincrement())
  sender_id   Int
  sender      User     @relation("MessageSender", fields: [sender_id], references: [id])
  receiver_id Int
  receiver    User     @relation("MessageReceiver", fields: [receiver_id], references: [id])
  order_id    Int?                               // привязка к заказу (опционально)
  text        String   @db.Text
  is_read     Boolean  @default(false)
  created_at  DateTime @default(now())

  @@map("messages")
}
```

### favorites
```prisma
model Favorite {
  id            Int      @id @default(autoincrement())
  customer_id   Int
  customer      User     @relation(fields: [customer_id], references: [id], onDelete: Cascade)
  contractor_id Int
  contractor    User     @relation("FavoritedContractor", fields: [contractor_id], references: [id], onDelete: Cascade)
  created_at    DateTime @default(now())

  @@unique([customer_id, contractor_id])
  @@map("favorites")
}
```

### feature_flags
```prisma
model FeatureFlag {
  id         Int      @id @default(autoincrement())
  key        String   @unique        // e.g. "FLAG_SUBSCRIPTIONS", "FLAG_BANNER_ADS"
  enabled    Boolean  @default(false)
  created_at DateTime @default(now())

  @@map("feature_flags")
}
```

### subscriptions (закладка на будущее)
```prisma
model Subscription {
  id          Int      @id @default(autoincrement())
  name        String                           // название тарифа
  price       Int                              // BYN/мес
  duration_days Int                             // на сколько дней
  features    Json     @default("[]")           // список возможностей
  created_at  DateTime @default(now())

  user_subscriptions UserSubscription[]

  @@map("subscriptions")
}
```

### user_subscriptions (закладка на будущее)
```prisma
model UserSubscription {
  id              Int      @id @default(autoincrement())
  user_id         Int
  user            User     @relation(fields: [user_id], references: [id])
  subscription_id Int
  subscription    Subscription @relation(fields: [subscription_id], references: [id])
  starts_at       DateTime @default(now())
  expires_at      DateTime
  is_active       Boolean  @default(true)
  created_at      DateTime @default(now())

  @@map("user_subscriptions")
}
```

### ad_banners (закладка на будущее)
```prisma
model AdBanner {
  id          Int      @id @default(autoincrement())
  title       String?
  image_url   String
  link_url    String?
  placement   String                             // где показывать: "sidebar", "top", "list"
  is_active   Boolean  @default(false)
  starts_at   DateTime?
  ends_at     DateTime?
  created_at  DateTime @default(now())

  @@map("ad_banners")
}
```

---

## Схема связей (текст)

```
Region 1──┬──N City
           │
City   1──┬──N User
           │
User   1──┬──N ContractorSkill
Category 1──┬──N ContractorSkill
            │
User   1──┬──N Portfolio
Category 1──┬──N Portfolio
           │
User (customer) 1──┬──N Order
Category          1──┬──N Order
City              1──┬──N Order
                    │
Order  1──┬──N OrderResponse
User (contractor) 1──┬──N OrderResponse
                      │
Order  1──┬──N Review
User (customer)   1──┬──N Review
User (contractor) 1──┬──N Review
Category          1──┬──N Review
                      │
User (sender)    1──┬──N Message
User (receiver)  1──┬──N Message
                     │
User (customer)    1──┬──N Favorite
User (contractor)  1──┬──N Favorite
```

---

## Индексы

| Таблица | Индекс | Тип |
|---|---|---|
| `users` | `email` | UNIQUE |
| `users` | `city_id` | INDEX |
| `users` | `role` | INDEX |
| `contractor_skills` | `(contractor_id, category_id)` | UNIQUE |
| `contractor_skills` | `category_id, rating` | INDEX (для сортировки по рейтингу) |
| `portfolio` | `contractor_id, category_id` | INDEX |
| `orders` | `status, created_at` | INDEX |
| `orders` | `category_id` | INDEX |
| `orders` | `city_id` | INDEX |
| `order_responses` | `(order_id, contractor_id)` | UNIQUE |
| `reviews` | `contractor_id, category_id` | INDEX |
| `favorites` | `(customer_id, contractor_id)` | UNIQUE |
| `feature_flags` | `key` | UNIQUE |