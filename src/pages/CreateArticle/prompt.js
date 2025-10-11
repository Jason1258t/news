export const prompt = `types:
/**
 * @typedef {Object} ArticleOG
 * @property {string} url
 * @property {string} image
 * @property {string=} title
 * @property {string=} description
 */

/**
 * @typedef {Object} ArticleHero
 * @property {string} url
 * @property {string} alt
 * @property {string=} caption
 */

/**
 * @typedef {Object} ArticleHeadingBlock
 * @property {"heading"} type
 * @property {2|3|4} level
 * @property {string} text
 */

/**
 * @typedef {Object} ArticleParagraphBlock
 * @property {"paragraph"} type
 * @property {string} html // supports inline <strong>, <em>, <a>, etc.
 */

/**
 * @typedef {Object} ArticleListBlock
 * @property {"list"} type
 * @property {Array<string>} items // items allow inline HTML
 */

/**
 * @typedef {Object} ArticleImageBlock
 * @property {"image"} type
 * @property {string} url
 * @property {string} alt
 * @property {string=} caption
 */

/**
 * @typedef {Object} ArticleBlockquoteBlock
 * @property {"blockquote"} type
 * @property {string} html
 * @property {string=} footer
 * @property {"default"|"warning"|"critical"=} variant
 */

/**
 * @typedef {Object} ArticleHighlightBlock
 * @property {"highlight"} type
 * @property {string=} title
 * @property {Array<ArticleParagraphBlock|ArticleListBlock>} content
 */

/**
 * @typedef {Object} ArticleFooterNoteBlock
 * @property {"footer-note"} type
 * @property {string} html
 */

/**
 * @typedef {(
 *  ArticleHeadingBlock|
 *  ArticleParagraphBlock|
 *  ArticleListBlock|
 *  ArticleImageBlock|
 *  ArticleBlockquoteBlock|
 *  ArticleHighlightBlock|
 *  ArticleFooterNoteBlock
 * )} ArticleContentBlock
 */

/**
 * @typedef {Object} Article
 * @property {string} slug
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {string} dateDisplay
 * @property {string} datePublishedISO
 * @property {string} author
 * @property {string[]} tags
 * @property {ArticleHero} hero
 * @property {ArticleOG=} og
 * @property {Array<ArticleContentBlock>} content
 */

export {}; // JSDoc-only typedefs module


example:
{
  "grind-humanity-origin": {
    "slug": "grind-humanity-origin",
    "title": "Гринд: Древняя сила, что породила человечество",
    "description": "Что, если величайшая движущая сила цивилизации — это не огонь и не колесо, а скучное монотонное действие, которое мы называем гриндом? Как игры вроде Genshin Impact, Minecraft и Dota 2 связаны с зарождением человечества.",
    "category": "Игры • Наука • Психология",
    "datePublishedISO": "2024-12-12T00:00:00+03:00",
    "author": "ПГТУ Breaking NEWS",
    "tags": ["гринд", "игры", "психология", "эволюция", "Genshin Impact", "Minecraft", "Dota 2"],
    "hero": {
      "url": "https://i.pinimg.com/736x/2d/05/d8/2d05d891465a82b4af821c3c6afcc09e.jpg",
      "alt": "Эволюция от первобытного человека до современного геймера",
      "caption": "Гринд как эволюционная константа: от каменных орудий до виртуальных миров"
    },
    "og": {
      "url": "https://jason1258t.github.io/news/#/articles/grind-humanity-origin",
      "image": "https://i.pinimg.com/736x/2d/05/d8/2d05d891465a82b4af821c3c6afcc09e.jpg",
      "title": "Гринд: Древняя сила, что породила человечество",
      "description": "Как механизмы выживания древних людей проявились в современных видеоиграх"
    },
    "content": [
      {
        "type": "paragraph",
        "html": "Что, если я скажу вам, что величайшая движущая сила человеческой цивилизации — это не огонь, не колесо и не любовь, а скучное, монотонное, повторяющееся действие? Та самая деятельность, которую в современных видеоиграх мы с презрением называем <strong>«гриндом»</strong>. Новые исследования в области цифровой археологии и палеопсихологии позволяют предположить, что наш вид обязан своим рождением именно этому феномену."
      },
      {
        "type": "heading",
        "level": 2,
        "text": "«Собирать 1000 ягод для апгрейда племени»: Гринд в Каменном веке"
      },
      {
        "type": "paragraph",
        "html": "Представьте себе первобытного человека. Его не существовало бы, если бы его предок не занимался самым настоящим гриндом тысячи лет подряд."
      },
      {
        "type": "list",
        "items": [
          "<strong>Собирательство:</strong> Не «найти одну мамоновую кость», а собрать 10,000 ягод, 5,000 кореньев и 1,000 грибов для пропитания племени. Это был первый квест на сбор ресурсов.",
          "<strong>Изготовление инструментов:</strong> Чтобы создать один кремневый наконечник, требовалось отбить сотни камней. По сути, прокачка навыка «Камнеобработка» до 80-го уровня.",
          "<strong>Охота:</strong> Многочасовое выслеживание добычи, безуспешные загоны, десятки промахов копьем — всё это ради шанса получить жирный лутер-дроп в виде туши мамонта."
        ]
      },
      {
        "type": "blockquote",
        "html": "«Если бы у первобытного человека была статистика, его экран достижений пестрел бы надписями: «Достижение «Неутомимый»: Собери 100,000 единиц ресурсов». Они не думали о гринде, они в нем жили. Это был их «Майнкрафт» на хардкоре, где при смерти от голода не спасал креатив-режим».",
        "footer": "— доктор психологических наук, исследователь игровых механик",
        "variant": "default"
      },
      {
        "type": "heading",
        "level": 2,
        "text": "«Прокачайте свое племя до цивилизации»: Как Гринд построил империи"
      },
      {
        "type": "paragraph",
        "html": "С переходом к земледелию гриндовый паттерн только усилился."
      },
      {
        "type": "list",
        "items": [
          "<strong>Земледелие:</strong> Посадить, прополоть, полить, собрать. Цикл, повторяющийся из года в год. Это ранняя версия ежедневных заданий в «Геншине»: рутина, которая медленно, но верно приносит прогресс (в данном случае — выживание).",
          "<strong>Строительство:</strong> Возведение пирамид, Стоунхенджа или Великой Китайской стены — это чистый, незамутненный клановый гринд. Тысячи людей годами выполняли одну и ту же повторяющуюся задачу ради «апгрейда» всей цивилизации."
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "text": "Гринд в ДНК: Почему нас до сих пор тянет на эти грабли"
      },
      {
        "type": "paragraph",
        "html": "Наш мозг эволюционно запрограммирован на гриндовую деятельность. Механизм прост: повторяющееся действие -> маленькая награда (дофамин) -> ощущение прогресса -> продолжение деятельности. Именно это и эксплуатируют современные игры."
      },
      {
        "type": "list",
        "items": [
          "<strong>Dota 2 / LoL:</strong> Бесконечные катки за MMR. Один матч почти ничего не решает, но целая серия побед дает заветный +30 к рейтингу. Вы не «играете», вы «гриндите» свой рейтинг.",
          "<strong>Rust:</strong> Апофеоз первобытного гринда. Проснулся, собрал дерево и камень, почини базу, умер от голода или от рук соседа. Начать заново. Это симулятор того самого каменного века, только с пушками.",
          "<strong>Геншин Импакт:</strong> Ежедневные задания, трата смолы, фарм артефактов с рандомными статами. Вы годами можете выполнять одни и те же действия, чтобы на несколько процентов усилить одного персонажа.",
          "<strong>Майнкрафт:</strong> Построить мега-постройку — это решение потратить сотни часов на добычу и размещение блоков. Чистейший медитативный гринд."
        ]
      },
      {
        "type": "highlight",
        "title": "Парадокс Гринда",
        "content": [
          {
            "type": "paragraph",
            "html": "Современный человек, избавленный от необходимости физического выживания, инстинктивно ищет гринду в виртуальных мирах. Мы бежим от рутины офиса в… другую рутину, но ту, где правила честны, а прогресс визуализирован. Эльфийский лес в «Геншине» или шахта в «Майнкрафте» — это наши цифровые эквиваленты первобытного леса и каменоломни."
          }
        ]
      },
      {
        "type": "paragraph",
        "html": "Так что в следующий раз, засиживаясь допознад в очередной игре за фармом ресурсов или рейтинга, знайте: вы не просто убиваете время. Вы подчиняетесь древнейшему инстинкту, который когда-то заставил вашего предка сделать тысячное кремневое рубило. Гринд — это не проклятие геймера. Это наше наследие. Это пламя, что когда-то разожгло первую искру человечества, и теперь мы просто ищем, куда бы его приложить."
      },
      {
        "type": "footer-note",
        "html": "<strong>Исследование основано на анализе</strong> игровых механик популярных видеоигр и данных нейробиологии о формировании поведенческих паттернов."
      }
    ]
  }
}

На основе этого переработай вот эту статью, чтобы все выглядело красиво, правдоподбно и убедительно.
Возможно отдельно добавлю сюда ссылку на изображение, это будет ссылка для встраивания в hero и og. Если ее нет спроси есть ли она и стоит ли ее вводить
`;
