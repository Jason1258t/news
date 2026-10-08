# План рефакторинга и тестирования

Черновик по итогам ревью репозитория. Исходный размер: ~180 файлов, ~8.7k строк (JS/JSX + CSS), 0 тестов.

**Принятые решения (2026-10-08):** TypeScript вводим сразу (постепенно, через `allowJs`); гороскопы удалены целиком; «Студия» остаётся; `HashRouter` остаётся (нужен для GitHub Pages), вопрос отложен; мёртвый код удалён.

## 1. Что сейчас есть

**Стек:** CRA (`react-scripts` 5), React 18, React Router 7 (HashRouter), TanStack Query 5, Zustand 5, Firebase (Auth + Firestore + `firebase/ai`), Helmet, Prism, KaTeX, lucide, react-hot-toast. Деплой — `gh-pages`, домен `vtech-news.ru`.

**Функциональность:**

| Зона            | Что делает                                                                                               | Где живёт                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Лента           | Бесконечная лента статей, фильтр по `?category=` и `?tags=`                                              | `features/home-feed`, `features/articles`, `features/tags`                                            |
| Статья          | Рендер блочного контента (heading/paragraph/list/image/quote/highlight/formula/code/table)               | `features/articles/ArticleRenderer`, `entities/article/ui`                                            |
| Сайдбар главной | Выбор редакции, CTA                                                                                      | `features/editors-pick`, `features/CTA`                                                               |
| Админка         | Создание статьи из JSON, список + удаление, редактор «выбора редакции», «студия» (todo-лист в Firestore) | `pages/admin`, `pages/CreateArticle`, `pages/ArticlesPanel`, `pages/EditorsPickPanel`, `pages/studio` |
| Промпты         | Шаблоны для LLM (формат статьи, пост в TG), копирование в буфер                                          | `features/*/model/*prompt*.js`                                                                        |

**Мёртвый / тестовый код (удалён вместе с гороскопами):** `features/ai/*` (тестовый Gemini-виджет), `features/YandexAd`, `features/editors-pick/ui/picks.js`, `features/articles/hooks/useDeleteArticle.js`, `useAllHoroscopes`, `fetchEditorsPickById`, `updateEditorsPick`, `validatePredictions` / `validateJsonValue`, `resetForm` в сторе статьи, `propmt.txt` в корне, `initArticles` в `jsconfig.json`.

## 2. Найденные проблемы

### 2.1 Баги (чинить первыми, каждый — с регрессионным тестом)

Баги гороскопов (бывшие B1–B3, B12, B13) ушли вместе с фичей.

| #       | Где                                                                                              | Что не так                                                                                                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B4      | [query-client.js:7](../src/app/query/query-client.js#L7)                                         | `cacheTime` в v5 переименован в `gcTime` — опция молча игнорируется                                                                                                                                                                      |
| B5      | [articles-api.js:99](../src/features/articles/api/articles-api.js#L99)                           | «Не найдено» превращается в `throw` → страница показывает ошибку вместо `NotFoundWidget`, плюс react-query делает 3 ретрая                                                                                                               |
| B6      | [useArticle.js:17](../src/features/articles/hooks/useArticle.js#L17)                             | `initialData` читает ключ `['articles']`, которого не существует (лента лежит под `['articles', category, tags]` в infinite-формате) — мёртвая логика; ключи статьи и ленты делят одно пространство                                      |
| B7      | [useEditorsPicksStore.js:91](../src/features/editors-pick/data/useEditorsPicksStore.js#L91)      | Сохранение = «удалить всё, потом создать заново» без транзакции: если создание упадёт, подборка потеряна. Нужен `writeBatch`                                                                                                             |
| B8      | `ErrorWidget message={error?.message}` в CurrentPicks, ArticlesPanel и др.                       | В zustand-сторе `error` — строка, `.message` → `undefined`, показывается дефолтный текст                                                                                                                                                 |
| B9      | [ArticlesList/index.jsx:16](../src/pages/EditorsPickPanel/components/ArticlesList/index.jsx#L16) | `allArticles ? …` всегда truthy → лоадер и ошибка никогда не показываются; `key` висит не на том элементе                                                                                                                                |
| B10     | [Article/index.jsx:22](../src/pages/Article/index.jsx#L22)                                       | `onRetry={() => {}}` — кнопка «Попробовать снова» ничего не делает                                                                                                                                                                       |
| B11     | `ArticlesPanel`                                                                                  | Копирует данные query в локальный state, удаляет через API напрямую без инвалидации кэша → лента на главной показывает удалённую статью до перезагрузки. `limit: 50` без пагинации — старые статьи недоступны (то же в EditorsPickPanel) |
| ~~B14~~ | `package.json`                                                                                   | ~~`linkify-react`/`linkifyjs` не установлены~~ — исправлено переустановкой зависимостей на этапе 0                                                                                                                                       |

### 2.2 Безопасность

- **XSS:** `RenderHTML` (`dangerouslySetInnerHTML`) рендерит HTML из Firestore без санитизации. Достаточно одного скомпрометированного аккаунта или кривого JSON от LLM. → DOMPurify в `shared/lib/html`.
- **Авторизация:** `ProtectedRoute` проверяет только «залогинен». Реальная защита — Firestore Security Rules, но их **нет в репозитории**. → завести `firestore.rules` + тесты правил на эмуляторе.
- ~~`features/ai` дёргает Gemini из клиента~~ — удалён.

### 2.3 Архитектура (FSD-нарушения)

1. **`widgets/` фактически UI-kit.** Кнопки, инпуты, модалки, Overlay, HomeWidget лежат в `widgets`, и их импортируют `features` и даже `shared` (`shared/ui/status/*` → `widgets/buttons`). Это импорт «вверх» по слоям. → перенести в `shared/ui`.
2. **Бизнес-UI не в entities.** `ArticleCard`, `ArticleCardSmall`, `MediaBloc` — это отображение сущностей; `ArticleRenderer` лежит в `features`, хотя ничего «не делает».
3. **`pages` импортируют `pages`.** `pages/admin` собирает роуты из `pages/CreateArticle`, `pages/ArticlesPanel`… → админские страницы как обычные страницы, а `AdminLayout` — виджет/лейаут, роуты — в `app/router`.
4. **Firebase в `app/`.** Все API импортируют `app/firebase` → `shared/api/firebase`. `app/project.js` → `shared/config`.
5. **Два способа работы с данными:** react-query (статьи), ручной `useState+useEffect` (`useEditorsPicks`), zustand с API-вызовами внутри (`useEditorsPickStore`), `onSnapshot` (todo). → серверное состояние только через react-query; zustand — только для локального состояния форм (если вообще нужен).
6. **Разные контракты ошибок в API:** часть функций кидает исключения, часть возвращает `{success, error}`. → везде throw, обработка в `useMutation`/`useQuery`.
7. **Дубли:** typedef `EditorsPick` в двух местах; список категорий в Header и Footer; `<Toaster />` смонтирован в двух страницах.
8. **Нет публичного API слайсов** — импорты лезут вглубь (`features/articles/hooks/useArticles`, `widgets/modals/delete/useDeleteModal`).

### 2.4 Именование и стиль

- Папки: `PascalCase` (`Home`, `ArticleCard`), `kebab-case` (`editors-pick`, `scroll-to-top`), `lowercase` (`admin`, `studio`), `UPPER` (`CTA`).
- Файлы компонентов: то `index.jsx`, то `Name.jsx`; хуки то в `hooks/index.js`, то `hooks/useX.js`; стор в папке `data/`.
- Опечатки в именах: `ContentBloc`, `MediaBloc`, `FeedHeder.module.css`, `TagsDIsplay`, `TagsPannel`, `quries.js`, `BagesOverlay`, `CTASetcion`, `propmt.txt`; в UI — «форматирония», «гроскоп», «undefinded», «описани».
- snake_case-файлы (`article_format_prompt.js`) среди kebab-case.
- Смесь default/named-экспортов, 2 и 4 пробела, одинарные и двойные кавычки, нет Prettier.
- 3 забытых `console.log`.

### 2.5 Тема и стили

- `theme.css`: ~30 переменных, но в CSS **128 захардкоженных hex-цветов** против 153 использований `var(--…)`. Дубли (`--text-light` и `--text-secondary` — оба `#666`), «dark theme colors», которые на деле цвета футера, `body { color: #333 }` мимо токенов.
- Нет токенов для отступов, радиусов (кроме одного), размеров шрифта, z-index, брейкпоинтов. Брейкпоинты: 768 / 480 / 640 / 1024 / 1200 вразнобой.
- Смесь глобального CSS (Header, Footer, About, CreateArticle, блоки статьи с классами `.tag`, `.quote`, `.nav`, `.btn` — риск коллизий) и CSS Modules.
- Инлайн-стили в ~20 компонентах; `FilledButton` принимает «цвет» как style-объект.
- Google Fonts через `@import` в CSS — блокирует рендер.

### 2.6 Инфраструктура

- CRA официально deprecated; Jest в CRA плохо дружит с ESM-пакетами (firebase, lucide) — тестировать станет больно.
- Testing Library в `dependencies`, `user-event` v13 (актуальна 14), тестов и `setupTests` нет.
- Нет CI, нет `.env.example`, мета-теги указывают на старый `jason1258t.github.io`.

## 3. Целевая структура

Конвенции: папки — `kebab-case`; компоненты — `PascalCase.jsx` + `PascalCase.module.css`; хуки — `useX.js`; только named-экспорты; у каждого слайса `index.js` — публичный API, импорт вглубь чужого слайса запрещён линтером.

```
src/
├── app/
│   ├── providers/          # QueryProvider, AuthProvider, Helmet, Toaster — в одном месте
│   ├── router/             # все роуты, включая admin; lazy-загрузка админки
│   └── styles/             # reset.css, tokens.css (тема), global.css
├── pages/
│   ├── home/  article/  about/  login/
│   └── admin-articles/  admin-create-article/  admin-editors-pick/  admin-studio/
├── widgets/
│   ├── header/  footer/  admin-layout/ (sidebar + outlet)
│   ├── article-feed/       # лента + бесконечная прокрутка
│   ├── article-view/       # бывший ArticleRenderer
│   ├── home-sidebar/       # выбор редакции
│   └── editors-pick-editor/
├── features/
│   ├── auth-login/  auth-logout/
│   ├── article-create/  article-delete/
│   ├── filter-by-tags/
│   ├── editors-pick-edit/
│   ├── copy-llm-prompt/
│   └── todo-manage/
├── entities/
│   ├── article/       { api/, model/ (types, mapper, queryKeys, validators), ui/ (ArticleCard, ArticleCardCompact, blocks/*) }
│   ├── editors-pick/  { api/, model/, ui/ }
│   ├── todo/          { api/, model/, ui/ }
│   └── session/       # текущий пользователь, useSession
└── shared/
    ├── api/firebase.js
    ├── config/        # project, routes, categories, env
    ├── lib/           # date, sanitizeHtml, clipboard, cn()
    └── ui/            # Button, Input, TextArea, DateTimeInput, Modal, ConfirmDialog,
                       # Spinner, Card, Tag, ImagePreview, status/*, layout/*
```

## 4. Стратегия тестирования

**Стек:** Vitest + React Testing Library + `@testing-library/user-event` 14 + jsdom; Firebase Emulator Suite + `@firebase/rules-unit-testing` для интеграции; Playwright для пары e2e-сценариев.

**Пирамида:**

1. **Unit (быстрые, основная масса).** Чистые функции — их уже много и они почти не покрыты логикой UI:
    - `formatDate` / относительное время / склонения (`shared/lib/date`) — граничные случаи, `vi.useFakeTimers`.
    - мапперы Firestore ↔ модель (article, editors-pick, todo) — на фейковых `doc`-объектах.
    - `validateArticleData`.
    - построение запросов (`getArticlesQuery`) — через `vi.mock('firebase/firestore')`, проверка набора constraints.
    - `useQueryTags` — через `renderHook` с `MemoryRouter`.
    - `sanitizeHtml` — набор XSS-векторов.
2. **Компонентные.** Рендер каждого типа блока статьи и `ContentBlock` (включая неизвестный тип и вложенный highlight); `ProtectedRoute` (loading / guest / user); `ConfirmDialog`; JSON-форма импорта; `Header` (Войти/Админка). API-слой мокается на границе модуля (`vi.mock('entities/article/api')`), поэтому выделение API в отдельные модули — предусловие.
3. **Интеграционные на эмуляторе.** `entities/*/api` против Firestore Emulator: пагинация ленты, фильтр по тегам/категории, создание статьи с занятым slug, атомарное сохранение выбора редакции. Отдельно — тесты `firestore.rules`: аноним читает статьи, но не пишет; не-админ не пишет.
4. **E2E (Playwright, 3–5 сценариев).** Главная → статья; фильтр по тегу; логин → создание статьи → она в ленте → удаление. Запуск против `vite preview` + эмулятор.

**Утилиты:** `test/render.tsx` (обёртка с `QueryClient` без ретраев, `MemoryRouter`, `HelmetProvider`), фабрики фикстур `makeArticle()`.

**Порог покрытия** не ставить сразу; включить отчёт и поднимать постепенно, требуя 80%+ для `shared/lib` и `entities/*/model`.

## 5. Порядок работ

Принцип: сначала страховочная сетка, потом перестановки, каждый шаг — отдельный PR, который собирается и проходит тесты.

**Этап 0 — Инфраструктура**

- [x] Миграция CRA → Vite 8 (alias'ы слоёв, `REACT_APP_*` → `VITE_*`, корневой `index.html`, сборка в `dist/`).
- [x] TypeScript 6.0 (`allowJs`, `strict`, `noUncheckedIndexedAccess`). TS 7 пока не поддерживается typescript-eslint. На TS переведены: `main`, `App`, `app/firebase`, `shared/lib/date-utils`, типы/маппер статьи, валидатор, `auth-provider`.
- [x] Vitest 5 + RTL + jsdom, `src/test/render.tsx`, `src/test/firestore.ts`, скрипты `test`, `test:run`, `coverage`. TZ зафиксирован в UTC.
- [x] ESLint 10 (flat config) + typescript-eslint + react-hooks 7 + `eslint-plugin-boundaries` (warn: 23 нарушения слоёв — база для этапа 3). Отложенные `set-state-in-effect` помечены `TODO(stage N)`.
- [x] Prettier: конфиг, прогон форматирования отдельным коммитом, `format:check` в CI.
- [x] `.env.example`.
- [ ] `firestore.rules` + `firebase.json` — нужны текущие правила из Firebase Console (в репозитории их нет, писать с нуля нельзя: деплой перезапишет прод).
- [x] GitHub Actions: lint → typecheck → test → build.
- [x] Характеризационные тесты: даты/склонения, маппер статьи, валидатор, построитель запроса ленты, `useQueryTags`, все типы блоков статьи, `ProtectedRoute`, `Header` — 83 теста, покрытие 21.9%.
- [ ] Firebase 12 → 13 (`npm audit`: уязвимый `@grpc/grpc-js` внутри Firestore; в браузерный бандл не попадает).

**Этап 1 — Баги и чистка**

- [ ] Оставшиеся баги из таблицы, каждый с тестом.
- [ ] DOMPurify в `RenderHTML`.
- [x] Мёртвый код из раздела 1 и `propmt.txt` удалены.
- [ ] Убрать `console.log`.

**Этап 2 — Слой данных**

- [ ] Фабрики ключей запросов (`articleKeys`, `editorsPickKeys`, `todoKeys`).
- [ ] Единый контракт API: функции кидают исключения, без `{success, error}`.
- [ ] Выбор редакции: чтение через `useQuery`, сохранение через `useMutation` + `writeBatch`; локальный черновик в `useState`/маленьком сторе.
- [ ] Удаление/создание статьи → `useMutation` с инвалидацией `articleKeys.lists()`.
- [ ] Todo: подписка `onSnapshot` → `queryClient.setQueryData`.
- [ ] Админский список статей — бесконечная прокрутка вместо `limit: 50`.

**Этап 3 — Перестройка слоёв** (механические переносы, тесты должны остаться зелёными)

- [ ] `widgets/{buttons,input,modals,Overlay,HomeWidget,tags}` → `shared/ui`.
- [ ] `app/firebase`, `app/project` → `shared/api`, `shared/config`.
- [ ] Карточки и блоки статьи → `entities/article/ui`; `ArticleRenderer` → `widgets/article-view`.
- [ ] API → `entities/*/api`; действия → `features/*`.
- [ ] Админка: роуты в `app/router`, `widgets/admin-layout`, `lazy()` для админских страниц (Prism/KaTeX тоже грузить лениво).
- [ ] Переименования по конвенциям (раздел 3) + `index.js` у каждого слайса; правила boundaries → error.

**Этап 4 — Тема и UI-kit**

- [ ] `tokens.css`: палитра (primitive → semantic: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-danger`…), отступы, радиусы, тени, типографика, z-index; брейкпоинты зафиксировать (480 / 768 / 1024).
- [ ] Заменить 128 hex-цветов на токены (найти через stylelint `color-no-hex` в режиме отчёта).
- [ ] Все глобальные стили компонентов → CSS Modules; убрать инлайн-стили.
- [ ] `Button` с `variant` (`filled | outlined | danger`) и `size` вместо `FilledButton`/`OutlinedButton` и style-пропа.
- [ ] Шрифт через `<link rel="preconnect">` в `index.html` вместо `@import`.
- [ ] (опционально) тёмная тема — после токенов это почти бесплатно.

**Этап 5 — Тесты дальше и полировка**

- [ ] Компонентные тесты из п. 4.2, интеграция на эмуляторе, тесты правил, e2e.
- [ ] Мета-теги/canonical → `vtech-news.ru`, обновить README (архитектура, тесты, env).

## 6. Открытые вопросы

1. **HashRouter** — отложен. Нужен для GitHub Pages; переход на `BrowserRouter` сломает ссылки `/#/articles/...`, уже разошедшиеся в TG.
2. **Zustand** — после переноса серверного состояния в react-query останутся только формы; возможно, зависимость не нужна.
