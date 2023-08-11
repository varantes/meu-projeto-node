const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const correlationId = require('express-correlation-id');

const app = express();

// Configuração do Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Middleware para gerar correlation-id
app.use(correlationId());

// Configuração do Morgan para registrar com correlation-id
morgan.token('correlation-id', function getId(req) {
    return req.correlationId();
});
const morganJsonFormat = (tokens, req, res) => {
    return JSON.stringify({
        'correlation-id': tokens['correlation-id'](req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        'response-time': tokens['response-time'](req, res) + 'ms'
    });
};
app.use(morgan(morganJsonFormat));

app.get('/hello-world', (req, res) => {
    console.log(`request recebido: req.url = ${req.url}`);
    res.send('Olá, Mundo!');
});

app.get('/v2/hello-world', (req, res) => {
    res.send('Olá, Mundo v2!');
});

app.get('/v1/winston-test', (req, res) => {
    const requestTime = new Date().toISOString();
    const correlationId = req.correlationId();
    logger.info(`[correlation-id: ${correlationId}] Winston test log at ${requestTime}`);
    res.send(`Requisição recebida em: ${requestTime}`);
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

app.get('/v2/winston-test', (req, res) => {
    const requestTime = new Date().toISOString();
    const correlationId = req.correlationId();

    logger.info('Winston test log', {
        timestamp: requestTime,
        correlationId: correlationId,
        message: `Winston test log at ${requestTime}`
    });

    res.send(`Requisição recebida em: ${requestTime}`);
});