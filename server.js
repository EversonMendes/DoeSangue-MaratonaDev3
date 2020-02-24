//configurando o servidor
const express = require("express")
const server = express()

//configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

//Configurando conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({

    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '010203',
    database: 'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure('./', {
    express: server,
    noCache: true, //boolean
})


//confirgurar a apresentação da página
const donors = []
server.get('/', function(req, res) {
    db.query('SELECT * FROM donors ORDER BY id DESC LIMIT 12', function(err, result) {
        if (err) return res.send("Erro no banco de dados.")
        const donors = result.rows
        return res.render('index.html', { donors })
    })

})

server.post("/", function(req, res) {
    //pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }
    //colocando valores no banco de dados


    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err) {

        //fluxo de erro
        if (err) return res.send("Erro no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })


})

//ligar o servidor e permitir acesso na porta 3000
server.listen(3000, function() {
    console.log('Servidor iniciado')
})