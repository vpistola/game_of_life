//
// This is my attempt to solve the game of life
//

const width = 30;
const height = 15;
const grid_states = ['.', '@'];

var gridNode = document.querySelector('#grid');
var spans = [];
var world = [];
var world_coord = [];
var LIVE  = '@'
var EMPTY = '.'
var PAD   = ' '

const rows = height;
const cols = width;
var world1 = [];
for(let i = 0; i < rows; i++) {
	world1[i] = []; // Initialize a new row
	for(let j = 0; j < cols; j++) {
		world1[i][j] = grid_states[Math.floor(Math.random() * grid_states.length)];
	}
}

// INITIALIZE THE GRID
picture2(world1);

// MAP FROM WORLD TO COORDINATES
world_coord = live_world(world1);
//console.log(world_coord);

// These are the live cells
function live_world(world) {
	let filtered = [];
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (world[i][j] != '.') filtered.push([i, j]);
		}
	}
	return filtered;
}

function neighbors(cell) {
	let x,y;
	let neighbors_arr = [];
	[x, y] = cell;
	for (let dx of [-1, 0, 1]) {
		for (let dy of [-1, 0, 1]) {
			if (dx != 0 || dy != 0) {
				if ((x + dx) > -1 && (y + dy) > -1) neighbors_arr.push([x + dx, y + dy]);
			}
		}
	}
	return neighbors_arr;
}

//world = live_w(spans);
//console.log(world);

function Counter(array) {
	var count = {};
	array.forEach(val => count[val] = (count[val] || 0) + 1);
	return count;
}

function neighbor_counts(world) {
	let count_of_neighbors_arr = []
	for (let cell of world) {
		for (let neighbor of neighbors(cell)) {
			count_of_neighbors_arr.push([neighbor]);
		}
	}
	return Counter(count_of_neighbors_arr);
}

function indexOf2d(array2d, itemtofind) {
	let item = String(itemtofind[0]) + String(itemtofind[1]);
    for (let row of array2d) {
		if (item == (String(row[0]) + String(row[1]))) return true;
	}
	return false;
}

function next_generation(world_coord) {
	//console.log(world_coord);
	let world_map = Object.entries(neighbor_counts(world_coord));
	let new_world = [];

	// LIVE CELLS ==> count == 3 OR (count == 2 AND cell in world)
	for (let entry of world_map) { 
		if (entry[1] == 3 || (entry[1] == 2 && indexOf2d(world_coord, entry[0]))) 
			// "0,1" needs to transform to [0, 1]
			new_world.push(entry[0].split(",").map(elem => parseInt(elem)));
	}
	return new_world;
}


function range(start, stop) {
	return new Array(stop - start).fill(start).map((el, i) => el + i)
}


// Diplay grid if world is 2d array with coordinated of live cells
function picture(world, Xs, Ys) {
	let arr2 = [];
	function row(y) {
		let arr = [];
		for (let x of Xs) {
			if (indexOf2d(world, [x, y])) {
				arr.push(LIVE);
			} else {
				arr.push(EMPTY);
			}
		}
		return arr.join(' ');
	}
	for (let y of Ys) arr2.push(row(y))
	return arr2.join('\n');
}


// Diplay grid if world is animated (with '@', '.')
function picture2(world) {
    for (let row of world) {
		let span = document.createElement('span');
		span.innerHTML = row.join(' ');
		gridNode.appendChild(span);
		gridNode.appendChild(document.createElement('br'));
	}
}

function picture_with_coordinates(world) {
	let world1 = [];
	for(let i = 0; i < rows; i++) {
		world1[i] = [];
		for(let j = 0; j < cols; j++) {
			if (indexOf2d(world, [i, j])) {
				world1[i][j] = '@';
			} else {
				world1[i][j] = '.';
			}
		}
	}
	picture2(world1);
}

// console.log(picture(world, range(0, width), range(0, height)));
// console.log(range(0, 5))

function next() {
	let next_world = [];
	gridNode.innerHTML = '';
	next_world = next_generation(world_coord);
	picture_with_coordinates(next_world);
	world_coord = next_world;
}

document.querySelector('#next').addEventListener('click', () => {
	next();
});

let running = null;
document.querySelector('#run').addEventListener('click', () => {
	if (running) {
		clearInterval(running);
		running = null;
	} else {
		running = setInterval(next, 400);
	}
});