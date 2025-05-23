import React from 'react';
import { Table, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useExperiments, useExperimentFrames } from '../../api/experiments';

const { Title } = Typography;

const FilteredExperiments = () => {
    // Получаем только отфильтрованные эксперименты (проверяем по описанию)
    const { data: experiments, isLoading } = useExperiments();

    const columns = [
        {
            title: 'Номер эксперимента',
            dataIndex: 'experiment_id',
            key: 'experiment_id',
            width: 150,
            sorter: (a, b) => a.experiment_id - b.experiment_id,
        },
        {
            title: 'Исходный эксперимент',
            dataIndex: 'prim',
            key: 'source_experiment',
            width: 150,
            render: (prim) => {
                const match = prim?.match(/№(\d+)/);
                return match ? match[1] : '—';
            },
            sorter: (a, b) => {
                const getNum = (str) => {
                    const match = str?.match(/№(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                };
                return getNum(a.prim) - getNum(b.prim);
            },
        },
        {
            title: 'Параметры фильтрации',
            dataIndex: 'prim',
            key: 'filter_params',
            width: 300,
            render: (prim) => {
                const filterMatch = prim?.match(/\((.*?)\)/);
                const sortMatch = prim?.match(/\| Сортировка: (.*?):/);
                const filterParams = filterMatch ? filterMatch[1] : '';
                const sortInfo = sortMatch ? ` | ${sortMatch[1]}` : '';
                return filterParams + sortInfo || '—';
            },
        },
        {
            title: 'Автор',
            dataIndex: 'operator',
            key: 'operator',
            width: 150,
            sorter: (a, b) => a.operator.localeCompare(b.operator),
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
            title: 'Описание',
            dataIndex: 'prim',
            key: 'description',
            width: 300,
            render: (prim) => {
                const parts = prim?.split(':');
                return parts ? parts[parts.length - 1].trim() : '—';
            },
        },
    ];

    const getTableWidth = (columns) => {
        return columns.reduce((total, col) => total + (col.width || 100), 0);
    };

    if (isLoading) {
        return <p>Загрузка отфильтрованных экспериментов...</p>;
    }

    return (
        <div>
            <Title level={2}>
                Эксперименты для научно-технических расчетов
            </Title>
            <Table
                dataSource={
                    experiments?.filter((exp) =>
                        exp.prim?.includes('Фильтрация эксперимента №')
                    ) || []
                }
                columns={columns}
                rowKey='experiment_id'
                pagination={false}
                scroll={{ x: getTableWidth(columns), y: 600 }}
                size='small'
            />
        </div>
    );
};

export default FilteredExperiments;
