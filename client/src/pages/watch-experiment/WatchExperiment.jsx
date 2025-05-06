import { useState } from 'react';
import { Table, Typography, Button, Select, InputNumber } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useExperiments, useExperimentFrames } from '../../api/experiments';

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

    const experimentColumns = [
        {
            title: 'Номер эксперимента',
            dataIndex: 'experiment_id',
            key: 'experiment_id',
            sorter: (a, b) => a.experiment_id - b.experiment_id,
        },
        {
            title: 'Автор',
            dataIndex: 'operator',
            key: 'operator',
            sorter: (a, b) => a.operator.localeCompare(b.operator),
        },
        {
            title: 'Комментарий',
            dataIndex: 'prim',
            key: 'prim',
            sorter: (a, b) => (a.prim || '').localeCompare(b.prim || ''),
        },
        {
            title: 'Дата и время',
            dataIndex: 'datetime',
            key: 'datetime',
            render: (value) => new Date(value).toLocaleString(),
            sorter: (a, b) => new Date(a.datetime) - new Date(b.datetime),
        },
        {
            title: 'Действие',
            key: 'action',
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
            sorter: (a, b) => a.framenum - b.framenum,
        },
        {
            title: 'Канал 1',
            dataIndex: 'k1',
            key: 'k1',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k1 || 0) - parseFloat(b.k1 || 0),
        },
        {
            title: 'Канал 2',
            dataIndex: 'k2',
            key: 'k2',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k2 || 0) - parseFloat(b.k2 || 0),
        },
        {
            title: 'Канал 3',
            dataIndex: 'k3',
            key: 'k3',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k3 || 0) - parseFloat(b.k3 || 0),
        },
        {
            title: 'Канал 47',
            dataIndex: 'k47',
            key: 'k47',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k47 || 0) - parseFloat(b.k47 || 0),
        },
        {
            title: 'Канал 6',
            dataIndex: 'k6',
            key: 'k6',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k6 || 0) - parseFloat(b.k6 || 0),
        },
        {
            title: 'Среднее K17',
            dataIndex: 'k17sr',
            key: 'k17sr',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) =>
                parseFloat(a.k17sr || 0) - parseFloat(b.k17sr || 0),
        },
        {
            title: 'Дисперсия K17',
            dataIndex: 'k17disp',
            key: 'k17disp',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) =>
                parseFloat(a.k17disp || 0) - parseFloat(b.k17disp || 0),
        },
        {
            title: 'Функция X57',
            dataIndex: 'k57',
            key: 'k57',
            render: (value) => (value ? parseFloat(value).toFixed(2) : '—'),
            sorter: (a, b) => parseFloat(a.k57 || 0) - parseFloat(b.k57 || 0),
        },
        {
            title: 'Контроль K4',
            dataIndex: 'k4',
            key: 'k4',
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
            render: (value) =>
                value === '1' ? (
                    <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                    <CloseCircleOutlined style={{ color: 'red' }} />
                ),
            sorter: (a, b) => a.k93 - b.k93,
        },
    ];

    if (isLoadingExperiments) {
        return <p>Загрузка экспериментов...</p>;
    }

    return (
        <div>
            <Title level={2}>Просмотр экспериментов</Title>
            <Table
                dataSource={experiments || []}
                columns={experimentColumns}
                rowKey='experiment_id'
                pagination={false}
                scroll={{ y: 200 }}
                size='small'
                locale={tableLocale}
            />
            {selectedExperimentId && (
                <div>
                    <Title level={3}>Эксперимент: {selectedExperimentId}</Title>
                    <div
                        style={{
                            marginBottom: '16px',
                            display: 'flex',
                            gap: '16px',
                            alignItems: 'center',
                        }}
                    >
                        <Select
                            value={filterField}
                            onChange={(value) => setFilterField(value)}
                            style={{ width: 200 }}
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
                            style={{ width: 150 }} // Увеличиваем ширину
                        />
                        <InputNumber
                            placeholder='Макс. значение'
                            value={maxValue}
                            onChange={(value) => setMaxValue(value)}
                            style={{ width: 150 }} // Увеличиваем ширину
                        />
                        <Button type='primary' onClick={applyFilter}>
                            Установить фильтр
                        </Button>
                        <Button onClick={resetFilter}>Сбросить фильтр</Button>
                    </div>
                    <Table
                        dataSource={filteredFrames || frames || []}
                        columns={frameColumns}
                        rowKey='frame_id'
                        pagination={false}
                        scroll={{ x: 'max-content', y: 400 }}
                        size='small'
                        locale={tableLocale}
                    />
                </div>
            )}
        </div>
    );
};

export default WatchExperiment;
