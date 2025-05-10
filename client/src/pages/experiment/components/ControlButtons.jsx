import { Button, Input, InputNumber } from 'antd';

const ControlButtons = ({
    operatorName,
    setOperatorName,
    experimentDescription,
    setExperimentDescription,
    frameCount,
    setFrameCount,
    handleMapExecution,
    handleClearData,
    handleSaveExperiment,
    isLoading,
    hasExperimentData,
}) => {
    const handleClear = () => {
        setOperatorName(''); // Очистка имени пользователя
        setExperimentDescription(''); // Очистка описания эксперимента
        handleClearData(); // Вызов основного обработчика очистки
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <Input
                placeholder='Введите имя пользователя'
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                style={{ marginBottom: '8px', width: '300px' }}
            />
            <Input
                placeholder='Введите описание эксперимента (необязательно)'
                value={experimentDescription}
                onChange={(e) => setExperimentDescription(e.target.value)}
                style={{ marginBottom: '8px', width: '300px' }}
            />
            <InputNumber
                min={1}
                max={10000}
                value={frameCount}
                onChange={(value) => setFrameCount(value)}
                style={{ marginRight: '8px' }}
            />
            <Button
                type='primary'
                onClick={handleMapExecution}
                style={{ marginRight: '8px' }}
            >
                Выполнить измерения
            </Button>
            <Button onClick={handleClear} style={{ marginRight: '8px' }}>
                Очистить
            </Button>
            {hasExperimentData && (
                <Button
                    type='primary'
                    onClick={handleSaveExperiment}
                    style={{ marginRight: '8px' }}
                    loading={isLoading}
                >
                    Сохранить эксперимент
                </Button>
            )}
        </div>
    );
};

export default ControlButtons;
