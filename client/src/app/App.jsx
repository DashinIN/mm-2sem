import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const App = () => {
    return (
        <div>
            <Title level={1}>Объект управления</Title>
            <Paragraph>
                Приложение для работы с объектом управления Plant
            </Paragraph>
        </div>
    );
};
