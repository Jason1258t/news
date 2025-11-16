import {
    collection,
    addDoc,
    getDocs,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { HoroscopeMapper } from './horoscopeMapper';
import { getCurrentHoroscopeQuery } from './quries';

const COLLECTION_NAME = 'horoscopes';

export const getCurrentHoroscope = async () => {
    try {
        const q = getCurrentHoroscopeQuery();

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return HoroscopeMapper.fromFirestore(doc);
    } catch (error) {
        console.error('Error getting current horoscope:', error);
        throw error;
    }
}

/**
 * Получение всех гороскопов
 * @returns {Promise<Array<import('./types').Horoscope>>}
 */
export const getAllHoroscopes = async () => {
    try {
        const q = getAllHoroscopesQuery();

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc =>
            HoroscopeMapper.fromFirestore(doc)
        );
    } catch (error) {
        console.error('Error getting all horoscopes:', error);
        throw error;
    }
}

/**
 * Добавление нового гороскопа
 * @param {Object} horoscopeData - Данные гороскопа
 * @param {string} horoscopeData.imageUrl
 * @param {string} horoscopeData.title
 * @param {string} horoscopeData.description
 * @param {Array} horoscopeData.predictions
 * @param {Date} horoscopeData.startsAt
 * @param {Date} horoscopeData.endsAt
 * @returns {Promise<string>} ID созданного документа
 */
export const createHoroscope = async (horoscopeData) => {
    try {
        const horoscopeForFirestore = HoroscopeMapper.toFirestore(horoscopeData);

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            horoscopeForFirestore
        );

        return docRef.id;
    } catch (error) {
        console.error('Error adding horoscope:', error);
        throw error;
    }
}
