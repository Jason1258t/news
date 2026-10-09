/**
 * Data for the local Firebase emulators: e2e tests, emulator integration tests and
 * `npm run dev:emulator`. Articles follow the upload format (articleInputSchema);
 * an emulator test checks that they still pass it.
 */

/** Test-only account that exists in the Auth emulator; the "admin" claim matches firestore.rules. */
export const SEED_ADMIN = { email: "admin@news.test", password: "emulator-admin-pass" };

/** Placeholder hero image: no network in tests, a different color per article. */
const placeholder = (hue: number, label: string) =>
    "data:image/svg+xml," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
            `<rect width="100%" height="100%" fill="hsl(${hue} 60% 55%)"/>` +
            `<text x="50%" y="50%" font-size="64" text-anchor="middle" fill="white">${label}</text>` +
            `</svg>`,
    );

const day = (n: number) => new Date(Date.UTC(2026, 0, n, 9, 0)).toISOString();

const simpleArticle = (
    n: number,
    slug: string,
    title: string,
    category: string[],
    tags: string[],
) => ({
    slug,
    title,
    description: `Короткий лид статьи «${title}».`,
    category,
    datePublishedISO: day(n),
    author: "Редакция",
    tags,
    hero: { url: placeholder(n * 29, slug), alt: title },
    content: [
        { type: "paragraph", html: `Первый абзац статьи «${title}».` },
        { type: "paragraph", html: "Второй абзац с <strong>выделением</strong>." },
    ],
});

/** Article with every content block type: rendering checks and visual comparisons. */
export const allBlocksArticle = {
    slug: "all-blocks",
    title: "Статья со всеми блоками",
    description: "Заголовки, списки, цитаты, код, формулы и таблицы в одной статье.",
    category: ["Технологии", "Наука"],
    datePublishedISO: day(20),
    author: "Редакция",
    tags: ["код", "математика"],
    hero: { url: placeholder(220, "all-blocks"), alt: "Обложка", caption: "Подпись к обложке" },
    content: [
        { type: "paragraph", html: 'Вступление с <a href="https://example.com">ссылкой</a>.' },
        { type: "heading", level: 2, text: "Списки и цитаты" },
        { type: "list", items: ["Первый пункт", "Второй пункт с <em>курсивом</em>"] },
        { type: "blockquote", html: "Обычная цитата.", footer: "Автор цитаты" },
        { type: "blockquote", html: "Предупреждение.", variant: "warning" },
        { type: "blockquote", html: "Критично.", variant: "critical" },
        {
            type: "highlight",
            title: "Главное",
            content: [
                { type: "paragraph", html: "Абзац во врезке." },
                { type: "list", items: ["Пункт во врезке"] },
            ],
        },
        { type: "heading", level: 3, text: "Код и формулы" },
        {
            type: "code",
            language: "typescript",
            filename: "sum.ts",
            code: "export const sum = (a: number, b: number) => a + b;",
        },
        { type: "formula", formula: "E = mc^2", display: "block" },
        {
            type: "table",
            hasHeader: true,
            data: [
                ["Язык", "Год"],
                ["TypeScript", "2012"],
                ["Python", "1991"],
            ],
        },
        { type: "image", url: placeholder(40, "image"), alt: "Картинка", caption: "Подпись" },
        { type: "footer-note", html: "Примечание в конце статьи." },
    ],
};

/**
 * 12 articles, newest first by date: two feed pages of 5 plus a remainder. Tag "футбол"
 * appears in sport and society articles, to exercise the category + tags filter (B15).
 */
export const seedArticles = [
    allBlocksArticle,
    simpleArticle(19, "football-final", "Финал кубка по футболу", ["Спорт"], ["футбол"]),
    simpleArticle(18, "quantum-computer", "Квантовый компьютер", ["Наука"], ["физика"]),
    simpleArticle(17, "city-park", "Новый городской парк", ["Общество"], ["город"]),
    simpleArticle(16, "fans-survey", "Опрос болельщиков", ["Общество"], ["футбол"]),
    simpleArticle(15, "new-framework", "Ещё один JS-фреймворк", ["Технологии"], ["код"]),
    simpleArticle(14, "marathon", "Городской марафон", ["Спорт"], ["бег", "город"]),
    simpleArticle(13, "mars-mission", "Миссия на Марс", ["Наука"], ["космос"]),
    simpleArticle(12, "stadium-tickets", "Билеты на стадион", ["Общество"], ["футбол"]),
    simpleArticle(11, "chess-ai", "Шахматный ИИ", ["Технологии", "Спорт"], ["ии"]),
    simpleArticle(10, "student-league", "Студенческая лига", ["Спорт"], ["футбол"]),
    simpleArticle(9, "library-hours", "Библиотека работает дольше", ["Общество"], ["город"]),
];

export const seedEditorsPicks = [
    {
        id: "pick_0_000",
        title: "Статья со всеми блоками",
        description: "Всё, что умеет редактор",
        badge: "Must Read",
        articleUrl: "/articles/all-blocks",
    },
    {
        id: "pick_0_001",
        title: "Квантовый компьютер",
        description: "",
        badge: "Deep Dive",
        articleUrl: "/articles/quantum-computer",
    },
];

export const seedTodos = [
    { id: "todo-1", text: "Проверить вёрстку", completed: false },
    { id: "todo-2", text: "Опубликовать анонс", completed: true },
];
