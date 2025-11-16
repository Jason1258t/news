import { db } from './firebaseConfig';

const COLLECTION_NAME = 'horoscopes';

export const getCurrentHoroscopeQuery = () => {
    const now = Timestamp.now();

    return query(
        collection(db, COLLECTION_NAME),
        where('startsAt', '<=', now),
        where('endsAt', '>=', now),
        orderBy('startsAt', 'desc'),
        limit(1)
    );
}

export const getAllHoroscopesQuery = () => query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
);