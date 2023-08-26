const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const correlationId = require('express-correlation-id');
const generateSwagger = require('./initializeSwagger');
const swaggerUi = require('swagger-ui-express');

// Configuração do Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

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

const app = express();
app.use(correlationId());
app.use(morgan(morganJsonFormat));

generateSwagger().then(() => {
    const swaggerData = require("./doc/swagger.json")
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData));
})

app.get('/hello-world', (req, res) => {
    // #swagger.description = '"Olá, Mundo!" básico de qualquer tutorial.'
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

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});