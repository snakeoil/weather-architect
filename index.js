var express = require('express')
var app = express()
var server = require('http').createServer(app)

app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'))
app.use(express.logger())

app.get('/', function(req,res) {res.send('game.html')})

app.get('/forecast', getForecast(req,res))


function getForecast(req,res) {}