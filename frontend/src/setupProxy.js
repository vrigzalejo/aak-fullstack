const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://backend:8000',
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
            onError: (err, req, res) => {
                console.error('Proxy error:', err.message)
                res.status(500).json({ error: 'Proxy error: ' + err.message })
            },
            onProxyReq: (proxyReq, req, res) => {
                console.log('Proxying:', req.method, req.url, '-> http://backend:8000' + req.url)
            },
            onProxyRes: (proxyRes, req, res) => {
                console.log('Proxy response:', proxyRes.statusCode, req.url)
            }
        })
    )
}
