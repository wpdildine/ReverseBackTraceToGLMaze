//select a random cell and add to a list

var maze = {
    MAZE_SIZE_X: 10,
    MAZE_SIZE_Y: 10,
    mazeCells: [],
    mazePath: [],
    mazeCopy: [],
    globalCounter: [],
    backtrace: 1,

    //Helper Functions
    createMaze: function () {
        for (var x = 0; x < this.MAZE_SIZE_X; x++) {
            for (var y = 0; y < this.MAZE_SIZE_Y; y++) {
                this.mazeCells.push({'x': x, 'y': y, 'empty': true, 'removed': false});
            }
        }
    },

    //this chooses a random starting cell
    startMaze: function () {
        var randomX = Math.round(this.MAZE_SIZE_X * Math.random());
        var randomY = Math.round(this.MAZE_SIZE_Y * Math.random());
        return {'x': randomX, 'y': randomY};
    },

    //chooses a neighboring cell at random
    selectNeighbor: function () {
        var neighborX = Math.ceil(Math.random() * 3) - 2;
        var neighborY = 3;
        var dir;

        if (neighborX == 0) {
            var notZero = Math.ceil(Math.random() * 3) - 2;
            while (notZero === 0) {
                notZero = Math.ceil(Math.random() * 3) - 2;
            }
            neighborY = notZero;
        }
        else {
            neighborY = 0;
        }
        if (neighborX == 0 && neighborY == 1) {
            dir = 'N'
        }
        else if (neighborX == 0 && neighborY == -1) {
            dir = 'S'
        }
        else if (neighborX == 1 && neighborY == 0) {
            dir = 'E'
        }
        else if (neighborX == -1 && neighborY == 0) {
            dir = 'W'
        }
        return {'x': neighborX, 'y': neighborY, 'direction': dir};
    },

    //this function will select a neighbor
    neighborFilter: function () {
        var value = this.selectNeighbor();

        if (this.globalCounter.indexOf('N') != -1 && this.globalCounter.indexOf('S') != -1 && this.globalCounter.indexOf('E') != -1 && this.globalCounter.indexOf('W') != -1) {
            this.globalCounter = [];
            return false;
        }
        else {
            if (value.direction === 'N') {
                this.globalCounter.push('N');
                return value;
            }
            if (value.direction === 'S') {
                this.globalCounter.push('S');
                return value;
            }

            if (value.direction === 'E') {
                this.globalCounter.push('E');
                return value;
            }

            if (value.direction === 'W') {
                this.globalCounter.push('W');
                return value;
            }
        }
    },

    cellOpen: function (x, y) {
        for (var i = 0; i < this.mazeCells.length; i++) {
            if (this.mazeCells[i].x == x && this.mazeCells[i].y == y) {
                this.mazeCells.splice(i, 1);
                return true
            }
        }
        return false;
    },

    initializeMaze: function () {
        this.createMaze();
        var initialLocation = this.startMaze();

        this.mazePath.push({'x': initialLocation.x, 'y': initialLocation.y});
        for (var i = 0; i < this.mazeCells.length; i++) {
            if (this.mazeCells[i].x == initialLocation.x && this.mazeCells[i].y == initialLocation.y) {
                this.mazeCells.splice(i, 1);
            }
        }
        this.mazeCopy = this.mazePath.slice();
    },

    mazeGenerator: function () {
        //select a neighboring cell
        var neighbor = this.neighborFilter();
        var testingSpot = {};
        var currentSpot;

        if (neighbor == false) {
            this.mazeCopy.pop();
            this.mazeGenerator();
        }
        if (this.mazeCopy[this.mazeCopy.length - 1] == undefined){
            return this.mazePath;
        }

        //finds current spot
        currentSpot = {
            'x': this.mazeCopy[this.mazeCopy.length - 1].x,
            'y': this.mazeCopy[this.mazeCopy.length - 1].y
        };

        testingSpot.x = neighbor.x + currentSpot.x;
        testingSpot.y = neighbor.y + currentSpot.y;

        if (0 >= testingSpot.x || testingSpot.x >= this.MAZE_SIZE_X || 0 >= testingSpot.y || testingSpot.y >= this.MAZE_SIZE_Y) {
            this.mazeGenerator();
        }
        if (this.cellOpen(testingSpot.x, testingSpot.y) == true) {
            this.mazePath.push({
                'x': testingSpot.x,
                'y': testingSpot.y,
                'direction': neighbor.direction
            });
            this.mazeCopy = this.mazePath.slice();
            this.globalCounter = [];
            this.mazeGenerator();
        }
        else {
            this.mazeGenerator();
        }
    }
};

maze.initializeMaze();
maze.mazeGenerator();
console.log(maze.mazeGenerator());