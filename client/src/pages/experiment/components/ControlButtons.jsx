import { Button, Input, InputNumber } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

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
    handleExportClick,
    isLoading,
    hasExperimentData,
}) => {
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
                max={1000}
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
            <Button onClick={handleClearData} style={{ marginRight: '8px' }}>
                Очистить
            </Button>
            {hasExperimentData && (
                <>
                    <Button
                        type='primary'
                        onClick={handleSaveExperiment}
                        style={{ marginRight: '8px' }}
                        loading={isLoading}
                    >
                        Сохранить эксперимент
                    </Button>
                    <Button
                        onClick={handleExportClick}
                        icon={<DownloadOutlined />}
                    >
                        Экспорт в Excel
                    </Button>
                </>
            )}
        </div>
    );
};

export default ControlButtons;
