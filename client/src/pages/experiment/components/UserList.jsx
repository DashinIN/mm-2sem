import { Typography } from 'antd';

const { Title } = Typography;

const UserList = ({ users, isLoading }) => {
    if (isLoading) {
        return <p>Загрузка пользователей...</p>;
    }

    return (
        <div>
            <Title level={4}>Список пользователей</Title>
            <ul>
                {users &&
                    users.map((user) => (
                        <li key={user.user_id}>{user.operator_name}</li>
                    ))}
            </ul>
        </div>
    );
};

export default UserList;
