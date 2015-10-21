//select a random cell and add to a list

var maze = {
    MAZE_SIZE_X: 10,
    MAZE_SIZE_Y: 10,
    mazeArray: [],
    mazeCopy: [],
    globalCounter: [],
    currentSpot: {},
    backtrace: 1,

    //Helper Functions
    createMaze: function () {
        for (var x = 0; x < this.MAZE_SIZE_X; x++) {
            for (var y = 0; y < this.MAZE_SIZE_Y; y++) {
                this.mazeArray.push({'x': x, 'y': y, 'empty': true, 'removed': false});
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
        for (var i = 0; i < this.mazeCopy.length; i++) {
            if (this.mazeCopy[i].x == x && this.mazeCopy[i].y == y) {
                return false

            }
        }
        return true;
    },
    initializeMaze: function () {
        this.createMaze();
        var initialLocation = this.startMaze();
        this.mazeCopy.push({'x': initialLocation.x, 'y': initialLocation.y, 'empty': false});
    },
    mazeGenerator: function () {
        var neighbor = this.neighborFilter();
        this.currentSpot = {
            'x': this.mazeCopy[this.mazeCopy.length - this.backtrace].x,
            'y': this.mazeCopy[this.mazeCopy.length - this.backtrace].y
        };
        console.log(this.currentSpot);
        if (this.currentSpot.x == 0 || this.currentSpot.y == 0 || this.currentSpot.x == this.MAZE_SIZE_X || this.currentSpot.y == this.MAZE_SIZE_Y) {
            this.backtrace++;
            console.log(this.backtrace);


        }
        if (neighbor != false) {
            if (0 < neighbor.x + this.currentSpot.x || neighbor.x + this.currentSpot.x < this.MAZE_SIZE_X && 0 < neighbor.y + this.currentSpot.y || neighbor.y + this.currentSpot.y < this.MAZE_SIZE_X) {
                if (this.cellOpen(neighbor.x + this.currentSpot.x, neighbor.y + this.currentSpot.y) == true) {
                    this.mazeCopy.push({
                        'x': neighbor.x + this.currentSpot.x,
                        'y': neighbor.y + this.currentSpot.y,
                        'direction': neighbor.direction,
                        'empty': false
                    });
                    for (var i = 0; i < this.mazeArray.length; i++) {
                        if (this.mazeArray[i].x == neighbor.x + this.currentSpot.x && this.mazeArray[i].y == neighbor.y + this.currentSpot.y) {
                            this.mazeArray[i].empty = false;
                        }
                    }
                    this.mazeGenerator();
                }
                else {

                    this.mazeGenerator();
                }
            }
            else {
                this.backtrace++;
                this.mazeGenerator();
            }
        }
        else if (neighbor == false) {
            for (var i = 0; i < this.mazeArray.length; i++) {
                if (this.mazeArray[i].x == this.currentSpot.x && this.mazeArray[i].y == this.currentSpot.y) {
                    this.mazeArray.splice(i, 1);
                }
            }
            this.mazeGenerator();
        }

        if (this.mazeArray.length == 0) {
            return this.mazeCopy;
        }

    }
};

maze.initializeMaze();
maze.mazeGenerator();
console.log(maze.mazeCopy);