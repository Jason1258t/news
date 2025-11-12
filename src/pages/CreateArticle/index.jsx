import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "features/articles/hooks/useCreateArticle";
import "./styles.css";
import { formatPrompt } from "./prompts/format_prompt";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "widgets/input/date/DatePicker";
import TextInput from "widgets/input/text/TextInput";
import ImagePreview from "widgets/input/image/ImagePreview";
import { telegramPrompt } from "./prompts/telegram_prompt";

const CreateArticlePage = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { createArticle, loading } = useCreateArticle();

    const [imageUrl, setImageUrl] = useState(null);
    const [date, setDate] = useState(new Date());

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
                toast.success("Статья успешно создана!");
                setJsonInput("");
                navigate(`/articles/${result.slug}`);
            } else {
                setError(result.error || "Ошибка при создании статьи");
            }
        } catch (err) {
            setError("Ошибка: " + err.message);
        }
    };

    const copyTelegramPrompt = async () => {
        try {
            await navigator.clipboard.writeText(telegramPrompt);
            toast.success("Шаблон успешно скопирован!");
        } catch (err) {
            toast.error("Ошибка копирования");
            console.error("Failed to copy text: ", err);
        }
    };

    const copyFormatPrompt = async () => {
        try {
            let fullPrompt = formatPrompt;
            if (date) {
                fullPrompt += `\ndatePublished: ${date}`;
            }
            if (imageUrl) {
                fullPrompt += `\nimg: ${imageUrl}`;
            }

            await navigator.clipboard.writeText(fullPrompt);
            toast.success("Шаблон успешно скопирован!");
        } catch (err) {
            toast.error("Ошибка копирования");
            console.error("Failed to copy text: ", err);
        }
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
                                        Не забудьте выбрать дату публикации и
                                        указать изображение
                                    </li>
                                </ul>
                            </div>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div style={{ width: 250 }}>
                                    <DatePicker
                                        label="Выберите дату публикации"
                                        onChange={(value) => {
                                            setDate(value);
                                            console.log(date);
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <TextInput
                                        label="URL изображения"
                                        placeholder="Введите URL изображения"
                                        value={imageUrl ?? ""}
                                        onChange={(v) =>
                                            setImageUrl(v.length > 0 ? v : null)
                                        }
                                    />
                                </div>
                            </div>

                            <ImagePreview
                                src={imageUrl}
                                onRemove={() => setImageUrl(null)}
                            />
                            {imageUrl && <div style={{ height: "1rem" }}></div>}
                            <div
                                className="form-actions"
                                style={{ marginBottom: "1rem" }}
                            >
                                <button
                                    type="button"
                                    onClick={copyFormatPrompt}
                                    className="btn btn-outline"
                                >
                                    Скопировать промпт форматирония
                                </button>
                                <button
                                    type="button"
                                    onClick={copyTelegramPrompt}
                                    className="btn btn-outline"
                                >
                                    Скопировать промпт для тг
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="json-form">
                                <div className="form-header">
                                    <label
                                        htmlFor="json-input"
                                        className="form-label"
                                    >
                                        JSON данные статьи
                                    </label>
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
            <Toaster />
        </>
    );
};

export default CreateArticlePage;
