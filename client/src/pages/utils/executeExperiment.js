/* eslint-disable no-unused-vars */
export const executeMapMeasurements = async (Module, frameCount = 10) => {
    const plant_init = Module.cwrap('plant_init', null, ['number']);
    const plant_measure = Module.cwrap('plant_measure', 'number', [
        'number',
        'number',
    ]);

    plant_init();

    let frames = [];
    let errors = [];

    const measureFrame = (frameIndex) => {
        let measurements = {};
        let tableData = [];
        let frameErrors = [];
        let stabilityViolated = false;

        const measure = (step, channel) => {
            const value = plant_measure(channel);

            if (!measurements[channel]) {
                measurements[channel] = [];
            }

            if (channel === 7 || channel === 75) {
                const previousValues = measurements[channel].map(
                    (m) => m.value
                );
                if (
                    previousValues.length > 0 &&
                    !previousValues.every((v) => v === previousValues[0])
                ) {
                    stabilityViolated = true;
                    frameErrors.push(
                        `Кадр ${frameIndex}: канал ${channel} потерял стабильность на шаге ${step}`
                    );
                }
            }
            measurements[channel].push({ step, value });

            tableData.push({
                key: `${step}-${channel}`,
                step,
                channel,
                value,
            });

            return value;
        };

        try {
            measure(1, 7);
            measure(2, 6);
            const x6 = measurements[6].map((m) => m.value).pop();
            const normX6 = (x6 - 0.5) / 0.5;

            measure(6, 47);
            measure(7, 4);
            const x4 = measurements[4].map((m) => m.value).pop();
            const inBounds4 = x4 >= 0 && x4 <= 1;
            if (!inBounds4) {
                frameErrors.push(
                    `Кадр ${frameIndex}: x4 (${x4.toFixed(
                        2
                    )}) выходит за пределы [0, 1]`
                );
            }

            measure(8, 17);
            measure(9, 17);
            measure(10, 75);
            measure(11, 3);
            measure(12, 17);
            measure(13, 7);
            measure(14, 2);
            measure(15, 17);
            measure(16, 57);
            const x57 = measurements[57].map((m) => m.value).pop();
            const funcX57 = (x57 - 150) / (x57 + 220);

            measure(17, 7);
            measure(18, 17);
            measure(19, 93);
            const x93 = measurements[93].map((m) => m.value).pop();
            const inBounds93 = x93 >= 0 && x93 <= 30;
            if (!inBounds93) {
                frameErrors.push(
                    `Кадр ${frameIndex}: x93 (${x93.toFixed(
                        2
                    )}) выходит за пределы [0, 30]`
                );
            }

            measure(21, 17);
            measure(23, 17);
            measure(25, 1);
            measure(26, 17);
            measure(27, 75);
            measure(28, 17);

            const ch17_values = measurements[17];
            const avg =
                ch17_values.reduce((a, { value }) => a + value, 0) /
                ch17_values.length;
            const variance =
                ch17_values.reduce(
                    (acc, { value }) => acc + Math.pow(value - avg, 2),
                    0
                ) / ch17_values.length;

            frames.push({
                frameIndex,
                measurements,
                tableData,
                calculations: {
                    normX6,
                    inBounds4,
                    funcX57,
                    inBounds93,
                    avg,
                    variance,
                },
                warnings: frameErrors,
            });

            if (frameErrors.length > 0) {
                errors.push(...frameErrors);
            }
        } catch (error) {
            errors.push(`Ошибка в кадре ${frameIndex}: ${error.message}`);
        }
    };

    for (let i = 0; i < frameCount; i++) {
        measureFrame(i + 1);
    }

    console.log({
        frames,
        errors,
    });

    return {
        frames,
        errors,
    };
};
