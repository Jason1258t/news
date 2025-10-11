// scripts/run-init.js
import { 
  initArticles, 
  forceInitArticles, 
  forceInitSingleArticle,
  listAvailableArticles 
} from './init-articles.js';

// Получаем аргументы командной строки
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');
const single = args.find(arg => arg.startsWith('--article=')) || args.find(arg => arg.startsWith('-a='));
const list = args.includes('--list') || args.includes('-l');
const help = args.includes('--help') || args.includes('-h');

function showHelp() {
  console.log(`
🚀 ИНИЦИАЛИЗАТОР СТАТЕЙ

Использование:
  npm run init:articles [опции]

Опции:
  --help, -h          Показать эту справку
  --list, -l          Показать список доступных статей
  --force, -f         Принудительно перезаписать ВСЕ статьи
  --article=<id>, -a=<id>  Принудительно загрузить одну статью

Примеры:
  npm run init:articles                    # Обычная инициализация
  npm run init:articles --force            # Перезаписать все статьи
  npm run init:articles --article=ai-warning # Загрузить одну статью
  npm run init:articles --list             # Показать список статей
  `);
}

async function main() {
  if (help) {
    showHelp();
    return;
  }

  if (list) {
    listAvailableArticles();
    return;
  }

  console.log('🚀 Запуск инициализации статей...\n');
  
  if (single) {
    // Форсированная загрузка одной статьи
    const articleId = single.split('=')[1];
    if (!articleId) {
      console.error('❌ Укажите ID статьи: --article=<id> или -a=<id>');
      process.exit(1);
    }
    await forceInitSingleArticle(articleId);
  } else if (force) {
    // Форсированная загрузка всех статей
    await forceInitArticles();
  } else {
    // Обычная инициализация (только если статей нет)
    await initArticles();
  }
  
  console.log('\n✅ Инициализация завершена');
  process.exit(0);
}

main().catch(error => {
  console.error('💥 Ошибка при запуске:', error);
  process.exit(1);
});