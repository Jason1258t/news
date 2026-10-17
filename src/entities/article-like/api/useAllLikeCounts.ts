import { useQuery } from "@tanstack/react-query";
import { fetchAllLikeCounts } from "./likes-api";
import { likeKeys } from "./like-keys";

/** Лайки всех статей за всё время (для аналитики). */
export const useAllLikeCounts = () =>
    useQuery({
        queryKey: likeKeys.totals(),
        queryFn: fetchAllLikeCounts,
    });
