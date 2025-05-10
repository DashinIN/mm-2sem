import { Typography } from 'antd';
import { FixedSizeList as List } from 'react-window';

const { Title } = Typography;

const ErrorList = ({ errors }) => {
    if (errors.length === 0) return null;

    const Row = ({ index, style }) => (
        <div style={style}>
            <div
                style={{
                    padding: '8px',
                    background: '#fff3cd',
                    border: '1px solid #ffeeba',
                    borderRadius: '4px',
                    marginBottom: '8px',
                }}
            >
                {errors[index]}
            </div>
        </div>
    );

    return (
        <div style={{ marginTop: '16px' }}>
            <Title level={4}>Системные сообщения</Title>
            <List
                height={200} // Высота видимой области
                itemCount={errors.length} // Количество ошибок
                itemSize={50} // Высота строки
                width='100%' // Ширина списка
            >
                {Row}
            </List>
        </div>
    );
};

export default ErrorList;
