module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    },
};
