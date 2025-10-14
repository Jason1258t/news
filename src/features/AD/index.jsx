// components/YandexAd.js
import { useEffect, useRef } from "react";
import HomeWidget from "widgets/HomeWidget";

const YandexAd = ({ blockId = "R-A-17485298-1" }) => {
    const adRef = useRef(null);

    useEffect(() => {
        // Проверяем, что контекст Яндекс загружен
        if (!window.yaContextCb) {
            window.yaContextCb = [];
        }

        // Добавляем рендер рекламы в очередь
        window.yaContextCb.push(() => {
            if (
                window.Ya &&
                window.Ya.Context &&
                window.Ya.Context.AdvManager
            ) {
                window.Ya.Context.AdvManager.render({
                    blockId: blockId,
                    renderTo: `yandex_rtb_${blockId}`,
                });
            }
        });

        // // Очистка при размонтировании
        // return () => {
        //     if (window.yaContextCb) {
        //         window.yaContextCb = window.yaContextCb.filter(
        //             (cb) =>
        //                 cb.toString() !==
        //                 window.yaContextCb[
        //                     window.yaContextCb.length - 1
        //                 ]?.toString()
        //         );
        //     }
        // };
    }, [blockId]);

    return (
        <HomeWidget>
            <div
                ref={adRef}
                id={`yandex_rtb_${blockId}`}
                style={{
                    minHeight: "250px",
                }}
            />
        </HomeWidget>
    );
};

export default YandexAd;
