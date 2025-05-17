import React, { useEffect, useState } from 'react';
import { Table } from 'antd';

const ExperimentTable = ({ columns, tableData }) => {
    const [averages, setAverages] = useState({});

    // Calculate averages for numeric columns
    useEffect(() => {
        // Если данных нет - очищаем средние значения
        if (!tableData || tableData.length === 0) {
            setAverages({});
            return;
        }

        try {
            const newAverages = {};
            columns.forEach((col, index) => {
                // Skip first and last two columns
                if (index > 0 && index < columns.length - 2) {
                    const values = tableData
                        .map((row) => {
                            if (!row || !row[col.dataIndex]) return null;
                            const value = parseFloat(row[col.dataIndex]);
                            return isNaN(value) ? null : value;
                        })
                        .filter((val) => val !== null);

                    if (values && values.length > 0) {
                        const sum = values.reduce((a, b) => a + b, 0);
                        const average = sum / values.length;
                        if (!isNaN(average)) {
                            newAverages[col.dataIndex] = average.toFixed(2);
                        }
                    }
                }
            });
            setAverages(newAverages);
        } catch (error) {
            console.error('Error calculating averages:', error);
            setAverages({});
        }
    }, [tableData, columns]);

    return (
        <Table
            virtual
            style={{ marginTop: '16px' }}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: true, y: 500 }}
            summary={() => (
                <Table.Summary fixed='bottom'>
                    <Table.Summary.Row>
                        {columns.map((col, index) => (
                            <Table.Summary.Cell key={col.key} index={index}>
                                {index === 0
                                    ? 'Среднее'
                                    : index < columns.length - 2
                                      ? (averages[col.dataIndex] ?? '')
                                      : ''}
                            </Table.Summary.Cell>
                        ))}
                    </Table.Summary.Row>
                </Table.Summary>
            )}
            sticky={{ offsetScroll: 0 }}
        />
    );
};

export default ExperimentTable;
