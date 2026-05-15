# Правила оформления кода

Соглашения по коду, которых должен придерживаться Kanban-агент при выполнении задач.

## Общие принципы

### 1. Атомарные задачи
- Одна задача = один файл или один компонент (15–60 минут работы)
- Не смешивать несвязанные изменения в одной задаче
- После выполнения задачи — ставить `[x]` в KANBAN.md

### 2. Порядок выполнения
- Задачи выполняются строго по порядку ID (0.1, 0.2, ...)
- Не пропускать задачи — каждая имеет зависимости
- Если задача не может быть выполнена (не хватает зависимостей) — пропустить и вернуться позже

### 3. Каждая задача завершается
- Код должен компилироваться/проходить typecheck после каждой задачи
- После задачи проект должен оставаться в рабочем состоянии
- Если задача ломает проект — это ошибка

---

## TypeScript

### Конфигурация
- `strict: true` всегда
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `esModuleInterop: true`

### Именование
```typescript
// ✅ Интерфейсы и типы: PascalCase
interface ContractorCardProps { ... }
type OrderStatus = 'OPEN' | 'IN_PROGRESS';

// ✅ Переменные и функции: camelCase
const contractorList = ...
function getContractorById() { ... }

// ✅ Константы: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

// ✅ Файлы: kebab-case
// contractor-card.tsx
// use-auth.ts
// filter-panel.tsx

// ✅ Файлы страниц Next.js: согласно App Router
// page.tsx
// layout.tsx
// loading.tsx
// error.tsx
```

### Импорты
```typescript
// ✅ Порядок импортов:
// 1. React / Next.js
// 2. Сторонние библиотеки
// 3. @remont/shared
// 4. Компоненты (относительные)
// 5. Хуки
// 6. Утилиты

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { ContractorSchema } from '@remont/shared';
import { ContractorCard } from '@/components/contractors';
import { useAuth } from '@/hooks/use-auth';
import { formatPrice } from '@/lib/utils';
```

### Типы
- Все пропсы компонентов — отдельный интерфейс `ComponentNameProps`
- API request/response — Zod-схемы в `packages/shared/src/schemas/`
- Не использовать `any` (кроме крайних случаев с пояснением почему)

---

## Next.js / React

### Компоненты
```typescript
// ✅ Клиентские компоненты — всегда с 'use client'
'use client';

interface FilterPanelProps {
  categories: Category[];
  selectedIds: number[];
  onToggle: (id: number) => void;
}

export function FilterPanel({ categories, selectedIds, onToggle }: FilterPanelProps) {
  // ...
}
```

### Серверные компоненты (по умолчанию)
```typescript
// Без 'use client' — серверный компонент
// Можно использовать async/await напрямую
// Нельзя использовать хуки, onClick, useState

export default async function ContractorsPage() {
  const contractors = await fetchContractors();
  return <ContractorGrid items={contractors} />;
}
```

### Страницы
```typescript
// ✅ Каждая страница — в своей папке с page.tsx
// ✅ Использовать комбинацию серверных + клиентских компонентов
// Серверный: загрузка данных, SEO
// Клиентский: интерактивность (фильтры, кнопки, формы)
```

### Формы
- Все формы — React Hook Form + Zod
- Валидация на клиенте (Zod-схемы из shared)
- Сообщения об ошибках — русские
- Кнопка submit блокируется на время отправки (loading state)

---

## API Routes (Next.js)

### Обработчики
```typescript
// ✅ Всегда в папке app/api/v1/...
// ✅ Экспортировать HTTP-методы: GET, POST, PATCH, DELETE

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.parse(body);  // Zod-валидация
    // ... бизнес-логика
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { data: null, error: { code: 'VALIDATION_ERROR', message: error.message } },
        { status: 400 }
      );
    }
    // ...
  }
}
```

### Ответы
- Всегда использовать формат `{ data, error }`
- Коды: 200, 201, 400, 401, 403, 404, 409, 500
- Сообщения об ошибках — русские

---

## Prisma

### Запросы
```typescript
// ✅ Использовать select для точной выборки полей
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, role: true, first_name: true }
});

// ✅ Include только когда нужно всё
// ✅ Пагинация: skip + take
const items = await prisma.contractor.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// ✅ Транзакции для связанных операций
await prisma.$transaction([...]);
```

### Миграции
- Изменения схемы — через Prisma Migrate
- `npx prisma migrate dev --name description`
- Сидеры в `prisma/seed.ts`

---

## Стилизация (Tailwind CSS)

### Классы
- Порядок: layout → spacing → typography → colors → borders → effects
- Не писать кастомные CSS если можно через Tailwind
- Цвета — только из темы Tailwind (встроенные)
- Адаптивность: mobile-first (`md:`, `lg:`)

### Компоненты
- Базовые UI-компоненты — shadcn/ui (`npx shadcn-ui add button`)
- Кастомные компоненты — в `@/components/ui/`
- Не дублировать готовые компоненты shadcn

---

## Файлы и папки

### Структура страницы
```
app/
  (public)/
    contractors/
      page.tsx        ← серверный компонент (загрузка данных)
      loading.tsx     ← скелетон
      [id]/
        page.tsx      ← серверный
  components/
    contractors/
      ContractorCard.tsx      ← клиентский
      ContractorGrid.tsx      ← клиентский
      FilterPanel.tsx         ← клиентский
      ContractorCardSkeleton.tsx
  hooks/
    use-contractors.ts        ← хук для данных
  lib/
    api.ts                    ← fetch-обёртка
```

### Именование файлов
- Компоненты: `PascalCase.tsx`
- Хуки: `kebab-case.ts` (начинаются с `use-`)
- Утилиты: `kebab-case.ts`
- API-роуты: `route.ts` (стандарт Next.js)
- Страницы: `page.tsx` (стандарт Next.js)

---

## Git

### Коммиты
```
feat: Добавлен компонент FilterPanel
fix: Исправлена валидация email в регистрации
refactor: Вынесена логика авторизации в useAuth
docs: Обновлён KANBAN.md (задача 3.4 выполнена)
chore: Обновлены зависимости
```

### Ветки
- `main` — стабильная
- `dev` — разработка
- `feat/*` — новые фичи
- `fix/*` — исправления

### После каждой задачи
- Код компилируется
- Линтер не ругается
- Если есть тесты — проходят

---

## Обработка ошибок

### Frontend
```typescript
// ✅ Всегда try/catch для асинхронных операций
// ✅ Показывать пользователю понятные сообщения
// ✅ Предусматривать loading и error состояния

if (loading) return <Skeleton />;
if (error) return <Error message="Не удалось загрузить исполнителей" />;
```

### Backend
```typescript
// ✅ Всегда try/catch в API-роутах
// ✅ Возвращать структурированные ошибки
// ✅ Логировать ошибки (console.error)
```

---

## Тесты (по готовности)

### Unit-тесты
- Vitest для функций и хуков
- Файл: `*.test.ts` рядом с исходным кодом
- Проверять: успешный путь + крайние случаи + ошибки

### E2E-тесты
- Playwright
- Критические пути: регистрация → поиск → создание заказа → отклик

---

## Чек-лист для каждой задачи

- [ ] Код компилируется (`pnpm typecheck`)
- [ ] Линтер проходит (`pnpm lint`)
- [ ] Все импорты корректны
- [ ] Нет `console.log` в production-коде (только для отладки)
- [ ] Интерфейсы и типы объявлены
- [ ] Нет `any`
- [ ] Формы валидируются
- [ ] Состояния loading/error обработаны
- [ ] API-ответы в формате `{ data, error }`
- [ ] Задача отмечена `[x]` в KANBAN.md