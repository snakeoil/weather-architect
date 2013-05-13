var hq = require('hyperquest')
var qs = require('querystring')
var concat = require('concat-stream')
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



function buildTower(pos, temp) {
  console.log(pos + ',' + temp)
  var blueprints = []
  for (var i = 0; i <= temp; i++) {

        if (i < 3) {
            blueprints.push([pos[0]-2,i,pos[2]])
            blueprints.push([pos[0]+2,i,pos[2]])
            blueprints.push([pos[0],i,pos[2]-2])
            blueprints.push([pos[0],i,pos[2]+2])
        }

        if (i < 5) {
            blueprints.push([pos[0]-1,i,pos[2]])
            blueprints.push([pos[0]-1,i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]])
            blueprints.push([pos[0]+1,i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]-1])
            blueprints.push([pos[0]-1,i,pos[2]-1])
            blueprints.push([pos[0],i,pos[2]-1])
            blueprints.push([pos[0],i,pos[2]+1])
        }

        if (i === temp) {
            for (var j = 0; j < 4; j++) {
                blueprints.push([pos[0]-j,i,pos[2]])
                blueprints.push([pos[0]+j,i,pos[2]])
                blueprints.push([pos[0],i,pos[2]+j])
                blueprints.push([pos[0],i,pos[2]-j])
            }
        }

        blueprints.push([pos[0],i,pos[2]])
  }
  console.log(blueprints)
    blueprints.forEach(function(pos) {
        game.createBlock(pos,5)
    })

}

function buildSpire(pos, ozone) {
  var blueprints = []
  for (var i = 0; i <= ozone; i++) {
        if (i < 2) {
            blueprints.push([pos[0]-1,i,pos[2]])
            blueprints.push([pos[0]+1,i,pos[2]])
            blueprints.push([pos[0]-2,i,pos[2]])
            blueprints.push([pos[0]+2,i,pos[2]])
            blueprints.push([pos[0],i,pos[2]-2])
            blueprints.push([pos[0],i,pos[2]+2])
            blueprints.push([pos[0],i,pos[2]-1])
            blueprints.push([pos[0],i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]-2])
            blueprints.push([pos[0]+2,i,pos[2]+2])
            blueprints.push([pos[0]-1,i,pos[2]-1])
            blueprints.push([pos[0]-1,i,pos[2]+1])
        }

        if ((i % 2) === 1 ) {
            blueprints.push([pos[0]-2,i,pos[2]])
            blueprints.push([pos[0]+2,i,pos[2]])
        }

        if ((i % 2) === 0 ) {
            blueprints.push([pos[0]-1,i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]-1])
            blueprints.push([pos[0]-1,i,pos[2]-1])
        }

        if (i === (ozone - 1)) {
            blueprints.push([pos[0]-1,i,pos[2]])
            blueprints.push([pos[0]+1,i,pos[2]])
            blueprints.push([pos[0]-2,i,pos[2]])
            blueprints.push([pos[0]+2,i,pos[2]])
            blueprints.push([pos[0],i,pos[2]-2])
            blueprints.push([pos[0],i,pos[2]+2])
            blueprints.push([pos[0],i,pos[2]-1])
            blueprints.push([pos[0],i,pos[2]+1])
            blueprints.push([pos[0]+1,i,pos[2]-2])
            blueprints.push([pos[0]+2,i,pos[2]+2])
            blueprints.push([pos[0]-1,i,pos[2]-1])
            blueprints.push([pos[0]-1,i,pos[2]+1])
        }

        if (i === ozone) {
            for (var j = 0; j < 4; j++) {
                blueprints.push([pos[0]-j,i,pos[2]])
                blueprints.push([pos[0]+j,i,pos[2]])
                blueprints.push([pos[0],i,pos[2]+j])
                blueprints.push([pos[0],i,pos[2]-j])
            }
        }

        blueprints.push([pos[0],i,pos[2]])
  }
  console.log(blueprints)
    blueprints.forEach(function(pos) {
        game.createBlock(pos,4)
    })

}

var requestForecast = function (lat, lon) {

    var coordinates = {
        longitude: lon,
        latitude: lat
    }
    var query = qs.stringify(coordinates)
    var req = hq.get('/forecast?' + query)
    var i = 1
    var weatherData = ''
    req.on('data', function(data) {
        weatherData += data
    })
    req.on('end', function() {
        weatherJSON = JSON.parse(weatherData)
        weatherJSON.data.forEach(function(data) {
            parseWeather(data, i)
            i += 7
        })
    })
}

function parseWeather(data, i) {
    buildWindsock([30, 0, i], data.windSpeed, data.windBearing)
    buildTower([5, 0, i], Math.round(data.temperature / 4))
    buildSpire([-20, 0 , i], Math.round(data.ozone / 10))
}

requestForecast("32.987824","-96.751427")
game.requestForecast = requestForecast
