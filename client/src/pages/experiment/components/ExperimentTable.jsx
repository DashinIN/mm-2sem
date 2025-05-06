import { Table } from 'antd';

const ExperimentTable = ({ columns, tableData }) => {
    return (
        <Table
            style={{ marginTop: '16px' }}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ y: 500 }}
        />
    );
};

export default ExperimentTable;
