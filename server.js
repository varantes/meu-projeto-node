const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const correlationId = require('express-correlation-id');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

// Defina as opções para o swagger-jsdoc
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nome da API',
            version: '1.0.0',
      description: 'Descrição da API'
    }
    },
    // Caminho para os arquivos com as anotações dos endpoints
  apis: ['./*.js']
};

// Crie o objeto swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Rota para a documentação gerada pelo Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /hello-world:
 *   get:
 *     summary: Retorna uma mensagem de "Olá, Mundo!"
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Olá, Mundo!
 */
app.get('/hello-world', (req, res) => {
    console.log(`request recebido: req.url = ${req.url}`);
    res.send('Olá, Mundo!');
});

/**
 * @swagger
 * /v2/hello-world:
 *   get:
 *     summary: Retorna uma mensagem de "Olá, Mundo v2!"
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Olá, Mundo v2!
 */
app.get('/v2/hello-world', (req, res) => {
    res.send('Olá, Mundo v2!');
});

/**
 * @swagger
 * /v1/winston-test:
 *   get:
 *     summary: Teste do Winston
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Requisição recebida com sucesso
 */
app.get('/v1/winston-test', (req, res) => {
    const requestTime = new Date().toISOString();
    const correlationId = req.correlationId();
    logger.info(`[correlation-id: ${correlationId}] Winston test log at ${requestTime}`);
    res.send(`Requisição recebida em: ${requestTime}`);
});

/**
 * @swagger
 * /v2/winston-test:
 *   get:
 *     summary: Teste do Winston v2
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Requisição recebida com sucesso
 */
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