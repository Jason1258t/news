import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "app/firebase";
import {
    getCurrentHoroscopeQuery,
    getAllHoroscopesQuery,
    COLLECTION_NAME,
} from "./quries";
import {
    horoscopeFromFirestore,
    horoscopeToFirestore,
} from "entities/horoscope/mappers";

export const getCurrentHoroscope = async () => {
    try {
        const q = getCurrentHoroscopeQuery();

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const doc = querySnapshot.docs[0];
        return horoscopeFromFirestore(doc);
    } catch (error) {
        console.error("Error getting current horoscope:", error);
        throw error;
    }
};

/**
 * Получение гороскопа по ID
 * @param {string} id - ID гороскопа
 * @returns {Promise<import('./types').Horoscope|null>}
 */
export const getHoroscopeById = async (id) => {
    try {
        if (!id) {
            throw new Error("Horoscope ID is required");
        }

        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return horoscopeFromFirestore(docSnap);
    } catch (error) {
        console.error("Error getting horoscope by ID:", error);
        throw error;
    }
};

/**
 * Получение всех гороскопов
 * @returns {Promise<Array<import('./types').Horoscope>>}
 */
export const getAllHoroscopes = async () => {
    try {
        const q = getAllHoroscopesQuery();

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => horoscopeFromFirestore(doc));
    } catch (error) {
        console.error("Error getting all horoscopes:", error);
        throw error;
    }
};

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
        const horoscopeForFirestore = horoscopeToFirestore(horoscopeData);

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            horoscopeForFirestore
        );

        return docRef.id;
    } catch (error) {
        console.error("Error adding horoscope:", error);
        throw error;
    }
};
