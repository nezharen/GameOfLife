function Game() {
	this.width = 10;
	this.height = 10;
	this.map = new Array();
	for (var i = 0; i < this.width; i++)
		this.map[i] = new Array();

	this.init = function() {
	for (var i = 0; i < this.width; i++)
		for (var j = 0; j < this.height; j++)
			this.map[i][j] = 0;
	}

	this.random = function() {
	}

	this.start = function() {
		this.count();
		this.update();
		setTimeout("this.start()", 1000);
	}

	this.count = function() {
		var dx = [-1, -1, -1, 0, 0, 1, 1, 1];
		var dy = [-1, 0, 1, -1, 1, -1, 0, 1];
		var sum = 0;
		var tmap = new Array();
		for (var i = 0; i < this.width; i++)
			tmap[i] = new Array();
		for (var i = 1; i < this.width - 1; i++)
			for (var j = 1; j < this.height - 1; j++)
			{
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
		var size = 50;
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

var game = new Game();

