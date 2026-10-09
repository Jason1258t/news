import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { PROJECT_NAME } from "shared/config";
import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "features/article-create";
import { CopyPromptButtons } from "features/copy-article-prompt";
import toast from "react-hot-toast";
import { DatePicker } from "shared/ui/date-picker";
import { TextInput } from "shared/ui/text-input";
import { ImagePreview } from "shared/ui/image-preview";
import { Button } from "shared/ui/button";
import styles from "./CreateArticlePage.module.css";
import { useCreateArticleStore } from "./create-article-store";
import { Main, Container } from "shared/ui/layout";
import { CharCounter } from "shared/ui/char-counter";
import { getErrorMessage } from "shared/lib/error";

export const CreateArticlePage = () => {
    const store = useCreateArticleStore();
    const navigate = useNavigate();
    const { mutateAsync: createArticle, isPending: loading } = useCreateArticle();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!store.jsonInput?.trim() || !store.isValid) {
            store.setError("Введите валидный JSON");
            return;
        }

        try {
            const { slug } = await createArticle(JSON.parse(store.jsonInput));
            toast.success("Статья успешно создана!");
            store.setJsonInput("");
            navigate(`/articles/${slug}`);
        } catch (err) {
            store.setError("Ошибка: " + getErrorMessage(err));
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
                    <div className={styles.page}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>Создать статью</h1>
                            <p className={styles.subtitle}>
                                Вставьте JSON с данными статьи для загрузки в базу данных
                            </p>
                        </header>

                        <div className={styles.content}>
                            <div className={styles.formatInfo}>
                                <h3>📋 Формат данных</h3>
                                <ul>
                                    <li>Данные должны быть в формате JSON</li>
                                    <li>
                                        Формат — как в промпте форматирования; при ошибке будет
                                        показано, какое поле не так
                                    </li>
                                    <li>
                                        Поле <code>slug</code> должно быть уникальным
                                    </li>
                                    <li>
                                        Не забудьте выбрать дату публикации и указать изображение
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.publication}>
                                <div className={styles.datePicker}>
                                    <DatePicker
                                        label="Выберите дату публикации"
                                        value={store.date}
                                        onChange={store.setDate}
                                    />
                                </div>
                                <div className={styles.imageUrl}>
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
                            <div className={styles.actions}>
                                <CopyPromptButtons
                                    publishDate={store.date}
                                    imageUrl={store.imageUrl}
                                />
                            </div>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formHeader}>
                                    <label htmlFor="json-input" className={styles.formLabel}>
                                        JSON данные статьи
                                    </label>
                                </div>

                                <textarea
                                    id="json-input"
                                    className={`${styles.jsonInput} ${!store.isValid ? styles.jsonInputInvalid : ""}`}
                                    value={store.jsonInput}
                                    onChange={(e) => store.setJsonInput(e.target.value)}
                                    placeholder='{"slug": "my-article", "title": "Заголовок статьи", ...}'
                                    rows={20}
                                    disabled={loading}
                                />

                                {store.error && (
                                    <div className={styles.errorMessage} role="alert">
                                        ⚠️ {store.error}
                                    </div>
                                )}

                                {store.isValid && store.jsonInput?.trim() && (
                                    <div className={styles.successMessage}>✅ JSON валиден</div>
                                )}

                                <div className={styles.submitSection}>
                                    <Button
                                        type="submit"
                                        disabled={
                                            !store.jsonInput.trim() || !store.isValid || loading
                                        }
                                    >
                                        {loading ? "⏳ Загрузка..." : "🚀 Создать статью"}
                                    </Button>

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
