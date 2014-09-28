// test: Initialize game
function tInit(){
	var game = new Game();
	game.init();
	if (game.width == undefined)
		return false;
	if (game.height == undefined)
		return false;
	if (game.started == undefined)
		return false;
	for (var i = 0; i < this.width; i++)
		for (var j = 0; j < this.height; j++)
			if (this.map[i][j] != 0)
				return false;
	return true;
}

// test: Generate cells randomly
function tRandom(dense){
	var game = new Game();
	game.init();
	game.density = dense;
	game.random();
	var sum = 0;
	for (var i = 0; i < game.width; i++)
		for (var j = 0; j < game.height; j++)
			sum += game.map[i][j];
	var result = Math.round(sum / (game.width * game.height) * 100);
	return result;
}

// test: evolve one step with random distribution
function tCount(dense){
	var game = new Game();
	game.init();
	game.density = dense;
	game.random();
	return check(game);	
}

function tSpecial(){
	var game = new Game();
	game.init();
	game.map[0][0] = game.map[game.width-1][0] = game.map[0][game.height-1] = game.map[game.width-1][game.height-1] = 1;
	game.count();
	var result = game.map[0][0] + game.map[game.width-1][0] + game.map[0][game.height-1] + game.map[game.width-1][game.height-1];
	return result;
}

function check(game){
	var dx = [-1, -1, -1, 0, 0, 1, 1, 1];
	var dy = [-1, 0, 1, -1, 1, -1, 0, 1];
	var prev = new Array();
	for (var i = 0; i < game.width; i++)
		prev[i] = new Array();
	for (var i = 0; i < game.width; i++)
		for (var j = 0; j < game.height; j++)
				prev[i][j] = game.map[i][j];
	game.count();
	for (var i = 0; i < game.width; i++)
		for (var j = 0; j < game.height; j++){
			var sum = 0;
			for (var k = 0; k < 8; k++){
				var tx = i + dx[k];
				var ty = j + dy[k];
				if (tx < 0) 
					tx = game.width - 1;
				if (tx == game.width)
					tx = 0;
				if (ty < 0)
					ty = game.height - 1;
				if (ty == game.height)
					ty = 0;
				sum += prev[tx][ty];
			}
			switch (sum){
				case 2: if (game.map[i][j] != prev[i][j])
							return false;
						break;
				case 3: if (!game.map[i][j])
							return false;
						break;
				default:if (game.map[i][j])
							return false;
						break;
			}
		}
	return true;
}


/*                */
/* test functions */
/*                */
module("Tests for initial part:");

test("initialize", function(){
	ok(tInit(), 'Successfully initialized');
})

test("randomize", function(){
	equal(tRandom(0), 0, 'Generate cells with density 0%');
	equal(tRandom(0.2), 20, 'Generate cells with density 20%');
	equal(tRandom(0.5), 50, 'Generate cells with density 50%');
	equal(tRandom(0.7), 70, 'Generate cells with density 70%');
	equal(tRandom(1), 100, 'Generate cells with density 100%');
})

module("Tests for logical part:");

test("test:evolve one step(with different density)", function (){
	ok(tCount(0), 'Evolve correctly');
	ok(tCount(0.1), 'Evolve correctly');
	ok(tCount(0.2), 'Evolve correctly');
	ok(tCount(0.3), 'Evolve correctly');
	ok(tCount(0.4), 'Evolve correctly');
	ok(tCount(0.5), 'Evolve correctly');
	ok(tCount(0.6), 'Evolve correctly');
	ok(tCount(0.7), 'Evolve correctly');
	ok(tCount(0.8), 'Evolve correctly');
	ok(tCount(0.9), 'Evolve correctly');
	ok(tCount(1), 'Evolve correctly');
})

test("test:evolve multiple steps", function(){
	var game = new Game();
	game.init();
	game.density = 0.5;
	game.random();
	for (i = 0; i < 100; i++)
	{
		game.count();
		equal(check(game), true, "evolve step"+(i+1));
	}
})

test("special test sample", function(){	
	equal(tSpecial(), 4, 'Correct');
})

asyncTest('asynchronous test', function() { 
	setTimeout(function() {
	    ok(tCount(0.5), 'Correct');
	    start();
	}, 100)
})