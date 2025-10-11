import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "features/articles/hooks/useCreateArticle";
import "./styles.css";
import { prompt } from "./prompt";

const CreateArticlePage = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { createArticle, loading } = useCreateArticle();

    const handleJsonChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);

        if (value.trim()) {
            try {
                JSON.parse(value);
                setIsValid(true);
                setError("");
            } catch (err) {
                setIsValid(false);
                setError("Невалидный JSON: " + err.message);
            }
        } else {
            setIsValid(true);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jsonInput.trim() || !isValid) {
            setError("Введите валидный JSON");
            return;
        }

        try {
            const articleData = JSON.parse(jsonInput);
            const result = await createArticle(articleData);

            if (result.success) {
                alert("Статья успешно создана!");
                setJsonInput("");
                // Перенаправляем на страницу статьи или главную
                navigate(`/articles/${result.slug}`);
            } else {
                setError(result.error || "Ошибка при создании статьи");
            }
        } catch (err) {
            setError("Ошибка: " + err.message);
        }
    };

    const handleClear = () => {
        setJsonInput("");
        setError("");
        setIsValid(true);
    };

    const loadExample = () => {
        const example = {
            slug: "example-article",
            title: "Пример статьи",
            description: "Это пример статьи для демонстрации формата",
            category: "Технологии • Пример",
            dateDisplay: "10 октября 2025 г.",
            datePublishedISO: "2025-10-10T00:00:00+03:00",
            author: "ПГТУ Breaking NEWS",
            section: "Технологии",
            tags: ["пример", "технологии", "тест"],
            hero: {
                url: "https://example.com/image.jpg",
                alt: "Пример изображения",
                caption: "Подпись к изображению",
            },
            content: [
                {
                    type: "paragraph",
                    html: "Это пример параграфа статьи.",
                },
                {
                    type: "heading",
                    level: 2,
                    text: "Пример заголовка",
                },
            ],
        };

        setJsonInput(JSON.stringify(example, null, 2));
        setIsValid(true);
        setError("");
    };

    return (
        <>
            <Helmet>
                <title>Создать статью | ПГТУ Breaking NEWS</title>
                <meta
                    name="description"
                    content="Панель для создания и загрузки новых статей"
                />
            </Helmet>

            <main className="main">
                <div className="container">
                    <div className="create-article-page">
                        <header className="page-header">
                            <h1 className="page-title">Создать статью</h1>
                            <p className="page-subtitle">
                                Вставьте JSON с данными статьи для загрузки в
                                базу данных
                            </p>
                        </header>

                        <div className="create-article-content">
                            <div className="format-info">
                                <h3>📋 Формат данных</h3>
                                <ul>
                                    <li>Данные должны быть в формате JSON</li>
                                    <li>
                                        Обязательные поля: slug, title,
                                        description, content
                                    </li>
                                    <li>
                                        Поле <code>slug</code> должно быть
                                        уникальным
                                    </li>
                                    <li>
                                        Используйте кнопку "Загрузить пример"
                                        для просмотра формата
                                    </li>
                                </ul>
                            </div>

                            {/* Форма ввода */}
                            <form onSubmit={handleSubmit} className="json-form">
                                <div className="form-header">
                                    <label
                                        htmlFor="json-input"
                                        className="form-label"
                                    >
                                        JSON данные статьи
                                    </label>
                                    <div className="form-actions">
                                        <button type="button"
                                        onClick={
                                            async () => {
                                                try {
                                                    await navigator.clipboard.writeText(prompt);
                                                    console.log('Text copied to clipboard successfully!');
                                                    alert("Шаблон успешно скопирован!");
                                                  } catch (err) {
                                                    console.error('Failed to copy text: ', err);
                                                  }
                                            }
                                        }
                                        className="btn btn-outline"
                                        disabled={loading}>
                                            Скопировать шаблон промпта
                                        </button>
                                        <button
                                            type="button"
                                            onClick={loadExample}
                                            className="btn btn-outline"
                                            disabled={loading}
                                        >
                                            📝 Загрузить пример
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="btn btn-outline"
                                            disabled={loading}
                                        >
                                            🗑️ Очистить
                                        </button>
                                    </div>
                                </div>

                                <textarea
                                    id="json-input"
                                    className={`json-input ${
                                        !isValid ? "error" : ""
                                    }`}
                                    value={jsonInput}
                                    onChange={handleJsonChange}
                                    placeholder='{"slug": "my-article", "title": "Заголовок статьи", ...}'
                                    rows={20}
                                    disabled={loading}
                                />

                                {error && (
                                    <div className="error-message">
                                        ⚠️ {error}
                                    </div>
                                )}

                                {isValid && jsonInput.trim() && (
                                    <div className="success-message">
                                        ✅ JSON валиден
                                    </div>
                                )}

                                <div className="submit-section">
                                    <button
                                        type="submit"
                                        className="btn btn-primary submit-btn"
                                        disabled={
                                            !jsonInput.trim() ||
                                            !isValid ||
                                            loading
                                        }
                                    >
                                        {loading
                                            ? "⏳ Загрузка..."
                                            : "🚀 Создать статью"}
                                    </button>

                                    <span className="char-count">
                                        Символов: {jsonInput.length}
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default CreateArticlePage;
