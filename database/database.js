
//Importando sequelize para o js
const Sequelize = require('sequelize');

//Conectando o banco de dados do mysql criado lá como guiaperguntas
//adicionando root, senha do bd e onde está sendo rodado com o dialeto do bd
const connection = new Sequelize('guiaperguntas', 'root', 'hbfluir21', {
    host: 'localhost',
    dialect: 'mysql'
});
//dialect = tipo de banco de dados.


//Para utilizar em outros arquivos js precisamos exportar essa conexão
module.exports = connection;
