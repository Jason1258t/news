import { signInAnonymously } from "firebase/auth";
import { auth } from "shared/api";

/**
 * uid текущего читателя. Если никто не вошёл, анонимно входит в Firebase: uid хранится
 * в браузере и переживает перезагрузки, как кука сессии. Вызывать только по действию
 * читателя, чтобы не заводить анонимный аккаунт на каждое посещение.
 */
export const ensureVisitorId = async () =>
    auth.currentUser?.uid ?? (await signInAnonymously(auth)).user.uid;
