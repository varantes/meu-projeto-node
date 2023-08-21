const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const correlationId = require('express-correlation-id');
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const packageInfo = require('./package.json');

require('@google-cloud/trace-agent').start();

const app = express();

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

// Define o caminho para os arquivos de definição dos endpoints
const endpointsFiles = ['./server.js'];

const doc = {
    info: {
        title: "meu-projeto-node",
        description: "Projeto utilizado no aprendizado de NodeJS + GCP + Trace + Logs",
        version: packageInfo.version
    },
    host: process.env.SWAGGER_HOST || 'localhost:3001'
};

// Gera a especificação OpenAPI usando o swagger-autogen
swaggerAutogen('./doc/swagger.json', endpointsFiles, doc);

// Rota para a documentação gerada pelo Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./doc/swagger.json')));

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