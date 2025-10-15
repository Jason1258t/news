import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "features/articles/hooks/useCreateArticle";
import "./styles.css";
import { prompt } from "./prompt";
import {talkai} from "features/articles/api/talk-to-api";

const CreateArticlePage = () => {
    const [textInput, setTextInput] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [error, setError] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [isApproved, setIsApproved] = useState("")
    const [articleData, setArticleData] = useState("")
    const [isJson, setIsJson] = useState(false)
    const navigate = useNavigate();

    const { createArticle, loading } = useCreateArticle();

    const handleTextChange = (e) => {
        const value = e.target.value;
        if(isJson){
            if (value.trim()) {
            try {
                JSON.parse(value);
                setIsValid(true);
                setError("");
            } catch (err) {
                setIsValid(false);
                setError("Невалидный JSON: " + err.message);
            }}
        } else {
            setIsValid(true);
            setError("");
        }
        setTextInput(value);
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        let temp = JSON.parse(textInput)
        temp['datePublishedISO'] = new Date().toISOString()
        const result = await createArticle(temp);
        
        if (result.success) {
            alert("Статья успешно создана!");
            setTextInput("");
            // Перенаправляем на страницу статьи или главную
            navigate(`/articles/${result.slug}`);            
        } else {
            setError(result.error || "Ошибка при создании статьи");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAiLoading(true)
        let temp = ""
        try {
            temp = await talkai(prompt, textInput)
        } catch (err) {
            temp = ""
            setError("Ошибка: " + err.message);
        }
        temp = temp.data['choices'][0]['message']['content']
        
        setArticleData(temp)
        setTextInput(temp)
        setAiLoading(false)
        setIsJson(true)
    };

    const handleClear = () => {
        setTextInput("");
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

        setTextInput(JSON.stringify(example, null, 2));
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
                                Вставьте текст вашей статьи
                            </p>
                        </header>

                        <div className="create-article-content">
                            <div className="format-info">
                                <h3>📋 Информация</h3>
                                <ul>
                                    <li>Вам необходимо вставить/написать текст в поле ниже</li>
                                    <li>
                                        Далее нейросеть превратит ваш текст в нужный формат
                                    </li>
                                    <li>
                                        После этого статья будет опубликована
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
                                        Текст статьи
                                    </label>
                                    <div className="form-actions">
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
                                    value={textInput}
                                    onChange={handleTextChange}
                                    placeholder='всем привет с вами демон и андроид....'
                                    rows={20}
                                    disabled={loading}
                                />

                                {error && (
                                    <div className="error-message">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <div className="submit-section">
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '2rem'
                                    }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary submit-btn"
                                            disabled={
                                                !isValid ||
                                                aiLoading
                                            }
                                            id="submitBtn"
                                        >
                                            {aiLoading
                                                ? "⏳ Загрузка..."
                                                : "🚀 Создать статью"
                                            }
                                        </button>

                                        <button
                                            type="approve"
                                            className="btn btn-primary submit-btn"
                                            disabled={
                                                isApproved ||
                                                aiLoading ||
                                                articleData==""
                                            }
                                            onClick={handleApprove}
                                        >
                                            Подтвердить
                                        </button>
                                    </div>
                                    <span className="char-count">
                                        Символов: {textInput.length}
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
