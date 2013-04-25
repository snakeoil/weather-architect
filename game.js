var hq = require('hyperquest');
var qs = require('querystring');
var concat = require('concat-stream');
var textures = require('painterly-textures')(__dirname)
var player = require('voxel-player')
var createGame = require('voxel-engine')

var Windsock = require('./voxel-windsock')
var windsock = new Windsock() 

var options = {
  texturePath: textures,
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

function buildWindsock(pos) {
	var blueprint = windsock.blueprint(pos)

	blueprint.forEach(function(pos) {
		game.createBlock(pos,3)
	})

}


