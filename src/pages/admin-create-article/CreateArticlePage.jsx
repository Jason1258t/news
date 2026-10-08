import React from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "features/article-create";
import "./CreateArticlePage.css";
import { CopyPromptButtons } from "features/copy-article-prompt";
import toast from "react-hot-toast";
import { DatePicker } from "shared/ui/date-picker";
import { TextInput } from "shared/ui/text-input";
import { ImagePreview } from "shared/ui/image-preview";
import { FilledButton } from "shared/ui/button";
import { useCreateArticleStore } from "./create-article-store";
import { Main, Container } from "shared/ui/layout";
import { CharCounter } from "shared/ui/char-counter";

export const CreateArticlePage = () => {
    const store = useCreateArticleStore();
    const navigate = useNavigate();
    const { createArticle, loading } = useCreateArticle();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!store.jsonInput?.trim() || !store.isValid) {
            store.setError("Введите валидный JSON");
            return;
        }

        try {
            const articleData = JSON.parse(store.jsonInput);
            const result = await createArticle(articleData);

            if (result.success) {
                toast.success("Статья успешно создана!");
                store.setJsonInput("");
                navigate(`/articles/${result.slug}`);
            } else {
                store.setError(result.error || "Ошибка при создании статьи");
            }
        } catch (err) {
            store.setError("Ошибка: " + err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>{`Создать статью | ${PROJECT_NAME}`}</title>
                <meta name="description" content="Панель для создания и загрузки новых статей" />
            </Helmet>

            <Main>
                <Container>
                    <div className="create-article-page">
                        <header className="page-header">
                            <h1 className="page-title">Создать статью</h1>
                            <p className="page-subtitle">
                                Вставьте JSON с данными статьи для загрузки в базу данных
                            </p>
                        </header>

                        <div className="create-article-content">
                            <div className="format-info">
                                <h3>📋 Формат данных</h3>
                                <ul>
                                    <li>Данные должны быть в формате JSON</li>
                                    <li>Обязательные поля: slug, title, description, content</li>
                                    <li>
                                        Поле <code>slug</code> должно быть уникальным
                                    </li>
                                    <li>
                                        Не забудьте выбрать дату публикации и указать изображение
                                    </li>
                                </ul>
                            </div>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <div style={{ width: 250 }}>
                                    <DatePicker
                                        label="Выберите дату публикации"
                                        onChange={(value) => {
                                            store.setDate(value);
                                            console.log(store.date);
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <TextInput
                                        label="URL изображения"
                                        placeholder="Введите URL изображения"
                                        value={store.imageUrl ?? ""}
                                        onChange={(v) => store.setImageUrl(v.length > 0 ? v : null)}
                                    />
                                </div>
                            </div>

                            <ImagePreview
                                src={store.imageUrl}
                                onRemove={() => store.setImageUrl(null)}
                            />
                            {store.imageUrl && <div style={{ height: "1rem" }}></div>}
                            <div className="form-actions" style={{ marginBottom: "1rem" }}>
                                <CopyPromptButtons
                                    publishDate={store.date}
                                    imageUrl={store.imageUrl}
                                />
                            </div>
                            <form onSubmit={handleSubmit} className="json-form">
                                <div className="form-header">
                                    <label htmlFor="json-input" className="form-label">
                                        JSON данные статьи
                                    </label>
                                </div>

                                <textarea
                                    id="json-input"
                                    className={`json-input ${!store.isValid ? "error" : ""}`}
                                    value={store.jsonInput}
                                    onChange={(e) => store.setJsonInput(e.target.value)}
                                    placeholder='{"slug": "my-article", "title": "Заголовок статьи", ...}'
                                    rows={20}
                                    disabled={loading}
                                />

                                {store.error && (
                                    <div className="error-message">⚠️ {store.error}</div>
                                )}

                                {store.isValid && store.jsonInput?.trim() && (
                                    <div className="success-message">✅ JSON валиден</div>
                                )}

                                <div className="submit-section">
                                    <FilledButton
                                        type="submit"
                                        active={
                                            store.jsonInput?.trim() && store.isValid && !loading
                                        }
                                    >
                                        {loading ? "⏳ Загрузка..." : "🚀 Создать статью"}
                                    </FilledButton>

                                    <CharCounter length={store.jsonInput.length} />
                                </div>
                            </form>
                        </div>
                    </div>
                </Container>
            </Main>
        </>
    );
};
