function Game() {
	this.size = 5;
	this.started = false;
	this.width = 100;
	this.height = 100;
	this.intermission = 100;
	this.density = 0.5;

	//initiate game
	this.init = function() {
		if (this.map == undefined)
			this.map = new Array();
		for (var i = 0; i < this.width; i++)
			if (this.map[i] == undefined)
				this.map[i] = new Array();
		for (var i = 0; i < this.width; i++)
			for (var j = 0; j < this.height; j++)
				this.map[i][j] = 0;
	}

	//set evolving velocity of cells
	this.setCellInterval = function() {
		this.intermission = $("#intermission")[0].value;
		$("#intermission-number").text($("#intermission")[0].value + "ms");
	}

	//set density of cells
	this.setDensity = function() {
		this.density = $("#density")[0].value / 100;
		$("#density-number").text($("#density")[0].value + "%");
	}

	//set edge count
	this.setEdge = function() {
		this.width = $("#edge")[0].value;
		this.height = $("#edge")[0].value;
		$("#edge-number").text(this.width);
		this.size = 500 / this.width;
		game.clear();
	}

	//randomize the distribution
	this.random = function() {
		this.init();
		var num = Math.round(this.width * this.height * this.density);
		while (num > 0){
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
				if (this.map[x][y] == 0) {
					this.map[x][y] = 1;
					num--;
				}
			}
		}
		this.update();
	}	

	//clear the screen
	this.clear = function() {
		this.init();
		this.update();
	}
	
	//click to add cell
	this.addCell = function(e) {
		if (game.started == true)
			return;
		var offs = $("#map");
		var x = Math.floor((e.pageX - offs.offset().left - 5)/game.size);
		var y = Math.floor((e.pageY - offs.offset().top - 5)/game.size);
		game.map[x][y] = 1 - game.map[x][y];
		game.update();
	}

	//start evolving
	this.start = function() {
		this.count();
		this.update();
		t = setTimeout("game.start()", this.intermission);
	}

	this.count = function() {
		var dx = [-1, -1, -1, 0, 0, 1, 1, 1];
		var dy = [-1, 0, 1, -1, 1, -1, 0, 1];
		var tmap = new Array();
		for (var i = 0; i < this.width; i++)
			tmap[i] = new Array();
		for (var i = 0; i < this.width; i++)
			for (var j = 0; j < this.height; j++) {
				var sum = 0;
				for (var k = 0; k < 8; k++) {
					var tx = i + dx[k];
					var ty = j + dy[k];
					if (tx < 0)
						tx = this.width - 1;
					if (ty < 0)
						ty = this.height - 1;
					if (tx == this.width)
						tx = 0;
					if (ty == this.height)
						ty = 0;
					if (this.map[tx][ty] == 1)
						sum++;
				}
				if (sum == 3)
					tmap[i][j] = 1;
				else
					if (sum == 2)
						tmap[i][j] = this.map[i][j];
					else
						tmap[i][j] = 0;
			}
		for (var i = 0; i < this.width; i++)
			for (var j = 0; j < this.height; j++)
				this.map[i][j] = tmap[i][j];
	}

	this.update = function() {
		var c = document.getElementById("map");
		var cxt =  c.getContext("2d");
		cxt.clearRect(0, 0, c.width, c.height);

		for (var i = 0; i < this.width; i++)
			for (var j = 0; j < this.height; j++)
				if (this.map[i][j] == 1)
				{
					cxt.shadowBlur=3;
					cxt.shadowColor="black";
					var circum = this.circumCount(i, j);
					cxt.fillStyle = "#666666";
					if (circum >= 6)
						cxt.fillStyle = "#999999";
					if (circum >= 12)
						cxt.fillStyle = "#cccccc";
					if (circum >= 18)
						cxt.fillStyle = "#ffffff";
					cxt.fillRect(this.size * i, this.size * j, this.size, this.size);
				}
	}

	this.circumCount = function(x, y) {
		var result = 0;
		for (var i = -2; i <= 2; i++)
			for (var j = -2; j <= 2; j++) {
				if (i == 0 && j == 0)
					continue;
				var tx = x  + i;
				var ty = y  + j;
				if (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height){
					if (this.map[tx][ty] == 1)
						result += 1;
			}
		}
		return result;
	}

}

function startGame() {
	$("#start").attr("disabled", "disabled");
	$("#pause").removeAttr("disabled");
	$("#random").attr("disabled", "disabled");
	$("#clear").attr("disabled", "disabled");
	$("#edge").attr("disabled", "disabled");
	$("#density").attr("disabled", "disabled");
	game.started = true;
	game.start();
}

function pauseGame() {
	$("#start").removeAttr("disabled");
	$("#pause").attr("disabled", "disabled");
	$("#random").removeAttr("disabled");
	$("#clear").removeAttr("disabled");
	$("#edge").removeAttr("disabled");
	$("#density").removeAttr("disabled");
	game.started = false;
	clearTimeout(t);
}

$(document).ready(function() {
	game = new Game();
	game.clear();
	$("#start").click(startGame);
	$("#pause").click(pauseGame);
	$("#random").click(function () {game.random()});
	$("#clear").click(function() {game.clear()});
	$("#map").click(game.addCell);
	$("#intermission").change(function (){game.setCellInterval()});
	$("#density").change(function (){game.setDensity()});
	$("#edge").change(function() {game.setEdge()});
	$("#pause").attr("disabled", "disabled");
});

