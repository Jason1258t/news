import { initArticles, forceInitArticles } from './init-articles.js';

// Получаем аргументы командной строки
const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

async function main() {
  console.log('🚀 Запуск инициализации статей...\n');
  
  if (force) {
    await forceInitArticles();
  } else {
    await initArticles();
  }
  
  console.log('\n✅ Инициализация завершена');
  process.exit(0);
}

main().catch(error => {
  console.error('💥 Ошибка при запуске:', error);
  process.exit(1);
});