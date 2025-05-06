import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from './index';

// Хук для получения всех пользователей
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await apiClient.get('/users');
            return response.data;
        },
    });
};

// Хук для добавления нового пользователя
export const useAddUser = () => {
    return useMutation({
        queryKey: ['users'],
        mutationFn: async (operator_name) => {
            const response = await apiClient.post('/users', { operator_name });
            return response.data;
        },
    });
};
