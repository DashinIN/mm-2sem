import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { Experiment } from '../pages/experiment';
import WatchExperiment from '../pages/watch-experiment/WatchExperiment';
import { AppLayout } from './Layout';
import 'antd/dist/reset.css';
import './index.css';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { index: true, element: <App /> },
            { path: 'experiment', element: <Experiment /> },
            { path: 'watch-experiment', element: <WatchExperiment /> }, // Новый маршрут
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </StrictMode>
);
