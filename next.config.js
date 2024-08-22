const path = require('path');

module.exports = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload'
    },
    env: {
        // SERVER_URL: 'http://localhost:9000',
        SERVER_URL: process.env.SERVER_URL,
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '~': path.resolve(__dirname),
            '@pages': path.resolve(__dirname, 'pages'),
            '@components': path.resolve(__dirname, 'components'),
            '@services': path.resolve(__dirname, 'services'),
            '@layout': path.resolve(__dirname, 'layout'),
            '@utils': path.resolve(__dirname, 'utils'),
        };

        return config;
    },
};