function Game() {
	var size = 5;
	this.width = 100;
	this.height = 100;
	this.map = new Array();
	for (var i = 0; i < this.width; i++)
		this.map[i] = new Array();

	this.init = function() {
	for (var i = 0; i < this.width; i++)
		for (var j = 0; j < this.height; j++)
			this.map[i][j] = 0;
	}

	this.random = function(density) {
		this.init();
		var num = Math.round(this.width * this.height * density);
		while (num > 0){
			var x = Math.floor(Math.random() * this.width);
			var y = Math.round(Math.random() * this.height);
			if (x > 0 && x < this.width && y > 0 && y < this.height) {
				if (this.map[x][y] == 0) {
					this.map[x][y] = 1;
					num--;
				}
			}
		}
		this.update();
	}	

	this.addCell = function(e){
		var offs = $("#canvasWrapper");
		var x = Math.floor((e.clientX - offs.position().left)/size);
		var y = Math.floor((e.clientY - offs.position().top)/size);
		game.map[x][y] = 1 - game.map[x][y];
		game.update();
	}

	this.start = function() {
		this.count();
		this.update();
		t = setTimeout("game.start()", 100);
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
			for (var j = 0; j < this.height; j++) {
				if (this.map[i][j] == 1)
					cxt.fillStyle = "#FFFFFF";
				else
					cxt.fillStyle = "#000000";
				cxt.fillRect(size * i, size * j, size * (i + 1), size * (j + 1));
			}
	}
}

function startGame() {
	$("#start").attr("disabled", "disabled");
	$("#pause").removeAttr("disabled");
	$("#random").attr("disabled", "disabled");
	game.start();
}

function pauseGame() {
	$("#start").removeAttr("disabled");
	$("#pause").attr("disabled", "disabled");
	$("#random").removeAttr("disabled");
	clearTimeout(t);
}

$(document).ready(function() {
	game = new Game();
	game.init();
	game.update();
	$("#start").click(startGame);
	$("#pause").click(pauseGame);
	$("#random").click(function () {game.random(0.5)});
	$("#map").click(game.addCell);
	$("#pause").attr("disabled", "disabled");
});

