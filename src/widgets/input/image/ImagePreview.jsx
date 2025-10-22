import React, { useState } from 'react';
import styles from './ImagePreview.module.css';

const ImagePreview = ({ 
  src, 
  alt = "Preview",
  onLoad,
  onError,
  onRemove,
  showRemoveButton = true,
  className = "",
  width = "100%",
  height = "auto",
  maxHeight = "400px"
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) {
      onLoad(src);
    }
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    if (onError) {
      onError(src);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(src);
    }
  };

  if (!src) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.previewHeader}>
        <span className={styles.title}>Превью изображения</span>
        {showRemoveButton && (
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeButton}
            title="Удалить изображение"
          >
            ×
          </button>
        )}
      </div>
      
      <div className={styles.imageWrapper}>
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <span>Загрузка изображения...</span>
          </div>
        )}
        
        <img
          src={src}
          alt={alt}
          className={`${styles.previewImage} ${hasError ? styles.hidden : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            width: width,
            height: height,
            maxHeight: maxHeight
          }}
        />
        
        {hasError && (
          <div className={styles.error}>
            <div className={styles.errorIcon}>⚠️</div>
            <span>Не удалось загрузить изображение</span>
            <button 
              onClick={handleRemove}
              className={styles.errorButton}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;