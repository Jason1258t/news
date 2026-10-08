# План рефакторинга и тестирования

Исходное состояние (до рефакторинга): ~180 файлов, ~8.7k строк JS/JSX + CSS, 0 тестов, CRA.

**Принятые решения (2026-10-08):**

- TypeScript — сразу. Весь `src` переведён, `allowJs` выключен.
- Гороскопы удалены целиком; «Студия» остаётся.
- `HashRouter` остаётся (нужен для GitHub Pages), вопрос отложен.
- Этап 3 (перестройка слоёв) сделан раньше этапов 1 и 2.

## 1. Текущее состояние

**Стек:** Vite 8, React 18, TypeScript 6 (strict), React Router 7 (HashRouter), TanStack Query 5, Zustand 5, Firebase 12 (Auth + Firestore), zod 4, Helmet, Prism, KaTeX, lucide, react-hot-toast. Тесты — Vitest 5 + Testing Library. Деплой — `gh-pages`, домен `vtech-news.ru`.

**Сделано:** этап 0 (инфраструктура), этап 3 (слои FSD + TS), конструктор LLM-промптов. 12 тестовых файлов, 110 тестов, покрытие 31.8%.

**Функциональность:**

| Зона            | Что делает                                                              | Где живёт                                                                            |
| --------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Лента           | Бесконечная лента, фильтр по `?category=` и `?tags=`                    | `widgets/article-feed`, `features/filter-by-tags`, `entities/article`                |
| Статья          | Рендер блочного контента                                                | `pages/article`, `widgets/article-view`, `entities/article/ui`                       |
| Сайдбар главной | Выбор редакции, CTA                                                     | `widgets/editors-pick-sidebar`, `widgets/subscribe-cta`                              |
| Админка         | Создание статьи из JSON, список + удаление, редактор подборки, «Студия» | `pages/admin-*`, `widgets/admin-layout`, `widgets/editors-pick-editor`, `features/*` |
| Промпты для LLM | Формат статьи (типы генерируются из схемы), пост в TG — копирование     | `features/copy-article-prompt`, `entities/article/model/schema.ts`                   |

## 2. Найденные проблемы

### 2.1 Баги (чинить на этапе 1, каждый — с регрессионным тестом)

Баги гороскопов (B1–B3, B12, B13) ушли вместе с фичей. В коде открытые баги помечены `TODO(stage N)`.

| #   | Где                                                                                              | Что не так                                                                                                                                                                                          | Статус                                          |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| B4  | `app/providers/query-client.ts`                                                                  | `cacheTime` в react-query v5 молча игнорировался                                                                                                                                                    | ✅ исправлено (типы)                            |
| B5  | [articles-api.ts:114](../src/entities/article/api/articles-api.ts#L114)                          | «Не найдено» превращается в `throw` → вместо `NotFoundWidget` показывается ошибка, плюс 3 ретрая                                                                                                    | ✅ этап 1                                       |
| B6  | [useArticle.ts:19](../src/entities/article/api/useArticle.ts#L19)                                | `initialData` читает несуществующий ключ `['articles']` — мёртвая логика; ключи статьи и ленты делят одно пространство                                                                              | открыт (этап 2)                                 |
| B7  | [useEditorsPickStore.ts:93](../src/widgets/editors-pick-editor/model/useEditorsPickStore.ts#L93) | Сохранение = «удалить всё, потом создать» без транзакции: при сбое подборка теряется. Нужен `writeBatch`                                                                                            | открыт (этап 2)                                 |
| B8  | `CurrentPicks`, `StudioPage`                                                                     | `error.message` у строки → всегда `undefined`, реальная ошибка не показывалась                                                                                                                      | ✅ исправлено (типы)                            |
| B9  | [ArticlesList.tsx:20](../src/widgets/editors-pick-editor/ui/ArticlesList.tsx#L20)                | `allArticles ? …` всегда truthy → лоадер и ошибка не показываются; `key` не на том элементе                                                                                                         | ✅ этап 1                                       |
| B10 | [ArticlePage.tsx:20](../src/pages/article/ArticlePage.tsx#L20)                                   | `onRetry={() => {}}` — «Попробовать снова» ничего не делает                                                                                                                                         | ✅ этап 1                                       |
| B11 | `ArticlesPanelPage`, `ArticlesList`                                                              | Копия query-данных в локальном state, удаление без инвалидации кэша → лента показывает удалённую статью. `limit: 50` без пагинации                                                                  | открыт (этап 2)                                 |
| B14 | `package.json`                                                                                   | `linkify-react`/`linkifyjs` не были установлены                                                                                                                                                     | ✅ исправлено на этапе 0                        |
| B15 | [articles-query.ts:28](../src/entities/article/api/articles-query.ts#L28)                        | Категория + теги одновременно → Firestore: «A maximum of 1 'ARRAY_CONTAINS' filter is allowed per disjunction». Лента падает с ошибкой. Нужно фильтровать одно из двух на клиенте или менять модель | ✅ этап 1: теги в запросе, категория на клиенте |
| B16 | `ArticleMeta`                                                                                    | `article:section` брался из несуществующего поля и всегда был пустым                                                                                                                                | ✅ исправлено (типы)                            |

### 2.2 Безопасность

- ✅ **XSS:** HTML статей проходит через DOMPurify (`shared/lib/sanitize-html`). Вырезаются скрипты, обработчики, `javascript:`-ссылки, iframe, SVG и формы. Проверено на всех 2363 фрагментах из базы: видимых изменений нет.
- **Авторизация.** Аккаунты есть только у админов, создаются через консоль. Клиент (`ProtectedRoute`) проверяет только факт входа, а запись защищают правила Firestore: [firestore.rules](../firestore.rules) — копия боевых правил, запись разрешена только с custom claim `admin: true`. Правила покрыты тестами на эмуляторе (`npm run test:rules`, 22 теста, отдельная задача в CI).
    - Новому аккаунту нужно выставить claim `admin: true` через Admin SDK (в консоли его не задать). Иначе админка откроется, но любая запись упадёт с `permission-denied`.
    - В правилах остался блок `horoscopes`. Его можно удалить вместе с данными коллекции, когда будет решено, что они не нужны.
    - Деплой правил из репозитория: `firebase deploy --only firestore:rules --project <id>`.
- `npm audit`: уязвимый `@grpc/grpc-js` внутри Firebase 12 (только Node, в бандл не попадает) → Firebase 13.

### 2.3 Архитектура

Решено на этапе 3: UI-kit в `shared/ui`, Firebase и конфиг в `shared`, сущности в `entities`, админские роуты в `app/router` с lazy-загрузкой, публичный API у каждого слайса, только именованные экспорты. ESLint запрещает импорт вверх по слоям, импорт между слайсами одного слоя и глубокие импорты мимо `index.ts`.

Осталось (этап 2):

1. **Несколько способов работы с данными:** react-query (статьи), `useState + useEffect` (`useEditorsPicks`), zustand с API внутри (`useEditorsPickStore`), `onSnapshot` (todo). → серверное состояние только через react-query.
2. **Разные контракты ошибок в API:** часть функций кидает исключения, часть возвращает `MutationResult` `{success, error}`. → везде throw, обработка в `useMutation`.
3. ✅ **Валидация по схеме:** создание статьи проверяет JSON по `articleInputSchema`, ошибки на русском с путём до поля, `null` считается отсутствием поля.

### 2.4 Тема и стили (этап 4)

- `theme.css`: ~30 переменных, но в CSS **128 захардкоженных hex-цветов**. Дубли (`--text-light` и `--text-secondary`), «dark theme colors» на деле цвета футера.
- Нет токенов для отступов, радиусов, типографики, z-index, брейкпоинтов (768 / 480 / 640 / 1024 / 1200 вразнобой).
- Смесь глобального CSS (`Header.css`, `Footer.css`, `AboutPage.css`, `CreateArticlePage.css`, `blocks.css` с классами `.tag`, `.quote`, `.nav`, `.btn`) и CSS Modules.
- Инлайн-стили в ~15 компонентах; `FilledButton` принимает цвет как style-объект.
- Google Fonts через `@import` в CSS блокирует рендер.

## 3. Структура и конвенции

- Папки — `kebab-case`; компоненты — `PascalCase.tsx` + `PascalCase.module.css`; хуки — `useX.ts`; остальное — `kebab-case.ts`.
- Только именованные экспорты. Внутри слайса — относительные импорты, снаружи — только через `index.ts`.
- Тексты для LLM — файлы `*.md` в `prompts/` фичи, с плейсхолдерами `{{name}}` (исключены из Prettier).

```
src/
├── app/            providers/, router/ (AppRouter, ProtectedRoute, ScrollToTop), styles/
├── pages/          home, article, about, login, admin-create-article, admin-articles,
│                   admin-editors-pick, admin-studio
├── widgets/        header, footer, admin-layout, article-feed, article-view,
│                   editors-pick-sidebar, editors-pick-editor, subscribe-cta
├── features/       auth, article-create, copy-article-prompt, filter-by-tags, manage-todos
├── entities/       article { api, model (schema, types, mappers, validators), ui },
│                   editors-pick, todo, session
└── shared/         api (firebase), config (project, URLs, категории), lib (date, error,
                    schema-to-ts, template), ui (button, layout, status-виджеты, диалоги…)
```

## 4. Стратегия тестирования

**Стек:** Vitest + Testing Library + user-event 14 + jsdom; Firebase Emulator + `@firebase/rules-unit-testing` для интеграции; Playwright для e2e.

1. **Unit.** ✅ даты/склонения, маппер статьи, валидатор, запрос ленты, `useQueryTags`, `getErrorMessage`, `renderTemplate`, `printSchemaTypes`, сборка промптов (пример статьи валидируется схемой). Дальше: мапперы editors-pick и todo, сторы, `sanitizeHtml`.
2. **Компонентные.** ✅ все блоки статьи, `ProtectedRoute`, `Header`. Дальше: `ConfirmDialog`, форма создания статьи, `ArticleFeed` с замоканным API, редактор подборки.
3. **Интеграционные на эмуляторе.** API против Firestore Emulator: пагинация, фильтры (B15), создание с занятым slug, атомарное сохранение подборки. ✅ Тесты `firestore.rules` (`rules-tests/`, `npm run test:rules`).
4. **E2E (Playwright, 3–5 сценариев).** Главная → статья; фильтр по тегу; логин → создание статьи → удаление.

Утилиты: `src/test/render.tsx` (`renderWithProviders`, `createWrapper`), `src/test/firestore.ts` (`fakeDocSnapshot`). Порог покрытия — не ставить сразу; 80%+ для `shared/lib` и `entities/*/model`.

## 5. Порядок работ

**Этап 0 — Инфраструктура** ✅

- [x] CRA → Vite 8; TypeScript 6 (TS 7 пока не поддерживается typescript-eslint).
- [x] Vitest 5 + RTL, хелперы, TZ в UTC; ESLint 10 + typescript-eslint + react-hooks + boundaries; Prettier; CI.
- [x] `.env.example`.
- [x] `firestore.rules` (копия боевых) + `firebase.json` (эмулятор на порту 8085) + тесты правил в CI.
- [ ] Firebase 12 → 13.

**Этап 3 — Перестройка слоёв** ✅ (сделан раньше этапов 1–2)

- [x] Перенос по слоям, исправление имён, именованные экспорты, `index.ts` у слайсов.
- [x] Админские роуты в `app/router`, `AdminLayout` с `<Outlet />`, lazy-загрузка админки.
- [x] Правила FSD в ESLint как ошибки.
- [x] Весь `src` на TypeScript, `allowJs` выключен.
- [x] Категории, URL сайта и канала — в `shared/config`; `<Toaster />` один на приложение.
- [x] Промпты: схема статьи на zod → типы и секция промпта генерируются; тексты в `.md`-шаблонах.
- [ ] Lazy-загрузка Prism/KaTeX (основной чанк ~1.1 МБ).

**Этап 1 — Баги и безопасность** ✅

- [x] B5, B9, B10, B15 — каждый с регрессионным тестом, проверенным на старом коде.
- [x] DOMPurify в `RenderHtml`.
- [x] Валидация статьи схемой `articleInputSchema` вместо `validateArticleData`.
- [x] Редактор подборки берёт заголовок и ссылку из `getArticlePreview` (у новых статей нет `og`).
- [x] Юнит-тесты не зависят от `.env`: Firebase замокан глобально в `src/test/setup.ts`.

**Этап 2 — Слой данных**

- [ ] Фабрики ключей запросов (`articleKeys`, `editorsPickKeys`, `todoKeys`) — закрывает B6.
- [ ] API кидает исключения; мутации через `useMutation` с инвалидацией — закрывает B11.
- [ ] Выбор редакции: `useQuery` + `useMutation` с `writeBatch` — закрывает B7; убрать `set-state-in-effect`.
- [ ] Todo: `onSnapshot` → `queryClient.setQueryData`.
- [ ] Админский список статей — бесконечная прокрутка вместо `limit: 50`.

**Этап 4 — Тема и UI-kit**

- [ ] `tokens.css`: палитра (primitive → semantic), отступы, радиусы, тени, типографика, z-index; брейкпоинты 480 / 768 / 1024.
- [ ] Заменить hex-цвета на токены (stylelint `color-no-hex`).
- [ ] Глобальные стили компонентов → CSS Modules; убрать инлайн-стили.
- [ ] `Button` с `variant`/`size` вместо `FilledButton`/`OutlinedButton`; `DatePicker` полностью контролируемый.
- [ ] Шрифт через `<link rel="preconnect">`; (опционально) тёмная тема.

**Этап 5 — Тесты дальше и полировка**

- [ ] Компонентные и интеграционные тесты из раздела 4, тесты правил, e2e.
- [ ] Мета-теги/canonical → `vtech-news.ru` (сейчас `jason1258t.github.io`).

## 6. Открытые вопросы

1. **HashRouter** — отложен. Переход на `BrowserRouter` сломает ссылки `/#/articles/...`, уже разошедшиеся в TG.
2. **Zustand** — после переноса серверного состояния в react-query останутся только формы; возможно, зависимость не нужна.
