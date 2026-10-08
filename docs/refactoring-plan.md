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

| #   | Где                                                                                              | Что не так                                                                                                                                                                                          | Статус                                                  |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| B4  | `app/providers/query-client.ts`                                                                  | `cacheTime` в react-query v5 молча игнорировался                                                                                                                                                    | ✅ исправлено (типы)                                    |
| B5  | [articles-api.ts:114](../src/entities/article/api/articles-api.ts#L114)                          | «Не найдено» превращается в `throw` → вместо `NotFoundWidget` показывается ошибка, плюс 3 ретрая                                                                                                    | ✅ этап 1                                               |
| B6  | [useArticle.ts:19](../src/entities/article/api/useArticle.ts#L19)                                | `initialData` читает несуществующий ключ `['articles']` — мёртвая логика; ключи статьи и ленты делят одно пространство                                                                              | ✅ этап 2: `articleKeys`, статья берётся из кеша ленты  |
| B7  | [useEditorsPickStore.ts:93](../src/widgets/editors-pick-editor/model/useEditorsPickStore.ts#L93) | Сохранение = «удалить всё, потом создать» без транзакции: при сбое подборка теряется. Нужен `writeBatch`                                                                                            | ✅ этап 2: `replaceEditorsPicks` одним `writeBatch`     |
| B8  | `CurrentPicks`, `StudioPage`                                                                     | `error.message` у строки → всегда `undefined`, реальная ошибка не показывалась                                                                                                                      | ✅ исправлено (типы)                                    |
| B9  | [ArticlesList.tsx:20](../src/widgets/editors-pick-editor/ui/ArticlesList.tsx#L20)                | `allArticles ? …` всегда truthy → лоадер и ошибка не показываются; `key` не на том элементе                                                                                                         | ✅ этап 1                                               |
| B10 | [ArticlePage.tsx:20](../src/pages/article/ArticlePage.tsx#L20)                                   | `onRetry={() => {}}` — «Попробовать снова» ничего не делает                                                                                                                                         | ✅ этап 1                                               |
| B11 | `ArticlesPanelPage`, `ArticlesList`                                                              | Копия query-данных в локальном state, удаление без инвалидации кэша → лента показывает удалённую статью. `limit: 50` без пагинации                                                                  | ✅ этап 2: список читает query напрямую, «Показать ещё» |
| B14 | `package.json`                                                                                   | `linkify-react`/`linkifyjs` не были установлены                                                                                                                                                     | ✅ исправлено на этапе 0                                |
| B15 | [articles-query.ts:28](../src/entities/article/api/articles-query.ts#L28)                        | Категория + теги одновременно → Firestore: «A maximum of 1 'ARRAY_CONTAINS' filter is allowed per disjunction». Лента падает с ошибкой. Нужно фильтровать одно из двух на клиенте или менять модель | ✅ этап 1: теги в запросе, категория на клиенте         |
| B16 | `ArticleMeta`                                                                                    | `article:section` брался из несуществующего поля и всегда был пустым                                                                                                                                | ✅ исправлено (типы)                                    |
| B17 | `articles-api.ts` (`createArticle`)                                                              | Статью с блоком `table` нельзя было загрузить: Firestore не хранит вложенные массивы (`Nested arrays are not supported`)                                                                            | ✅ этап 5: строки как `{ cells }`, тест на эмуляторе    |
| B18 | `ArticleFeed`                                                                                    | Категория + теги: если вся первая страница отфильтрована на клиенте (B15), лента показывала «Статьи не найдены» и не грузила дальше                                                                 | ✅ этап 5                                               |

### 2.2 Безопасность

- ✅ **XSS:** HTML статей проходит через DOMPurify (`shared/lib/sanitize-html`). Вырезаются скрипты, обработчики, `javascript:`-ссылки, iframe, SVG и формы. Проверено на всех 2363 фрагментах из базы: видимых изменений нет.
- **Авторизация.** Аккаунты есть только у админов, создаются через консоль. Клиент (`ProtectedRoute`) проверяет только факт входа, а запись защищают правила Firestore: [firestore.rules](../firestore.rules) — копия боевых правил, запись разрешена только с custom claim `admin: true`. Правила покрыты тестами на эмуляторе (`npm run test:emulator`, отдельная задача в CI).
    - Новому аккаунту нужно выставить claim `admin: true` через Admin SDK (в консоли его не задать). Иначе админка откроется, но любая запись упадёт с `permission-denied`.
    - В правилах остался блок `horoscopes`. Его можно удалить вместе с данными коллекции, когда будет решено, что они не нужны.
    - Деплой правил из репозитория: `firebase deploy --only firestore:rules --project <id>`.
- `npm audit`: уязвимый `@grpc/grpc-js` внутри Firebase 12 (только Node, в бандл не попадает) → Firebase 13.

### 2.3 Архитектура

Решено на этапе 3: UI-kit в `shared/ui`, Firebase и конфиг в `shared`, сущности в `entities`, админские роуты в `app/router` с lazy-загрузкой, публичный API у каждого слайса, только именованные экспорты. ESLint запрещает импорт вверх по слоям, импорт между слайсами одного слоя и глубокие импорты мимо `index.ts`.

Осталось (этап 2):

1. ✅ **Серверное состояние только через react-query** (этап 2): статьи, подборка и todo; ключи — `articleKeys`, `editorsPickKeys`, `todoKeys`. Подписка на todo пишет снапшоты в кеш.
2. ✅ **Единый контракт ошибок** (этап 2): API кидает исключения, записи — через `useMutation`, ошибки показываются пользователю (в том числе отказ правил при записи todo).
3. ✅ **Валидация по схеме:** создание статьи проверяет JSON по `articleInputSchema`, ошибки на русском с путём до поля, `null` считается отсутствием поля.

### 2.4 Тема и стили — ✅ этап 4

- Токены в `app/styles/tokens.css`: палитра (примитивы) и семантические роли (`--color-surface`, `--color-text-muted`, `--color-danger`…), тени (4 уровня), радиусы, отступы, типографика, z-index, переходы. 63 разных цвета сведены примерно к 35 ролям.
- Брейкпоинты: 480 / 768 / 1024 / 1200 (задокументированы в `tokens.css`).
- Глобальными остались только `tokens.css` и `global.css`, всё остальное — CSS Modules. Инлайн-стилей нет, кроме размеров из пропсов `ImagePreview`.
- Stylelint (`npm run lint`) запрещает hex и именованные цвета вне `tokens.css`.
- Визуальная регрессия проверялась скриншотами 22 состояний страниц (Playwright + pixelmatch) после каждого шага.

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
3. **Интеграционные на эмуляторе.** ✅ `npm run test:emulator`: правила `firestore.rules` (`rules-tests/`) и API против Firestore/Auth Emulator (`*.emu.test.ts`) — пагинация, фильтры (B15), все типы блоков туда-обратно (B17), занятый slug, удаление, порядок и атомарность подборки, задачи через подписку.
4. **E2E (Playwright).** ✅ `npm run test:e2e`, 14 сценариев на засеянном эмуляторе: чтение (главная → статья, бесконечная лента, теги и категории, 404, сайдбар, мобильное меню) и админка (логин с возвратом, создание и удаление статьи, невалидный JSON, выбор редакции, студия, выход).

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
- [x] Lazy-загрузка Prism/KaTeX (этап 4): основной чанк 646 → 349 КБ.

**Этап 1 — Баги и безопасность** ✅

- [x] B5, B9, B10, B15 — каждый с регрессионным тестом, проверенным на старом коде.
- [x] DOMPurify в `RenderHtml`.
- [x] Валидация статьи схемой `articleInputSchema` вместо `validateArticleData`.
- [x] Редактор подборки берёт заголовок и ссылку из `getArticlePreview` (у новых статей нет `og`).
- [x] Юнит-тесты не зависят от `.env`: Firebase замокан глобально в `src/test/setup.ts`.

**Этап 2 — Слой данных** ✅

- [x] Фабрики ключей запросов (`articleKeys`, `editorsPickKeys`, `todoKeys`) — закрывает B6.
- [x] API кидает исключения; мутации через `useMutation` с инвалидацией — закрывает B11 (новая фича `features/article-delete`).
- [x] Выбор редакции: `useQuery` + атомарный `writeBatch` — закрывает B7. Черновик — хук `useEditorsPickDraft` вместо zustand-стора; ID документов кодируют позицию, порядок в сайдбаре совпадает с редактором.
- [x] Todo: `onSnapshot` → `queryClient.setQueryData`, мутации с тостами об ошибках.
- [x] Админские списки статей — кнопка «Показать ещё» вместо `limit: 50`.
- [x] `set-state-in-effect` больше нигде не подавляется, кроме `DatePicker` (этап 4).

**Этап 4 — Тема и UI-kit** ✅

- [x] `tokens.css` (палитра → семантика, тени, радиусы, отступы, типографика, z-index, переходы) + миграция всех цветов.
- [x] Stylelint-гард `color-no-hex` / `color-named`.
- [x] Глобальные стили → CSS Modules (шапка, подвал, «О проекте», создание статьи, блоки статьи); инлайн-стили → модули.
- [x] `Button` с вариантами `primary`/`secondary`/`danger` вместо `FilledButton`/`OutlinedButton` и style-пропа; `type="button"` по умолчанию.
- [x] `DatePicker` полностью контролируемый.
- [x] Шрифт через `<link rel="preconnect">` вместо `@import`.
- [x] Исправлено попутно: горизонтальный скролл на десктопе (кнопка «Админка» вылезала на 200px за шапку), пустые плашки бейджей в редакторе подборки, у цитат `warning`/`critical` не было стилей; бургер-меню — `<button>` с `aria-expanded`, теги статьи и логотип — ссылки.
- [x] Lazy-загрузка KaTeX и Prism.
- [ ] (опционально) Тёмная тема — по токенам это один блок переопределений, но нужно отдельно проверить все страницы.
- [ ] (опционально) Запасной шрифт: сейчас `"Inter", sans-serif`; можно `system-ui`, если Inter не загрузился.

**Этап 5 — Тесты дальше и полировка** ✅

- [x] Эмуляторы Firebase для разработки и тестов: `.env.emulator`, сид-данные, защита от запуска тестов против настоящего проекта.
- [x] Интеграционные тесты API на эмуляторе, e2e на Playwright, оба в CI.
- [x] Компонентные тесты: лента, фильтры, создание статьи, управление статьями, редактор подборки, студия, логин, роутер. Покрытие юнит-тестами 52% → 90% строк, порог в `vite.config.ts`.
- [x] Найдено и исправлено: B17 (таблицы не сохранялись), B18 (пустая первая страница ленты), сброс состояния превью картинки, `window.open` без `noopener`.
- [x] Доступность: общий `Dialog` (role, фокус, Escape), карточки-кнопки с клавиатуры, подписи у полей, после логина возврат на запрошенную страницу, один `h1` на страницу.
- [ ] Мета-теги/canonical → `vtech-news.ru` — отложено вместе с HashRouter и превью ссылок (см. открытые вопросы).

## 6. Открытые вопросы

1. **HashRouter и превью ссылок** — отложены. Боты мессенджеров не выполняют JS, а часть после `#` не доходит до сервера, поэтому у всех статей превью главной. Решение: `BrowserRouter` + пререндер HTML каждой статьи при сборке (деплой через Actions по расписанию) либо хостинг с функциями (Cloudflare Pages). Старые ссылки `/#/articles/...` нужно будет переадресовывать на клиенте.
2. **Zustand** — остался только в сторе формы создания статьи (черновик JSON переживает уход со страницы). Можно оставить или заменить на `useState` + `sessionStorage`.
