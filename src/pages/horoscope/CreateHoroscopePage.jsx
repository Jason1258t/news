import React from "react";
import { Helmet } from "react-helmet-async";
import { Main, Container, Content } from "shared/ui/layout";
import OutlinedButton from "widgets/buttons/OutlinedButton";
import FilledButton from "widgets/buttons/FilledButton";
import TextInput from "widgets/input/text/TextInput";
import TextArea from "widgets/input/text/TextArea";
import toast, { Toaster } from "react-hot-toast";
import { useCreateHoroscopeStore } from "features/horoscope/model/create-horoscope-store";
import { PROJECT_NAME } from "app/project";
import { useCreateHoroscope } from "features/horoscope/hooks";

import styles from "./CreateHoroscopePage.module.css";
import CharCounter from "shared/ui/info/char-counter";
import { copyFormatPrompt } from "features/horoscope/model/horoscope_format_prompt";

const CreateHoroscopePage = () => {
    const store = useCreateHoroscopeStore();
    const { mutate: createHoroscope, loading } = useCreateHoroscope();
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!store.jsonInput?.trim() || !store.isValid) {
            store.setError("Введите валидный JSON");
            return;
        }

        try {
            const data = JSON.parse(store.jsonInput);
            const horoscopeData = {
                ...data,
                createdAt: new Date("2025-11-17T10:34:59.000Z"),
                startsAt: new Date("2025-11-17T10:34:59.000Z"),
                endsAt: new Date("2025-11-23T10:34:59.000Z"),
            };
            createHoroscope(horoscopeData, {
                onSuccess: (r) => toast.success("Гороскоп успешно загружен!"),
                onError: (err) =>
                    toast.error(
                        "Произошла ошибка при загрузке: " + err.message,
                    ),
            });
        } catch (err) {
            store.setError("Ошибка: " + err.message);
        }
    };

    return (
        <>
            <Helmet>
                <title>{`Загрузка гороскопа | ${PROJECT_NAME}`}</title>
                <meta
                    name="description"
                    content="Панель для создания и загрузки гороскопов"
                />
            </Helmet>

            <Main>
                <Container>
                    <header className={styles.header}>
                        <h1 className={styles.pageTitle}>Загрузить гороскоп</h1>
                        <p className={styles.pageSubtitle}>
                            Вставьте JSON с данными гороскопа для загрузки в
                            базу данных
                        </p>
                    </header>

                    <Content>
                        <div className={styles.formatInfo}>
                            <h3>📋 Формат данных</h3>
                            <ul>
                                <li>Данные должны быть в формате JSON</li>
                            </ul>
                        </div>
                        <TextInput
                            label="Заголовок гороскопа"
                            placeholder="Введите заголовок"
                            value={store.title ?? ""}
                            onChange={store.setTitle}
                        />
                        <label>Описание гороскопа</label>
                        <TextArea
                            value={store.description}
                            onChange={(e) => store.setDescription(e)}
                            placeholder="Введите описани"
                        />
                        <div
                            className={styles.actions}
                            style={{ marginBottom: "1rem" }}
                        >
                            <OutlinedButton
                                onClick={() =>
                                    copyFormatPrompt({
                                        title: store.title,
                                        description: store.description,
                                        endsAt: store.endDate,
                                        startsAt: store.startDate,
                                    })
                                }
                            >
                                Скопировать промпт форматирония
                            </OutlinedButton>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className={styles.jsonForm}
                        >
                            <div className={styles.formHeader}>
                                <label
                                    htmlFor="json-input"
                                    className={styles.formLabel}
                                >
                                    JSON данные гороскопа
                                </label>
                            </div>

                            <textarea
                                id="json-input"
                                className={`${styles.jsonInput} ${
                                    !store.isValid ? "error" : ""
                                }`}
                                value={store.jsonInput}
                                onChange={(e) =>
                                    store.setJsonInput(e.target.value)
                                }
                                rows={20}
                                disabled={loading}
                            />

                            {store.error && (
                                <div className={styles.errorMessage}>
                                    ⚠️ {store.error}
                                </div>
                            )}

                            {store.isValid && store.jsonInput?.trim() && (
                                <div className={styles.successMessage}>
                                    ✅ JSON валиден
                                </div>
                            )}

                            <div className={styles.submitSection}>
                                <FilledButton
                                    type="submit"
                                    active={
                                        store.jsonInput?.trim() &&
                                        store.isValid &&
                                        !loading
                                    }
                                >
                                    {loading
                                        ? "⏳ Загрузка..."
                                        : "🚀 Загрузить гроскоп"}
                                </FilledButton>

                                <CharCounter length={store.jsonInput.length} />
                            </div>
                        </form>
                    </Content>
                </Container>
            </Main>
            <Toaster />
        </>
    );
};

export default CreateHoroscopePage;
