var hq = require('hyperquest');
var qs = require('querystring');
var concat = require('concat-stream');
var player = require('voxel-player')
var createGame = require('voxel-engine')
var Windsock = require('voxel-windsock')
var windsock = new Windsock() 

var options = {
  texturePath: './textures/',
  generate: function(x, y, z) {
    return y === 0 ? 1 : 0
  }
}

var game = createGame(options)
game.windsock = windsock
window.game = game

var avatar = player(game)()
avatar.possess()
avatar.yaw.position.set(0,20,0)

var container = document.body
game.appendTo(container)

function buildWindsock(pos, speed, bearing) {
  console.log(pos + ',' + speed + ',' + bearing)
	var blueprint = windsock.blueprint(pos, speed, bearing)
  console.log(blueprint)
	blueprint.forEach(function(pos) {
		game.createBlock(pos,2)
	})

}

var requestForecast = function (lat, lon) {

	var coordinates = {
		longitude: lon,
		latitude: lat
	}
	var query = qs.stringify(coordinates)
	var req = hq.get('/forecast?' + query)
	var i = 0;
	var weatherData = ''
	req.on('data', function(data) {
		weatherData += data
	})
	req.on('end', function() {
		weatherJSON = JSON.parse(weatherData)
		weatherJSON.data.forEach(function(data) {
			parseWeather(data, i)
			i += 5
		})
	})
}

function parseWeather(data, i) {
	buildWindsock([i, 0, i], data.windSpeed, data.windBearing)
}

requestForecast("32.987824","-96.751427")
game.requestForecast = requestForecast
