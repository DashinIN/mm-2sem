const express = require('express');
const { sequelize, Experiment, Frame, User } = require('./models'); // Убедитесь, что модель User импортирована
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 3000;

// Middleware для обработки JSON
app.use(express.json());

// Разрешить запросы с любого источника (или укажите конкретный источник)
app.use(cors());

// Проверка подключения к базе данных
sequelize.authenticate()
    .then(() => console.log('Подключение к базе данных успешно!'))
    .catch((err) => console.error('Ошибка подключения к базе данных:', err));

// Синхронизация моделей с базой данных (опционально)
// sequelize.sync({ alter: true });

// Маршрут для получения всех экспериментов
app.get('/experiments', async (req, res) => {
    try {
        const experiments = await Experiment.findAll();
        res.json(experiments);
    } catch (err) {
        console.error('Ошибка при получении экспериментов:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для сохранения эксперимента и его кадров
app.post('/experiments', async (req, res) => {
    const { operator_name, prim, frames } = req.body;

    if (!operator_name || !frames || frames.length === 0) {
        return res.status(400).json({ error: 'Необходимо указать имя пользователя и кадры' });
    }

    try {
        // Проверяем, существует ли пользователь
        let user = await User.findOne({ where: { operator_name } });
        if (!user) {
            user = await User.create({ operator_name });
        }

        // Создаем новый эксперимент
        const experiment = await Experiment.create({
            operator: operator_name,
            prim,
            datetime: new Date(),
        });

        // Добавляем кадры, связывая их с экспериментом
        const framesWithExpId = frames.map((frame) => ({
            ...frame,
            exp_id: experiment.experiment_id,
        }));
        await Frame.bulkCreate(framesWithExpId);

        res.status(201).json({ experiment, frames: framesWithExpId });
    } catch (err) {
        console.error('Ошибка при сохранении эксперимента:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для получения кадров по ID эксперимента
app.get('/frames/:experimentId', async (req, res) => {
    const { experimentId } = req.params;
    try {
        const frames = await Frame.findAll({ where: { exp_id: experimentId } });
        res.json(frames);
    } catch (err) {
        console.error('Ошибка при получении кадров:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для добавления нового пользователя
app.post('/users', async (req, res) => {
    const { operator_name } = req.body;

    if (!operator_name) {
        return res.status(400).json({ error: 'Имя пользователя обязательно' });
    }

    try {
        // Проверяем, существует ли пользователь с таким именем
        const existingUser = await User.findOne({ where: { operator_name } });

        if (existingUser) {
            return res.status(409).json({ error: 'Пользователь с таким именем уже существует' });
        }

        // Если пользователь не существует, создаем нового
        const newUser = await User.create({ operator_name });

        res.status(201).json(newUser);
    } catch (err) {
        console.error('Ошибка при добавлении пользователя:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Маршрут для получения всех пользователей
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error('Ошибка при получении пользователей:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});