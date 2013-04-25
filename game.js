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
	var blueprint = windsock.blueprint(pos, speed, bearing)

	blueprint.forEach(function(pos) {
		game.createBlock(pos,2)
	})

}

var requestForecast = function (lat, lon) {
	console.log(lat + ' ' + lon)
	var coordinates = {
		longitude: lon,
		latitude: lat
	}
	var query = qs.stringify(coordinates)
	console.log(query)
	var req = hq.get('/forecast?' + query);
	req.on('end', function(res) {
		var i = 0
		console.log('response is ' + res)

		// parsed.data.forEach(function(data) {
		// 	parseWeather(data,i)
		// 	i++
		// })
	})
}

function parseWeather(data, i) {
	buildWindsock([i, 0, 0], data.windSpeed, data.windBearing)
}

game.requestForecast = requestForecast