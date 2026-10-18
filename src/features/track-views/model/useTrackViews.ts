import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SessionContext } from "entities/session";
import { getInternalSource, getLandingSource } from "./source";
import { isTrackingEnabled, trackArticleView, trackVisit } from "./track";

/**
 * Ждёт, пока станет известно, вошёл ли пользователь: посещения админа не считаются.
 * Без SessionProvider (тесты отдельных страниц) ничего не записывает.
 */
const useShouldTrack = () => {
    const session = useContext(SessionContext);
    return isTrackingEnabled() && session !== null && !session.loading && !session.user;
};

const landingSource = () => getLandingSource(window.location.href, document.referrer);

/** Считает сеанс на публичных страницах вместе с источником входа на сайт. */
export const useTrackVisit = () => {
    const shouldTrack = useShouldTrack();
    useEffect(() => {
        if (shouldTrack) trackVisit(landingSource());
    }, [shouldTrack]);
};

/**
 * Считает просмотр статьи; `slug` — только после того, как статья загрузилась. Если статья —
 * первая страница вкладки (ключ "default"), источник — откуда пришли на сайт, иначе — ссылка
 * внутри сайта, по которой перешли.
 */
export const useTrackArticleView = (slug: string | undefined) => {
    const shouldTrack = useShouldTrack();
    const { key, state } = useLocation();
    const source = key === "default" ? landingSource() : getInternalSource(state);

    useEffect(() => {
        if (shouldTrack && slug) trackArticleView(slug, source);
    }, [shouldTrack, slug, source]);
};
