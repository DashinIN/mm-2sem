import { useState } from 'react';
import { Typography, Modal, notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { executeMapMeasurements } from '../utils/executeExperiment';
import * as XLSX from 'xlsx';
import { useSaveExperiment } from '../../api/experiments';
import ControlButtons from './components/ControlButtons';
import ExperimentTable from './components/ExperimentTable';
import ErrorList from './components/ErrorList';

const { Title } = Typography;

export const Experiment = () => {
    const [operatorName, setOperatorName] = useState('');
    const [experimentDescription, setExperimentDescription] = useState('');
    const [experimentData, setExperimentData] = useState(null);
    const [frameCount, setFrameCount] = useState(10);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const saveExperimentMutation = useSaveExperiment();

    const handleMapExecution = async () => {
        try {
            const Module = await window.Module();
            // Configure WASM file location
            Module.locateFile = (path) => {
                if (path.endsWith('.wasm')) {
                    return '/plant.wasm';
                }
                return path;
            };

            const result = await executeMapMeasurements(Module, frameCount);
            setExperimentData(result);
            notification.success({
                message: 'Измерения выполнены',
                description: 'Данные успешно получены.',
            });
        } catch (err) {
            console.error('Ошибка выполнения карты измерений:', err);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось выполнить измерения.',
            });
        }
    };

    const handleClearData = () => {
        setExperimentData(null);
        notification.info({
            message: 'Данные очищены',
            description: 'Все данные эксперимента были удалены.',
        });
    };

    const handleSaveExperiment = () => {
        if (!operatorName) {
            notification.error({
                message: 'Ошибка',
                description: 'Введите имя пользователя.',
            });
            return;
        }

        if (
            !experimentData ||
            !experimentData.frames ||
            experimentData.frames.length === 0
        ) {
            notification.error({
                message: 'Ошибка',
                description: 'Нет данных для сохранения.',
            });
            return;
        }

        setIsSaveModalOpen(true);
    };

    const handleSaveConfirm = () => {
        saveExperimentMutation.mutate({
            operator_name: operatorName,
            prim: experimentDescription || '',
            frames: experimentData.frames.map((frame) => ({
                framenum: frame.frameIndex,
                k1: frame.measurements['1']?.[0]?.value ?? null,
                k2: frame.measurements['2']?.[0]?.value ?? null,
                k3: frame.measurements['3']?.[0]?.value ?? null,
                k4: frame.calculations.inBounds4 ? 1 : 0,
                k6: frame.calculations.normX6 ?? null,
                k17sr: frame.calculations.avg ?? null,
                k17disp: frame.calculations.variance ?? null,
                k47: frame.measurements['47']?.[0]?.value ?? null,
                k93: frame.calculations.inBounds93 ? 1 : 0,
                k57: frame.calculations.funcX57 ?? null,
            })),
        });

        setIsSaveModalOpen(false);
    };

    const handleSaveCancel = () => {
        setIsSaveModalOpen(false);
        notification.info({
            message: 'Сохранение отменено',
            description: 'Вы отменили сохранение эксперимента.',
        });
    };

    const handleExportClick = () => {
        if (!experimentData) {
            notification.error({
                message: 'Ошибка',
                description: 'Нет данных для экспорта.',
            });
            return;
        }
        setIsExportModalOpen(true);
    };

    const handleExportConfirm = () => {
        if (!experimentData) return;

        const wb = XLSX.utils.book_new();

        const excelData = experimentData.frames.map((frame) => {
            const row = {
                Кадр: frame.frameIndex,
                'Среднее (Канал 17)': frame.calculations.avg.toFixed(2),
                'Дисперсия (Канал 17)': frame.calculations.variance.toFixed(2),
                'Функция X57': frame.calculations.funcX57.toFixed(2),
                'Контроль X6': frame.calculations.normX6 ? '✔' : '✘',
                'Контроль X93': frame.calculations.inBounds93 ? '✔' : '✘',
            };

            Object.keys(frame.measurements).forEach((channel) => {
                row[`Канал ${channel}`] = frame.measurements[channel]
                    .map((m) => m.value.toFixed(2))
                    .join(', ');
            });

            return row;
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(wb, ws, 'Результаты');

        const date = new Date().toISOString().split('T')[0];
        const fileName = `experiment_results_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
        setIsExportModalOpen(false);
        notification.success({
            message: 'Экспорт выполнен',
            description: 'Данные успешно экспортированы в Excel.',
        });
    };

    const handleExportCancel = () => {
        setIsExportModalOpen(false);
        notification.info({
            message: 'Экспорт отменен',
            description: 'Вы отменили экспорт данных.',
        });
    };

    const errors = experimentData?.errors || [];
    const prioritizedChannels = ['1', '2', '3', '47'];
    const columns = [
        {
            title: 'Кадр',
            dataIndex: 'frameIndex',
            key: 'frameIndex',
        },
        ...prioritizedChannels.map((channel) => ({
            title: `Канал ${channel}`,
            dataIndex: `channel_${channel}`,
            key: `channel_${channel}`,
            render: (values) =>
                values ? values.map((v) => v.toFixed(2)).join(', ') : '',
        })),
        {
            title: 'Канал 6',
            dataIndex: 'normX6',
            key: 'normX6',
            render: (value) => value.toFixed(2),
        },
        {
            title: 'Среднее К17',
            dataIndex: 'avg',
            key: 'avg',
            render: (value) => value.toFixed(2),
        },
        {
            title: 'Дисперсия К17',
            dataIndex: 'variance',
            key: 'variance',
            render: (value) => value.toFixed(2),
        },
        {
            title: 'Функция X57',
            dataIndex: 'funcX57',
            key: 'funcX57',
            render: (value) => value.toFixed(2),
        },
        {
            title: 'Контроль K4',
            dataIndex: 'inBounds4',
            key: 'inBounds4',
            render: (value) =>
                value ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
        {
            title: 'Контроль X93',
            dataIndex: 'inBounds93',
            key: 'inBounds93',
            render: (value) =>
                value ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
        },
    ];
    const tableData = experimentData
        ? experimentData.frames.map((frame) => {
              const row = {
                  key: frame.frameIndex,
                  frameIndex: frame.frameIndex,
                  avg: frame.calculations.avg,
                  variance: frame.calculations.variance,
                  funcX57: frame.calculations.funcX57,
                  normX6: frame.calculations.normX6,
                  inBounds4: frame.calculations.inBounds4,
                  inBounds93: frame.calculations.inBounds93,
              };

              prioritizedChannels.forEach((channel) => {
                  row[`channel_${channel}`] = frame.measurements[channel]
                      ? frame.measurements[channel].map((m) => m.value)
                      : [];
              });

              return row;
          })
        : [];

    return (
        <div>
            <Title level={2}>Эксперимент</Title>
            <ControlButtons
                operatorName={operatorName}
                setOperatorName={setOperatorName}
                experimentDescription={experimentDescription}
                setExperimentDescription={setExperimentDescription}
                frameCount={frameCount}
                setFrameCount={setFrameCount}
                handleMapExecution={handleMapExecution}
                handleClearData={handleClearData}
                handleSaveExperiment={handleSaveExperiment}
                handleExportClick={handleExportClick}
                isLoading={saveExperimentMutation.isLoading}
                hasExperimentData={!!experimentData}
            />
            <ExperimentTable columns={columns} tableData={tableData} />
            <ErrorList errors={errors} />
            <Modal
                title='Подтверждение сохранения'
                open={isSaveModalOpen}
                onOk={handleSaveConfirm}
                onCancel={handleSaveCancel}
                okText='Сохранить'
                cancelText='Отмена'
            >
                <p>Вы уверены, что хотите сохранить эксперимент?</p>
            </Modal>
            <Modal
                title='Экспорт результатов'
                open={isExportModalOpen}
                onOk={handleExportConfirm}
                onCancel={handleExportCancel}
                okText='Экспортировать'
                cancelText='Отмена'
            >
                <p>Экспортировать результаты измерений в Excel?</p>
            </Modal>
        </div>
    );
};
