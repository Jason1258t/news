import React, { useState, useRef, useEffect } from 'react';
import ImagePreview from './ImagePreview';
import styles from './ImageInputWithPreview.module.css';

const ImageInputWithPreview = ({ 
  value = "",
  onChange,
  onImageLoad,
  onImageError,
  onImageRemove,
  label = "Ссылка на изображение",
  showPreview = true,
  previewProps = {},
  className = ""
}) => {
  const [imageUrl, setImageUrl] = useState(value);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    
    if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }

    if (onChange) {
      onChange(url);
    }
  };

  const handleImageLoad = (url) => {
    if (onImageLoad) {
      onImageLoad(url);
    }
  };

  const handleImageError = (url) => {
    if (onImageError) {
      onImageError(url);
    }
  };

  const handleImageRemove = (url) => {
    setImageUrl('');
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onImageRemove) {
      onImageRemove(url);
    }

    if (onChange) {
      onChange('');
    }
  };

  // Синхронизация с внешним value
  useEffect(() => {
    if (value !== undefined) {
      setImageUrl(value);
      if (value) {
        setPreviewUrl(value);
      }
    }
  }, [value]);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Поле для ссылки на изображение */}
      <div className={styles.inputGroup}>
        <label htmlFor="imageUrlInput" className={styles.label}>
          {label}
        </label>
        <div className={styles.urlInputContainer}>
          <input
            id="imageUrlInput"
            type="url"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Введите URL изображения или загрузите файл"
            className={styles.urlInput}
          />
        </div>
      </div>

      {/* Превью изображения через отдельный компонент */}
      {showPreview && previewUrl && (
        <ImagePreview
          src={previewUrl}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onRemove={handleImageRemove}
          {...previewProps}
        />
      )}
    </div>
  );
};

export default ImageInputWithPreview;