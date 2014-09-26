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

	this.random = function(density){
		this.init();
		var num = Math.round((this.width - 1) * (this.height - 1) * density);
		while (num > 0){
			var x = Math.round(Math.random() * (this.width - 1));
			var y = Math.round(Math.random() * (this.height - 1));
			if (x > 0 && x <= this.width-1 && y > 0 && y <= this.height-1){
				if (this.map[x][y] == 0){
					this.map[x][y] = 1;
					num--;
				}
			}
		}
		this.update();
	}	

	this.generate = function(){
		this.init();
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
		for (var i = 1; i < this.width - 1; i++)
			for (var j = 1; j < this.height - 1; j++)
			{
				var sum = 0;
				for (var k = 0; k < 8; k++)
					if (this.map[i + dx[k]][j + dy[k]] == 1)
						sum++;
				if (sum == 3)
					tmap[i][j] = 1;
				else
					if (sum == 2)
						tmap[i][j] = this.map[i][j];
					else
						tmap[i][j] = 0;
			}
		for (var i = 1; i < this.width - 1; i++)
			for (var j = 1; j < this.height - 1; j++)
				this.map[i][j] = tmap[i][j];
	}

	this.update = function() {
		var c = document.getElementById("map");
		var cxt =  c.getContext("2d");
		cxt.clearRect(0, 0, c.width, c.height);
		for (var i = 1; i < this.width - 1; i++)
			for (var j = 1; j < this.height - 1; j++) {
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
	$("#start").click(startGame);
	$("#pause").click(pauseGame);
	$("#generate").click(function (){game.generate()});
	$("#random").click(function () {game.random(0.5)});
	document.getElementById('map').addEventListener('click', game.addCell, false);
	$("#pause").attr("disabled", "disabled");
});

