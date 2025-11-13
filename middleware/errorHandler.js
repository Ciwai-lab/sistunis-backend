// middleware/errorHandler.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = (err, req, res, next) => {
    // log server-side detail (replace console.error with winston in prod)
    console.error(err);

    const status = err.status || 500;
    const message = err.exposeMessage || (status === 500 ? 'Internal Server Error' : err.message);

    const payload = { status: 'error', message };

    if (!isProd) {
        payload.stack = err.stack;
        payload.detail = err.detail || null;
    }

    res.status(status).json(payload);
};
