const swaggerAutogen = require('swagger-autogen')();
const packageInfo = require('./package.json');

// Define o caminho para os arquivos de definição dos endpoints
const endpointsFiles = ['./server.js'];

const doc = {
    info: {
        title: "meu-projeto-node",
        description: "Projeto utilizado no aprendizado de NodeJS + GCP + Trace + Logs 2",
        version: packageInfo.version
    },
    host: process.env.SWAGGER_HOST || 'localhost:3001'
};

function generateSwagger() {
    return swaggerAutogen('./doc/swagger.json', endpointsFiles, doc)
}

module.exports = generateSwagger;
