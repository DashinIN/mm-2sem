import { useState } from 'react';
import {
    Table,
    Typography,
    Button,
    Select,
    InputNumber,
    Modal,
    Input,
    notification,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import {
    useExperiments,
    useExperimentFrames,
    useSaveExperiment,
} from '../../api/experiments';

const { Title } = Typography;
const { Option } = Select;

// Локализация для таблиц
const tableLocale = {
    triggerDesc: 'Сортировать по убыванию', // Подсказка для сортировки по убыванию
    triggerAsc: 'Сортировать по возрастанию', // Подсказка для сортировки по возрастанию
    cancelSort: 'Отменить сортировку', // Подсказка для отмены сортировки
};

const WatchExperiment = () => {
    const { data: experiments, isLoading: isLoadingExperiments } =
        useExperiments();
    const [selectedExperimentId, setSelectedExperimentId] = useState(null);

    // Вызываем useExperimentFrames только если selectedExperimentId не равен null
    const { data: frames } = useExperimentFrames(selectedExperimentId, {
        enabled: !!selectedExperimentId,
    });

    // Фильтрация
    const [filterField, setFilterField] = useState('k1'); // Поле для фильтрации
    const [minValue, setMinValue] = useState(null); // Минимальное значение
    const [maxValue, setMaxValue] = useState(null); // Максимальное значение
    const [filteredFrames, setFilteredFrames] = useState(null); // Отфильтрованные данные

    // Сохранение отфильтрованных данных
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [filterDescription, setFilterDescription] = useState('');

    // Добавляем состояния для сортировки
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const saveExperimentMutation = useSaveExperiment();

    const handleSaveFilteredData = async () => {
        if (!filteredFrames?.length) return;

        const parentExperiment = getSelectedExperiment();
        const sortInfo = sortField
            ? ` | Сортировка: ${sortField} ${sortOrder === 'ascend' ? '↑' : '↓'}`
            : '';

        // Очищаем frame_id перед сохранением
        const framesWithoutIds = filteredFrames.map(
            ({ frame_id, ...frame }) => frame
        );

        saveExperimentMutation.mutate(
            {
                operator_name: parentExperiment.operator,
                prim: `Фильтрация эксперимента №${selectedExperimentId} (${filterField}: ${minValue || '*'} - ${maxValue || '*'})${sortInfo}: ${filterDescription}`,
                frames: framesWithoutIds,
            },
            {
                onSuccess: () => {
                    setIsSaveModalOpen(false);
                    setFilterDescription('');
                },
            }
        );
    };

    // Применение фильтрации
    const applyFilter = () => {
        const filtered = frames?.filter((frame) => {
            const value = parseFloat(frame[filterField] || 0);
            return (
                (minValue === null || value >= minValue) &&
                (maxValue === null || value <= maxValue)
            );
        });
        setFilteredFrames(filtered || []);
    };

    // Сброс фильтрации
    const resetFilter = () => {
        setMinValue(null);
        setMaxValue(null);
        setFilteredFrames(frames || []); // Показываем все кадры
    };

    // Обработка выбора эксперимента
    const handleExperimentSelect = (experimentId) => {
        setSelectedExperimentId(experimentId);
        setFilteredFrames(null); // Сбрасываем фильтр, чтобы показать все кадры
    };

    // Обработка возврата к списку экспериментов
    const handleBackToList = () => {
        setSelectedExperimentId(null);
        setFilteredFrames(null);
        setMinValue(null);
        setMaxValue(null);
    };

    const experimentColumns = [
        {
            title: 'Номер эксперимента',
            dataIndex: 'experiment_id',
            key: 'experiment_id',
            width: 150,
            sorter: (a, b) => a.experiment_id - b.experiment_id,
        },
        {
            title: 'Автор',
            dataIndex: 'operator',
            key: 'operator',
            width: 150,
            sorter: (a, b) => a.operator.localeCompare(b.operator),
        },
        {
            title: 'Комментарий',
            dataIndex: 'prim',
            key: 'prim',
            width: 350,
            sorter: (a, b) => (a.prim || '').localeCompare(b.prim || ''),
        },
        {
            title: 'Дата и время',
            dataIndex: 'datetime',
            key: 'datetime',
            width: 200,
            render: (value) => new Date(value).toLocaleString(),
            sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
        },
        {
            title: 'Действие',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button
                    type='primary'
                    onClick={() => handleExperimentSelect(record.experiment_id)}
                >
                    Выбрать
                </Button>
            ),
        },
    ];

    const frameColumns = [
        {
            title: 'Кадр',
            dataIndex: 'framenum',
            key: 'framenum',
            width: 80,
            sorter: (a, b) => a.framenum - b.framenum,
        },
        {
            title: 'Канал 1',
            dataIndex: 'k1',
            key: 'k1',
            width: 100,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k1 || 0) - parseFloat(b.k1 || 0),
        },
        {
            title: 'Канал 2',
            dataIndex: 'k2',
            key: 'k2',
            width: 100,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k2 || 0) - parseFloat(b.k2 || 0),
        },
        {
            title: 'Канал 3',
            dataIndex: 'k3',
            key: 'k3',
            width: 100,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k3 || 0) - parseFloat(b.k3 || 0),
        },
        {
            title: 'Канал 47',
            dataIndex: 'k47',
            key: 'k47',
            width: 100,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k47 || 0) - parseFloat(b.k47 || 0),
        },
        {
            title: 'Канал 6',
            dataIndex: 'k6',
            key: 'k6',
            width: 100,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k6 || 0) - parseFloat(b.k6 || 0),
        },
        {
            title: 'Среднее K17',
            dataIndex: 'k17sr',
            key: 'k17sr',
            width: 120,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) =>
                parseFloat(a.k17sr || 0) - parseFloat(b.k17sr || 0),
        },
        {
            title: 'Дисперсия K17',
            dataIndex: 'k17disp',
            key: 'k17disp',
            width: 120,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) =>
                parseFloat(a.k17disp || 0) - parseFloat(b.k17disp || 0),
        },
        {
            title: 'Функция X57',
            dataIndex: 'k57',
            key: 'k57',
            width: 120,
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k57 || 0) - parseFloat(b.k57 || 0),
        },
        {
            title: 'Контроль K4',
            dataIndex: 'k4',
            key: 'k4',
            width: 100,
            render: (value) =>
                value === '1' ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
            sorter: (a, b) => a.k4 - b.k4,
        },
        {
            title: 'Контроль X93',
            dataIndex: 'k93',
            key: 'k93',
            width: 100,
            render: (value) =>
                value === '1' ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
            sorter: (a, b) => a.k93 - b.k93,
        },
    ];

    // Функция для подсчета общей ширины колонок
    const getTableWidth = (columns) => {
        return columns.reduce((total, col) => total + (col.width || 100), 0);
    };

    const getSelectedExperiment = () => {
        return experiments?.find(
            (exp) => exp.experiment_id === selectedExperimentId
        );
    };

    if (isLoadingExperiments) {
        return <p>Загрузка экспериментов...</p>;
    }

    return (
        <div>
            <Title level={2}>Просмотр экспериментов</Title>

            {!selectedExperimentId ? (
                // Показываем список экспериментов
                <Table
                    dataSource={
                        experiments?.filter(
                            (exp) =>
                                !exp.prim?.includes('Фильтрация эксперимента №')
                        ) || []
                    }
                    columns={experimentColumns}
                    rowKey='experiment_id'
                    pagination={false}
                    scroll={{ x: getTableWidth(experimentColumns), y: 600 }}
                    size='small'
                    locale={tableLocale}
                />
            ) : (
                // Показываем выбранный эксперимент и его кадры
                <div>
                    <div
                        style={{
                            marginBottom: '16px',
                            display: 'flex',
                            flexDirection:
                                window.innerWidth < 768 ? 'column' : 'row',
                            gap: window.innerWidth < 768 ? '8px' : '16px',
                            alignItems:
                                window.innerWidth < 768 ? 'stretch' : 'center',
                        }}
                    >
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBackToList}
                            style={{ marginRight: '16px' }}
                        >
                            Назад к списку
                        </Button>
                        <div>
                            <Title level={5}>
                                Эксперимент: {selectedExperimentId}
                            </Title>
                        </div>
                        <div>
                            <Title level={5}>
                                <strong>Автор:</strong>{' '}
                                {getSelectedExperiment()?.operator}
                            </Title>
                        </div>
                        <div>
                            <Title level={5}>
                                <strong>Описание:</strong>{' '}
                                {getSelectedExperiment()?.prim ||
                                    'Нет описания'}
                            </Title>
                        </div>
                        <div>
                            <Title level={5}>
                                <strong>Дата и время:</strong>{' '}
                                {new Date(
                                    getSelectedExperiment()?.datetime
                                ).toLocaleString()}
                            </Title>
                        </div>
                        <div>
                            <Title level={5}>
                                <strong>Количество записей:</strong>{' '}
                                {frames?.length || 0}
                            </Title>
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: '16px',
                            display: 'flex',
                            flexDirection:
                                window.innerWidth < 768 ? 'column' : 'row',
                            flexWrap:
                                window.innerWidth < 768 ? 'nowrap' : 'wrap',
                            gap: '8px',
                        }}
                    >
                        {/* Filter inputs group */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:
                                    window.innerWidth < 768 ? 'column' : 'row',
                                gap: '8px',
                                flex:
                                    window.innerWidth < 768 ? '1' : '0 1 auto',
                            }}
                        >
                            <Select
                                value={filterField}
                                onChange={(value) => setFilterField(value)}
                                style={{
                                    width:
                                        window.innerWidth < 768 ? '100%' : 200,
                                    minWidth:
                                        window.innerWidth < 768 ? '100%' : 200,
                                }}
                            >
                                <Option value='k1'>Канал 1</Option>
                                <Option value='k2'>Канал 2</Option>
                                <Option value='k3'>Канал 3</Option>
                                <Option value='k47'>Канал 47</Option>
                                <Option value='k6'>Канал 6</Option>
                                <Option value='k17sr'>Среднее K17</Option>
                                <Option value='k17disp'>Дисперсия K17</Option>
                                <Option value='k57'>Функция X57</Option>
                            </Select>

                            <InputNumber
                                placeholder='Мин. значение'
                                value={minValue}
                                onChange={(value) => setMinValue(value)}
                                style={{
                                    width:
                                        window.innerWidth < 768 ? '100%' : 150,
                                    minWidth:
                                        window.innerWidth < 768 ? '100%' : 150,
                                }}
                            />

                            <InputNumber
                                placeholder='Макс. значение'
                                value={maxValue}
                                onChange={(value) => setMaxValue(value)}
                                style={{
                                    width:
                                        window.innerWidth < 768 ? '100%' : 150,
                                    minWidth:
                                        window.innerWidth < 768 ? '100%' : 150,
                                }}
                            />
                        </div>

                        {/* Buttons group */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection:
                                    window.innerWidth < 768 ? 'column' : 'row',
                                gap: '8px',
                                flex:
                                    window.innerWidth < 768 ? '1' : '0 1 auto',
                            }}
                        >
                            <Button
                                type='primary'
                                onClick={applyFilter}
                                style={{
                                    width:
                                        window.innerWidth < 768
                                            ? '100%'
                                            : 'auto',
                                }}
                            >
                                Установить фильтр
                            </Button>

                            <Button
                                onClick={resetFilter}
                                style={{
                                    width:
                                        window.innerWidth < 768
                                            ? '100%'
                                            : 'auto',
                                }}
                            >
                                Сбросить фильтр
                            </Button>

                            {filteredFrames?.length > 0 && (
                                <Button
                                    type='primary'
                                    onClick={() => setIsSaveModalOpen(true)}
                                    style={{
                                        width:
                                            window.innerWidth < 768
                                                ? '100%'
                                                : 'auto',
                                    }}
                                >
                                    Сохранить отфильтрованные данные
                                </Button>
                            )}
                        </div>
                    </div>

                    <Table
                        virtual
                        dataSource={filteredFrames || frames || []}
                        columns={frameColumns}
                        rowKey='frame_id'
                        pagination={false}
                        scroll={{ x: getTableWidth(frameColumns), y: 550 }}
                        size='small'
                        locale={tableLocale}
                        onChange={(pagination, filters, sorter) => {
                            if (sorter.field && sorter.order) {
                                setSortField(sorter.field);
                                setSortOrder(sorter.order);

                                // Сортируем данные
                                const sortedData = [
                                    ...(filteredFrames || frames || []),
                                ].sort((a, b) => {
                                    const aVal = parseFloat(
                                        a[sorter.field] || 0
                                    );
                                    const bVal = parseFloat(
                                        b[sorter.field] || 0
                                    );
                                    return sorter.order === 'ascend'
                                        ? aVal - bVal
                                        : bVal - aVal;
                                });

                                setFilteredFrames(sortedData);
                            }
                        }}
                    />

                    <Modal
                        title='Сохранение отфильтрованных данных'
                        open={isSaveModalOpen}
                        onOk={handleSaveFilteredData}
                        onCancel={() => {
                            setIsSaveModalOpen(false);
                            setFilterDescription('');
                        }}
                    >
                        <Input
                            placeholder='Введите описание для отфильтрованных данных'
                            value={filterDescription}
                            onChange={(e) =>
                                setFilterDescription(e.target.value)
                            }
                        />
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default WatchExperiment;
