# FlaxVPN API - Vercel Backend

Backend API для Chrome Extension FlaxVPN, развернутый на Vercel.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local`:

```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```
JWT_SECRET=ваш-секретный-ключ-минимум-32-символа
```

### 3. Локальная разработка

```bash
npm run dev
```

API будет доступен на `http://localhost:3000`

### 4. Деплой на Vercel

#### Вариант A: Через Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

#### Вариант B: Через GitHub

1. Залейте код в GitHub
2. Импортируйте проект на vercel.com
3. Vercel автоматически деплоит

### 5. Настройка Vercel KV

1. В Vercel Dashboard: Storage → Create Database
2. Выберите "KV" (Redis)
3. Подключите к вашему проекту
4. Переменные окружения добавятся автоматически

## 📡 API Endpoints

### Авторизация

#### POST /api/auth/register
Регистрация нового пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "user:1234567890",
    "email": "user@example.com",
    "plan": "Free Plan",
    "createdAt": "2024-02-02T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login
Вход пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user:1234567890",
    "email": "user@example.com",
    "plan": "Free Plan"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/verify
Проверка токена

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "user:1234567890",
    "email": "user@example.com",
    "plan": "Free Plan"
  }
}
```

### Серверы

#### GET /api/servers
Получение списка VPN серверов

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "🇺🇸 USA - New York",
    "country": "US",
    "host": "us-ny.flaxvpn.com",
    "port": 8080,
    "protocol": "HTTP",
    "ping": 45,
    "ip": "45.76.123.45",
    "status": "online"
  }
]
```

## 🔒 Безопасность

### JWT токены
- Используется библиотека `jsonwebtoken`
- Токены действительны 30 дней
- Секретный ключ должен быть в переменных окружения

### Пароли
- Хешируются с помощью `bcryptjs`
- Salt rounds: 10
- Никогда не возвращаются в ответах API

### CORS
- Настроен в `vercel.json`
- Разрешены все origins (`*`)
- Для production рекомендуется ограничить

## 🗄️ База данных

### Vercel KV (Redis)

**Структура данных:**

```
user:<id>                    → JSON объект пользователя
email:<email@example.com>    → userId (индекс для быстрого поиска)
```

**Пример пользователя:**
```json
{
  "id": "user:1707567890123:abc123",
  "email": "user@example.com",
  "password": "$2a$10$...",
  "plan": "Free Plan",
  "createdAt": "2024-02-02T12:00:00.000Z",
  "updatedAt": "2024-02-02T12:00:00.000Z"
}
```

### Альтернативы

#### MongoDB
```bash
npm install mongodb
```

```javascript
// lib/db.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
// ...
```

#### Supabase
```bash
npm install @supabase/supabase-js
```

```javascript
// lib/db.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
```

## 🧪 Тестирование

### С помощью curl

**Регистрация:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Вход:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Проверка токена:**
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### С помощью Postman

Импортируйте коллекцию из `postman_collection.json` (если создана)

## 📂 Структура проекта

```
vercel-api/
├── api/
│   ├── auth/
│   │   ├── register.js      # POST - Регистрация
│   │   ├── login.js         # POST - Вход
│   │   ├── verify.js        # POST - Проверка токена
│   │   └── oauth/
│   │       └── [provider].js # OAuth провайдеры
│   └── servers.js           # GET - Список серверов
├── lib/
│   ├── auth.js              # JWT и bcrypt утилиты
│   └── db.js                # Database операции
├── package.json
├── vercel.json              # Vercel конфигурация
├── .env.example             # Пример переменных окружения
└── README.md                # Этот файл
```

## 🔧 Переменные окружения

Добавьте в Vercel Dashboard → Settings → Environment Variables:

| Переменная | Описание | Обязательна |
|-----------|----------|-------------|
| `JWT_SECRET` | Секретный ключ для JWT | ✅ Да |
| `KV_REST_API_URL` | Vercel KV URL | ✅ Да (авто) |
| `KV_REST_API_TOKEN` | Vercel KV Token | ✅ Да (авто) |
| `NODE_ENV` | production/development | ⚪ Нет |

## ⚡ Производительность

- **Cold start**: ~200-500ms
- **Warm request**: ~50-100ms
- **Memory**: 1024MB (настраивается)
- **Max duration**: 10s (настраивается)

## 📝 Логи

Просмотр логов:
```bash
vercel logs
```

Или в Vercel Dashboard → Deployments → [выбрать деплой] → Logs

## 🐛 Отладка

### Проблема: 405 Method Not Allowed
- ✅ Проверьте, что используете правильный HTTP метод
- ✅ Убедитесь, что endpoint существует

### Проблема: 401 Unauthorized
- ✅ Проверьте формат токена: `Bearer <token>`
- ✅ Убедитесь, что токен не истек (30 дней)
- ✅ Проверьте JWT_SECRET в переменных окружения

### Проблема: CORS errors
- ✅ Проверьте `vercel.json` конфигурацию
- ✅ Убедитесь, что headers правильно установлены

## 🚢 Production Checklist

- [ ] JWT_SECRET установлен (минимум 32 символа)
- [ ] Vercel KV настроен и подключен
- [ ] CORS ограничен для конкретных доменов
- [ ] Rate limiting добавлен
- [ ] Логирование настроено
- [ ] Мониторинг настроен (Sentry/LogRocket)
- [ ] Backup стратегия продумана

## 📚 Дополнительная документация

- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [JWT.io](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи: `vercel logs`
2. Проверьте переменные окружения
3. Убедитесь, что KV база настроена
4. Проверьте Network tab в DevTools

## 📄 Лицензия

MIT
