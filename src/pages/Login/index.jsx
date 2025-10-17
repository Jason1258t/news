import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "features/auth/api/auth-api";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await authApi.loginWithEmail(email, password);
        
        if (error) {
            setError("Неверный email или пароль");
            setLoading(false);
        } else {
            navigate("/admin/create-article");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вход в админ-панель</h1>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? "Загрузка..." : "Войти"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;