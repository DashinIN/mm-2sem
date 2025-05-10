import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const menuItems = [
    {
        key: '/',
        label: <Link to='/'>Главная</Link>,
    },
    {
        key: '/experiment',
        label: <Link to='/experiment'>Регистрация данных</Link>,
    },
    {
        key: '/watch-experiment', // Новый пункт меню
        label: <Link to='/watch-experiment'>Просмотр экспериментов</Link>,
    },
    {
        key: '/filtered-experiments',
        label: (
            <Link to='/filtered-experiments'>Отфильтрованные эксперименты</Link>
        ),
    },
];

export const AppLayout = () => {
    const { pathname } = useLocation();

    return (
        <Layout>
            <Header>
                <Menu
                    theme='dark'
                    mode='horizontal'
                    items={menuItems}
                    selectedKeys={[pathname]}
                />
            </Header>
            <Content style={{ padding: '24px', minHeight: '100vh' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};
