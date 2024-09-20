import logger from "../utils/logger.js";

const hppMiddleware = (req, res, next) => {
    if (req.query && typeof req.query === 'object') {
        for (const key in req.query) {
            if (Array.isArray(req.query[key])) {
                req.query[key] = req.query[key][req.query[key].length - 1];
            }
        }
    }
    next();
}

const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next()
}

export { hppMiddleware, loggerMiddleware }