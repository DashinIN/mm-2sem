import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import apiClient from './index';

// Хук для получения всех экспериментов
export const useExperiments = () => {
    return useQuery({
        queryKey: ['experiments'],
        queryFn: async () => {
            const response = await apiClient.get('/experiments');
            return response.data;
        },
    });
};

// Хук для получения кадров эксперимента
export const useExperimentFrames = (experimentId) => {
    return useQuery({
        queryKey: ['frames', experimentId],
        queryFn: async () => {
            const response = await apiClient.get(`/frames/${experimentId}`);
            return response.data;
        },
    });
};

// Хук для сохранения эксперимента
export const useSaveExperiment = () => {
    return useMutation({
        mutationFn: async (experiment) => {
            const response = await apiClient.post('/experiments', experiment);
            console.log('Ответ сервера:', response.data);
            return response.data;
        },
        onError: (error) => {
            console.error('Ошибка при сохранении эксперимента:', error);
            notification.error({
                message: 'Ошибка сохранения',
                description:
                    'Не удалось сохранить эксперимент. Проверьте сервер.',
            });
        },
        onSuccess: (data) => {
            console.log('Эксперимент успешно сохранен:', data);
            notification.success({
                message: 'Сохранение успешно',
                description: 'Эксперимент был успешно сохранен!',
            });
        },
    });
};
