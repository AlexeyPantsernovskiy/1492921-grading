# Руководство по работе с проектом

## Подготовка бэкенда

### Перейти в папку с backend
```bash
cd ~/1492921-grading/backend
```

### Создать переменных окружения
```bash
cp ./apps/auth/.env.example backend/apps/auth/.env
cp ./apps/api/.env.example backend/apps/api/.env
cp ./apps/notify/.env.example backend/apps/notify/.env
cp ./apps/file-vault/.env.example backend/apps/file-vault/.env
cp ./apps/shop/.env.example backend/apps/shop/.env
cp ./libs/shop/models/prisma/.env.example backend/libs/shop/models/prisma/.env
```

### Создать docker containers для сервисов
```bash
docker compose --file ./apps/auth/docker-compose.yml --project-name "shop-user" --env-file ./apps/auth/.env up -d
docker compose --file ./apps/file-vault/docker-compose.yml --project-name "shop-file-vault" --env-file ./apps/file-vault/.env up -d
docker compose --file ./apps/notify/docker-compose.yml --project-name "shop-notify" --env-file ./apps/notify/.env up -d
docker compose --file ./apps/shop/docker-compose.yml --project-name "shop-product" --env-file ./apps/shop/.env up -d
```

### Установить зависимости
```bash
npm install
```

### Сгенерировать клиент Prisma
```bash
npx nx run blog:db:generate
```

### Сгенерировать и выполнить скрипт создания объектов в БД Postgres
```bash
npx nx run blog:db:migrate
```

### Загрузить моковые данные в базы данных
```bash
npm run cli:generate
```

### Запустить сервисы
```bash
npx nx run file-vault:serve
npx nx run notify:serve
npx nx run auth:serve
npx nx run shop:serve
npx nx run api:serve
```

## Подготовка фронтенда

### Перейти в папку с frontend
```bash
cd ~/1492921-grading/frontend
```

### Установить зависимости
```bash
npm install
```

### Запустить сервисы
```bash
npm run start
```

## Специификация

Swagger [app API](http://localhost:3000/spec#/)

Guitar Shop [React App](http://localhost:5000)

## Описание переменных окружения

### frontend
```
PORT=5000 - порт сервиса
```

### api
```
PORT=3000 - порт сервиса
```

### auth
```
PORT=3340 - порт сервиса

MONGO_DB=users - имя БД
MONGO_HOST=localhost - хост БД
MONGO_PORT=27025 - порт БД
MONGO_USER=admin - имя пользователя БД
MONGO_PASSWORD=passW0rd - пароль пользователя БД
MONGO_AUTH_BASE=admin - имя пользователя интерфейса БД
MONGO_EXPRESS_PORT=8085 - порт для mongo-express

JWT_ACCESS_TOKEN_SECRET=jH3fdwefjoI24 - секретный ключ access_token
JWT_ACCESS_TOKEN_EXPIRES_IN=5m - время жизни access_token
```

### file-vault
```
PORT=3342 - порт сервиса

UPLOAD_DIRECTORY_PATH=./uploads - папка хранения загруженных файлов

MONGO_HOST=localhost - хост БД
MONGO_PORT=27026 - порт БД
MONGO_DB=file-vault - имя БД
MONGO_USER=admin - имя пользователя БД
MONGO_PASSWORD=test - пароль пользователя БД
MONGO_AUTH_BASE=admin - имя пользователя интерфейса БД
SERVE_ROOT=static - путь доступа к файлам
```

### notify
```
MAIL_SMTP_HOST=localhost - хост smtp-сервера
MAIL_SMTP_PORT=2525 - порт smtp-сервера
MAIL_USER_NAME=admin - имя пользователя smtp-сервера
MAIL_USER_PASSWORD=pass - пароль пользователя smtp-сервера
MAIL_FROM=admin@test.ru - адрес отправителя почтовых уведомлений
MAIL_HTTP_PORT=2580 - порт для доступа к интерфейсу smtp-сервера
```

### shop
```
PORT=3341 - порт сервиса

POSTGRES_USER=user_shop - имя пользователя БД
POSTGRES_PASSWORD=12345678 - пароль пользователя БД
POSTGRES_DB=shop - имя БД
POSTGRES_PORT=5433 - порт БД

PGADMIN_DEFAULT_EMAIL=admin@test.ru - email пользователя pgadmin
PGADMIN_DEFAULT_PASSWORD=12345678 - пароль пользователя pgadmin
PGADMIN_PORT=8090 - порт для PgAmin

DATABASE_URL=postgres://user_shop:12345678@localhost:5433/shop - строка подключения к БД для генерации объектов призмы
```

## Сценарии backend package.json

### Проверка линтером
```bash
npm run lint
```

### Сборка м запуск CLI 
```bash
npm run cli
```

### Генерация моковых данных
```bash
npm run cli:generate
```

### Запуск микросервисов
```bash
npx nx run file-vault:serve
npx nx run auth:serve
npx nx run shop:serve
npx nx run api:serve
```

## Сценарии frontend package.json

### Запуск проекта
```bash
npm start
```

### Запуск тестов
```bash
npm test
```

### Проверка линтером
```bash
npm run lint
```

### Сборка проекта
```bash
npm run build
```

### Извлечение конфигурации проекта
```bash
npm run eject
```
