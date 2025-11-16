import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentHoroscope, getAllHoroscopes, createHoroscope } from '../api/horoscope-api';

export const horoscopeKeys = {
    all: ['horoscopes'],
    current: () => [...horoscopeKeys.all, 'current'],
};

export const useCurrentHoroscope = () => {
    return useQuery({
        queryKey: horoscopeKeys.current(),
        queryFn: getCurrentHoroscope,
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