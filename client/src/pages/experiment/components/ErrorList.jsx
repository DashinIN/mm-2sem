import { Alert, Typography } from 'antd';

const { Title } = Typography;

const ErrorList = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
        <div style={{ marginTop: '16px' }}>
            <Title level={4}>Системные сообщения</Title>
            {errors.map((error, index) => (
                <Alert key={index} message={error} type='warning' showIcon />
            ))}
        </div>
    );
};

export default ErrorList;
