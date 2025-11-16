import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCurrentHoroscope,
    getAllHoroscopes,
    createHoroscope,
    getHoroscopeById,
} from "../api/horoscope-api";

export const horoscopeKeys = {
    all: ["horoscopes"],
    current: () => [...horoscopeKeys.all, "current"],
    byId: (id) => [...horoscopeKeys.all, "detail", id],
};

export const useCurrentHoroscope = () => {
    return useQuery({
        queryKey: horoscopeKeys.current(),
        queryFn: getCurrentHoroscope,
    });
};

/**
 * Хук для получения гороскопа по ID
 * @param {string} id - ID гороскопа
 * @returns {QueryResult}
 */
export const useHoroscopeById = (id) => {
    return useQuery({
        queryKey: horoscopeKeys.byId(id),
        queryFn: () => getHoroscopeById(id),
        enabled: !!id
    });
};

export const useAllHoroscopes = () => {
    return useQuery({
        queryKey: horoscopeKeys.all(),
        queryFn: getAllHoroscopes,
    });
};

export const useCreateHoroscope = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createHoroscope,
        onSuccess: () => {
            queryClient.invalidateQueries(
                { queryKey: horoscopeKeys.all },
                { queryKey: horoscopeKeys.current }
            );
        },
    });
};
