const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Настройка подключения к базе данных
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    }
);

// Модель для таблицы users
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    operator_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

// Модель для таблицы experiments
const Experiment = sequelize.define('Experiment', {
    experiment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    operator: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prim: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'experiments',
    timestamps: false,
});

// Модель для таблицы frames
const Frame = sequelize.define('Frame', {
    frame_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    exp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Experiment,
            key: 'experiment_id',
        },
    },
    framenum: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    k1: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k2: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k3: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k4: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k6: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k17sr: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k17disp: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k47: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k57: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
    k93: {
        type: DataTypes.NUMERIC,
        allowNull: true,
    },
}, {
    tableName: 'frames',
    timestamps: false,
});

// Устанавливаем связь между таблицами
Experiment.hasMany(Frame, { foreignKey: 'exp_id' });
Frame.belongsTo(Experiment, { foreignKey: 'exp_id' });

module.exports = { sequelize, User, Experiment, Frame };