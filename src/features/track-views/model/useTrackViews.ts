import { useContext, useEffect } from "react";
import { SessionContext } from "entities/session";
import { isTrackingEnabled, trackArticleView, trackVisit } from "./track";

/**
 * Ждёт, пока станет известно, вошёл ли пользователь: посещения админа не считаются.
 * Без SessionProvider (тесты отдельных страниц) ничего не записывает.
 */
const useShouldTrack = () => {
    const session = useContext(SessionContext);
    return isTrackingEnabled() && session !== null && !session.loading && !session.user;
};

/** Считает сеанс на публичных страницах. */
export const useTrackVisit = () => {
    const shouldTrack = useShouldTrack();
    useEffect(() => {
        if (shouldTrack) trackVisit();
    }, [shouldTrack]);
};

/** Считает просмотр статьи; `slug` — только после того, как статья загрузилась. */
export const useTrackArticleView = (slug: string | undefined) => {
    const shouldTrack = useShouldTrack();
    useEffect(() => {
        if (shouldTrack && slug) trackArticleView(slug);
    }, [shouldTrack, slug]);
};
