import React from "react";
import { useAIAnswer } from "./test-api";
import { LoadingSpinner } from "shared/ui/status/loading";
import ErrorWidget from "shared/ui/status/error";
import { RenderHTML } from "shared/lib/html";

const TestAIWidget = () => {
    const { data, loading, error } = useAIAnswer(
        "Сделай крутое приветствие для сайта с новостями, пиши сразу в html формате виджет небольшой <important> не пиши никакой тескт, только то что может быть отрендерено </important>"
    );

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorWidget message={error?.message} />;
    return <RenderHTML html={data} />;
};

export default TestAIWidget;
