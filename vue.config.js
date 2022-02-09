module.exports = {
    // options...
    devServer: {
        proxy: {
            '/api/*': {
                target: 'https://codev-user.herokuapp.com/',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/api': '' },
                logLevel: 'debug'
            }

        }
    }
}

