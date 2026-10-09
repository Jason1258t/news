# 📰 Breaking NEWS - ПГТУ News Platform

Современный веб-сайт новостного паблика ПГТУ, разработанный с использованием React и современных подходов к архитектуре фронтенд-приложений.

**[Посетить сайт](https://vtech-news.ru)**

## 🎯 О проекте

Breaking NEWS — это полнофункциональная платформа для публикации и управления новостями ПГТУ. Сайт предоставляет удобное чтение новостей для пользователей и мощный административный интерфейс для редакторов и администраторов.

### ✨ Основные возможности

**Для читателей:**

- 📄 Просмотр статей с поддержкой различных форматов контента (код, формулы, таблицы, изображения)
- 🔍 Поиск по статьям
- 📌 Редакторский выбор (Editor's Pick) — подборка лучших материалов
- 📱 Адаптивный дизайн для всех устройств
- 🎨 Оптимизированная система рендеринга контента

**Для администраторов:**

- ✏️ Создание и редактирование статей
- 🏷️ Управление тегами
- 🗑️ Удаление контента
- 👑 Управление редакторским выбором
- 📊 Админ-панель для полного контроля
- 🔐 Аутентификация и ролевой доступ

## 🏗️ Архитектура

Проект построен по **Feature Sliced Design (FSD)**. Слой может импортировать только нижележащие слои, слайсы одного слоя друг друга не импортируют, а снаружи слайс доступен только через свой `index.ts`. Эти правила проверяет ESLint.

```
src/
├── app/        # провайдеры, роутинг, глобальные стили
├── pages/      # страницы: home, article, about, login, admin-*
├── widgets/    # крупные блоки: header, footer, лента, просмотр статьи, админ-лейаут, редактор подборки
├── features/   # действия пользователя: вход, создание статьи, фильтр по тегам, промпты для LLM, todo
├── entities/   # сущности: article, editors-pick, todo, session — API, модель, UI
└── shared/     # UI-kit, firebase, конфиг, утилиты
```

Конвенции и план дальнейших работ — в [docs/refactoring-plan.md](docs/refactoring-plan.md).

## 🛠️ Технологический стек

- **React 18** + **TypeScript** (миграция постепенная: `allowJs`, новые файлы — `.ts/.tsx`)
- **Vite** — сборка и dev-сервер
- **TanStack React Query** — серверное состояние и кэширование
- **Zustand** — локальное состояние форм
- **Firebase** — Firestore и аутентификация
- **React Router DOM** — навигация (`HashRouter` для GitHub Pages)
- **Prism.js**, **KaTeX** — подсветка кода и формулы
- **Vitest** + **Testing Library** — тесты
- **ESLint** (с `eslint-plugin-boundaries` для слоёв FSD) + **Prettier**

## 📦 Установка и запуск

Требуется Node.js 22+.

```bash
npm install
cp .env.example .env   # заполнить конфигом Firebase
npm run dev            # http://localhost:5173
```

### Скрипты

| Команда                 | Что делает                                                                     |
| ----------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`           | dev-сервер на боевом Firebase из `.env`                                        |
| `npm run dev:emulator`  | dev-сервер на локальных эмуляторах с тестовыми данными (нужна Java 21+)        |
| `npm run build`         | проверка типов + сборка в `dist/`                                              |
| `npm run preview`       | локальный просмотр сборки                                                      |
| `npm test`              | Vitest в режиме наблюдения                                                     |
| `npm run test:run`      | однократный прогон юнит- и компонентных тестов                                 |
| `npm run coverage`      | то же с отчётом покрытия (порог в `vite.config.ts`)                            |
| `npm run test:emulator` | правила Firestore и API на эмуляторе (нужна Java 21+)                          |
| `npm run test:e2e`      | e2e на Playwright поверх эмуляторов (`npx playwright install chromium` разово) |
| `npm run check`         | формат, lint, типы и юнит-тесты — перед коммитом                               |
| `npm run typecheck`     | `tsc` без сборки                                                               |
| `npm run lint`          | ESLint + stylelint                                                             |
| `npm run format`        | Prettier                                                                       |

### Тесты

Три уровня:

- **Юнит и компонентные** (`src/**/*.test.ts(x)`, jsdom). Firebase замокан глобально в `src/test/setup.ts`, API-модули мокаются в самих тестах. Хелперы импортируются как `test/...`: `renderWithProviders` / `createWrapper` (react-query без ретраев, `MemoryRouter`, Helmet), `makeArticle`, `fakeDocSnapshot`. Из кода приложения импортировать `test/` запрещает ESLint.
- **На эмуляторе** (`rules-tests/`, `src/**/*.emu.test.ts`): правила Firestore и настоящие запросы API против Firestore/Auth Emulator.
- **E2E** (`e2e/`, Playwright): приложение в режиме `--mode emulator`, каждый тест начинается с заново засеянной базы.

**Эмуляторы.** `.env.emulator` переключает клиент на локальные Firestore (8085) и Auth (9099) с проектом `demo-news`: такой проект не может обратиться к настоящему Firebase. Тестовые данные — `emulator/seed-data.ts`: 12 статей (одна со всеми типами блоков), выбор редакции, задачи и админ-аккаунт с claim `admin`. Тесты на эмуляторе отказываются запускаться, если клиент смотрит не на эмулятор.

CI (`.github/workflows/ci.yml`) на каждый PR запускает формат, lint, типы, юнит-тесты и сборку, а отдельной задачей — тесты на эмуляторе и e2e (отчёт Playwright сохраняется при падении).

## 📂 Где что лежит

- **Схема статьи** — `src/entities/article/model/schema.ts` (zod). Из неё выводятся TS-типы блоков и генерируется секция типов в промпте для LLM.
- **Промпты для LLM** — `src/features/copy-article-prompt/prompts/*.md`, плейсхолдеры `{{name}}` подставляются при копировании. Пример статьи — `example-article.json`, тест проверяет, что он соответствует схеме.
- **Константы проекта** (название, URL сайта и Telegram, категории) — `src/shared/config`.
- **Firebase** — `src/shared/api/firebase.ts`, конфиг берётся из `.env` (или `.env.emulator`). Таблицы в статьях хранятся строками-объектами `{ cells }`: Firestore не умеет вложенные массивы (`model/firestore-content.ts`).
- **Тема** — токены в `src/app/styles/tokens.css`; в компонентах только `var(--…)`, сырые цвета запрещены stylelint. Общая кнопка — `shared/ui/button` (`primary` / `secondary` / `danger`).

## 🚀 Развертывание

Каждый пуш в `main` собирает сайт и публикует его на GitHub Pages (`.github/workflows/deploy.yml`, можно запустить и вручную из вкладки Actions).

Один раз в настройках репозитория:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** Домен `vtech-news.ru` остаётся в настройках Pages.
2. **Settings → Secrets and variables → Actions → Variables:** конфиг Firebase из `.env` — `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`. Это публичный веб-конфиг (он всё равно попадает в бандл), поэтому переменные, а не секреты; доступ к данным защищают правила Firestore.

Без обязательных переменных деплой останавливается до сборки.

## 📝 Лицензия

Этот проект является собственностью ПГТУ Breaking NEWS.

## 👥 Контакты

Для вопросов и предложений свяжитесь с командой разработки.
