//Importando o express para esse js e a variável const
const express = require("express");
const app = express(); //Recebendo a variavel express em modo função pra melhor manipulação do framework
const bodyParser = require("body-parser"); //Importando body parser
const connection = require("./database/database"); //estou importando a connexão
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");//chamando model resposta, tudo que estiver lá vai rodar aqui

//Database / PROMISE
connection
    .authenticate()  //tenta autenticar
    .then(() =>{  //só chama o then se autenticado com sucesso
        console.log("Conexão realizada com o banco de dados!")
    })
    .catch((msgErro) =>{ //caso dê erro ele chama o catch
        console.log(msgErro);
    })

//Configurando express para usar ejs  como view engine
app.set('view engine', 'ejs');
app.use(express.static('public')); //Indicando para o require do express usar o express.static na pasta public

//Body Parser
//configurando bodyParser - esse comando permite que a pessoa envie os dados e o bodyparser traduz numa estrutura js decodificando
//Bodyparser disponibiliza o uso de req.body."name da requisicao"
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROTAS
app.get("/",(req, res) => { //express() pega o endereço / e conforme a função ele pega a requisição e envia uma resposta
    Pergunta.findAll({ raw:true, order:[ //rawtrue faz a busca crua e order ordena as perguntas
        ['id','DESC'] //Maior id para o menor id, poderia usar ASC para ser crescente
    ] }).then(perguntas=>{// findall () é um metodo usado para listar todas as perguntas igual select *from all
        res.render("index",{
            perguntas: perguntas //criando variavel pergunta para mostrar na index
        });
    });//then é usado para receber a pergunta para mostrar na tela
    //Respondendo com uma renderização do index.ejs pela view engine

});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

//Essa rota pega o titulo e a descrição da pergunta
app.post("/salvarpergunta", (req,res) =>{

    var titulo = req.body.titulo;//recebi os dados na variável
    var descricao = req.body.descricao;
    
    //O model é o representante da tabela do banco de dados
    Pergunta.create({//chamando create no model pergunta é igual a insert into em SQL para incrementar o banco de dados (tabela)
        titulo: titulo,//chamei a variável para ser criada no campo titulo
        descricao: descricao//chamei a variavel para ser criada no campo descricao

    }).then(() => { //depois de receber a pergunta uso then para fazer algo nesse caso redirecionar o usuário
        res.redirect("/");//redirecionando usuario para tela inicial
    }); 

});

//Abrindo rota para criar uma pagina para cada pergunta de acordo com o ID
app.get("/pergunta/:id", (req, res) =>{ 
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id} //where serve para fazer condições, nesse caso qnd o parametro id for um numero ele busca dentro do bd esse numero na tabela id
    }).then(pergunta => {
        if(pergunta != undefined){//pergunta encontrada
            
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta, //linha de comando para utilizar <%= pergunta%> posteriormente
                    respostas: respostas
                });
            }); //redireciona para a nova pagina de pergunta de acordo com o id
        }else{//não encontrada
            res.redirect("/");//redireciona para a pagina principal
        }
    });
});

app.post("/responder", (req, res) => {//Rota pra receber os dados do formulario de resposta
    var corpo =  req.body.corpo;//nomeado body no textarea
    var perguntaId = req.body.pergunta;//hidden
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(8080, () =>{console.log("App Rodando!");});
//Pedindo para o express() escutar na porta 8080 do localhost