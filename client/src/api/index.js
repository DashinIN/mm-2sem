import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Fallback to localhost if env not set
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем обработчик ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Ошибка API:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;
