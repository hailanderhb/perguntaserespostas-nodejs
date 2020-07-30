

const Sequelize = require("sequelize");
const connection = require("./database");

//model
const Resposta = connection.define("respostas",{
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {//qual pergunta essa resposta responde
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Resposta.sync({force: false});
module.exports = Resposta;