import { useQuery } from "@tanstack/react-query";
import { getLastDays } from "shared/lib/date";
import { summarizeStats } from "../model/summarize";
import { fetchDailyStats } from "./stats-api";
import { statsKeys } from "./stats-keys";

/** Сводка за последние `days` дней, включая сегодняшний. */
export const useSiteStats = (days: number) => {
    const period = getLastDays(days);
    const [from = "", to = from] = [period[0], period.at(-1)];

    return useQuery({
        queryKey: statsKeys.range(from, to),
        queryFn: () => fetchDailyStats(from, to),
        select: (stats) => summarizeStats(period, stats),
    });
};
