

const Sequelize = require("sequelize");
const connection = require("./database");

//Criando uma tabela pelo Sequelize
const Pergunta = connection.define('perguntas',{
    titulo:{ //campo titulo
        type: Sequelize.STRING, //texto pequeno
        allowNull: false //esse campo impede de estar vazio
    },
    descricao:{ //campo descricao
        type:Sequelize.TEXT, //texto longo
        allowNull: false
    }
});//criando um Model com o nome da tabela pergunta

Pergunta.sync({force: false}).then(() => {}); //criando a tabela no banco
//não vai forçar se a tabela ja existe.

module.exports = Pergunta; //exportando modulo