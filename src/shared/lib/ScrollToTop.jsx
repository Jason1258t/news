import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const categoryChanges = searchParams.get("category");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname, categoryChanges]);

    return null;
};

export default ScrollToTop;
