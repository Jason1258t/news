import { Timestamp } from 'firebase/firestore';


export const horoscopeFromFirestore = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        imageUrl: data.imageUrl || '',
        title: data.title || '',
        description: data.description || '',
        predictions: data.predictions || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        startsAt: data.startsAt?.toDate() || new Date(),
        endsAt: data.endsAt?.toDate() || new Date(),
    };
}

export const horoscopeToFirestore = (horoscope) => {
    return {
        imageUrl: horoscope.imageUrl,
        title: horoscope.title,
        description: horoscope.description,
        predictions: horoscope.predictions,
        createdAt: horoscope.createdAt ? Timestamp.fromDate(horoscope.createdAt) : Timestamp.now(),
        startsAt: horoscope.startsAt ? Timestamp.fromDate(horoscope.startsAt) : Timestamp.now(),
        endsAt: horoscope.endsAt ? Timestamp.fromDate(horoscope.endsAt) : Timestamp.now(),
    };
}