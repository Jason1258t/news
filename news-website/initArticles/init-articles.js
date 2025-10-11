import { db } from '../src/app/firebase.js';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Загружает конкретную статью по ID из JSON файла
 */
const loadSingleArticle = (articleId) => {
  try {
    const articlesDir = join(__dirname, 'articles');
    const filePath = join(articlesDir, `${articleId}.json`);
    
    console.log(`🔍 Поиск файла: ${filePath}`);
    
    // Проверяем существование файла
    if (!readdirSync(articlesDir).includes(`${articleId}.json`)) {
      console.log(`❌ Файл ${articleId}.json не найден в директории articles`);
      return null;
    }
    
    // Читаем и парсим файл
    const fileContent = readFileSync(filePath, 'utf8');
    const articleData = JSON.parse(fileContent);
    
    // Проверяем структуру файла
    if (!articleData[articleId]) {
      console.log(`❌ Неверная структура файла: ожидался ключ "${articleId}"`);
      return null;
    }
    
    console.log(`✅ Загружена статья: ${articleData[articleId].title}`);
    return articleData[articleId];
    
  } catch (error) {
    console.error(`❌ Ошибка загрузки статьи ${articleId}:`, error.message);
    return null;
  }
};

/**
 * Принудительная перезапись одной конкретной статьи
 */
export const forceInitSingleArticle = async (articleId) => {
  try {
    console.log(`🎯 ПРИНУДИТЕЛЬНАЯ ЗАГРУЗКА СТАТЬИ: ${articleId}`);
    
    // Загружаем статью из файла
    const articleData = loadSingleArticle(articleId);
    
    if (!articleData) {
      console.log(`❌ Статья ${articleId} не найдена или повреждена`);
      return;
    }
    
    // Проверяем, существует ли уже статья
    const articlesSnapshot = await getDocs(collection(db, 'articles'));
    const existingArticle = articlesSnapshot.docs.find(doc => doc.id === articleId);
    
    if (existingArticle) {
      console.log(`📝 Статья "${articleData.title}" уже существует, обновляем...`);
    } else {
      console.log(`🆕 Статья "${articleData.title}" не найдена, создаем новую...`);
    }
    
    // Добавляем/обновляем статью в Firestore
    const docRef = doc(db, 'articles', articleId);
    await setDoc(docRef, {
      ...articleData,
      createdAt: existingArticle ? existingArticle.data().createdAt : new Date(),
      updatedAt: new Date()
    });
    
    console.log(`✅ Успешно ${existingArticle ? 'обновлена' : 'добавлена'}: "${articleData.title}"`);
    
  } catch (error) {
    console.error(`💥 Критическая ошибка при загрузке статьи ${articleId}:`, error);
  }
};

/**
 * Показывает список доступных статей
 */
export const listAvailableArticles = () => {
  try {
    const articlesDir = join(__dirname, 'articles');
    const files = readdirSync(articlesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log('\n📋 ДОСТУПНЫЕ СТАТЬИ:');
    jsonFiles.forEach(file => {
      const articleId = file.replace('.json', '');
      console.log(`   📄 ${articleId}`);
    });
    
    return jsonFiles.map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('❌ Ошибка чтения директории articles:', error.message);
    return [];
  }
};

/**
 * Читает все JSON файлы из директории articles
 */
const loadArticlesFromFiles = () => {
  try {
    const articlesDir = join(__dirname, 'articles');
    console.log(`📁 Чтение файлов из директории: ${articlesDir}`);
    
    // Проверяем существование директории
    const files = readdirSync(articlesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📄 Найдено JSON файлов: ${jsonFiles.length}`);
    
    const articlesData = {};
    
    jsonFiles.forEach(file => {
      try {
        const filePath = join(articlesDir, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const articleData = JSON.parse(fileContent);
        
        // Предполагаем, что каждый файл содержит один документ
        const articleId = Object.keys(articleData)[0];
        articlesData[articleId] = articleData[articleId];
        
        console.log(`✅ Загружена статья: ${articleData[articleId].title}`);
      } catch (fileError) {
        console.error(`❌ Ошибка чтения файла ${file}:`, fileError.message);
      }
    });
    
    return articlesData;
  } catch (error) {
    console.error('❌ Ошибка доступа к директории articles:', error.message);
    return {};
  }
};

/**
 * Инициализирует статьи в Firestore из JSON файлов
 */
export const initArticles = async () => {
  try {
    console.log('🔍 Проверка наличия статей в Firestore...');
    
    // Проверяем, есть ли уже статьи
    const articlesSnapshot = await getDocs(collection(db, 'articles'));
    
    if (articlesSnapshot.empty) {
      console.log('📚 Статьи не найдены, начинаем инициализацию из файлов...');
      
      // Загружаем статьи из JSON файлов
      const articlesData = loadArticlesFromFiles();
      
      if (Object.keys(articlesData).length === 0) {
        console.log('⚠️  Не найдено статей для импорта');
        return;
      }
      
      console.log(`📥 Начинаем импорт ${Object.keys(articlesData).length} статей...`);
      
      // Добавляем все статьи в Firestore
      for (const [articleId, articleData] of Object.entries(articlesData)) {
        try {
          const docRef = doc(db, 'articles', articleId);
          await setDoc(docRef, {
            ...articleData,
            createdAt: new Date(), // добавляем timestamp создания
            updatedAt: new Date()  // добавляем timestamp обновления
          });
          console.log(`✅ Добавлена: "${articleData.title}"`);
        } catch (docError) {
          console.error(`❌ Ошибка добавления статьи ${articleId}:`, docError.message);
        }
      }
      
      console.log('🎉 Все статьи успешно импортированы в Firestore!');
    } else {
      console.log(`📖 В Firestore уже есть ${articlesSnapshot.size} статей, пропускаем инициализацию`);
    }
  } catch (error) {
    console.error('💥 Критическая ошибка при инициализации статей:', error);
  }
};

/**
 * Принудительная перезапись всех статей (осторожно!)
 */
export const forceInitArticles = async () => {
  try {
    console.log('⚠️  ПРИНУДИТЕЛЬНАЯ ПЕРЕЗАПИСЬ СТАТЕЙ...');
    
    // Загружаем статьи из JSON файлов
    const articlesData = loadArticlesFromFiles();
    
    if (Object.keys(articlesData).length === 0) {
      console.log('❌ Не найдено статей для импорта');
      return;
    }
    
    console.log(`📥 Начинаем принудительный импорт ${Object.keys(articlesData).length} статей...`);
    
    // Добавляем/перезаписываем все статьи
    for (const [articleId, articleData] of Object.entries(articlesData)) {
      try {
        const docRef = doc(db, 'articles', articleId);
        await setDoc(docRef, {
          ...articleData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ Обновлена: "${articleData.title}"`);
      } catch (docError) {
        console.error(`❌ Ошибка обновления статьи ${articleId}:`, docError.message);
      }
    }
    
    console.log('🎉 Все статьи успешно обновлены в Firestore!');
  } catch (error) {
    console.error('💥 Критическая ошибка при принудительной инициализации:', error);
  }
};