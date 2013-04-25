var express = require('express')
var app = express()
var server = require('http').createServer(app)
var util = require('util')
var config = require('./config.js')
var keys = new config()

var events = require('events')
var e = new events.EventEmitter()

var Forecast = require('forecast.io')
forecast = new Forecast({APIKey: keys.forecast})

app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'))
app.use(express.logger())

app.get('/', function(req,res) {res.sendfile('index.html')})
app.get('/bundle.js', function(req,res) {res.sendfile('bundle.js')})

app.get('/forecast', function(req,res) {
	e.emit('get weather', {lat: req.query.latitude, lon: req.query.longitude } )
	e.on('weather data', function(weather) {res.send(weather)})
})


e.on('get weather', getForecast)
function getForecast(coord) {
	forecast.get(coord.lat, coord.lon, function (err, res, data) {
		if (err) throw err
		e.emit('weather data', data.hourly)
	});
}

server.listen(3000);
console.log('Listening on port 3000')