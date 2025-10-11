/**
 * Парсит ISO дату в различные русские форматы
 * @param {string} dateISO - Дата в формате ISO string
 * @param {string} format - Формат вывода: 'full' | 'short' | 'relative'
 * @returns {string} - Отформатированная дата
 */
export const formatDate = (dateISO, format = 'full') => {
    if (!dateISO) return '';
    
    try {
      const date = new Date(dateISO);
      const now = new Date();
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateISO);
        return '';
      }
      
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      
      const monthNamesShort = [
        'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
        'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
      ];
  
      switch (format) {
        case 'full':
          return `${day} ${monthNames[month]} ${year}`;
          
        case 'with-time':
          return `${day} ${monthNames[month]} ${year} в ${hours}:${minutes}`;
          
        case 'short':
          return `${day} ${monthNamesShort[month]} ${year}`;
          
        case 'relative':
          return getRelativeTime(date, now);
          
        case 'month-year':
          return `${monthNames[month]} ${year}`;
          
        default:
          return `${day} ${monthNames[month]} ${year}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  /**
   * Возвращает относительное время (например, "2 дня назад")
   */
  const getRelativeTime = (date, now) => {
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'только что';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${getNoun(diffMinutes, 'минуту', 'минуты', 'минут')} назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ${getNoun(diffHours, 'час', 'часа', 'часов')} назад`;
    } else if (diffDays === 1) {
      return 'вчера';
    } else if (diffDays === 2) {
      return 'позавчера';
    } else if (diffDays < 7) {
      return `${diffDays} ${getNoun(diffDays, 'день', 'дня', 'дней')} назад`;
    } else {
      return formatDate(date.toISOString(), 'full');
    }
  };
  
  /**
   * Склонение существительных после числительных
   */
  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  };