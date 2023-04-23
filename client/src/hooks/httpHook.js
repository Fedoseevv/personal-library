import {useState, useCallback} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false); // Для определения идет загрузка или нет
    const [error, setError] = useState(null); // Для определения ошибок

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true); // Загрузка пошла
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json';
            }
            const response = await fetch(url, { method, body, headers });
            const data = await response.json(); // Распарсили ответ
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            setLoading(false); // Загрузка прошла
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e; // Чтобы дальше обработать её в компонентах
        }
    }, []);

    const clearError = () => setError(null);

    return { loading, setLoading, request, clearError }
}