const { set } = require("express/lib/application");

//this Dictionary avoids using if conditoins, it has static values for each Direction on X and Y
const advance = {
    F: { North: { x: 0, y: 1 }, East: { x: 1, y: 0 }, South: { x: 0, y: -1 }, West: { x: -1, y: 0 } },
    B: { North: { x: 0, y: -1 }, East: { x: -1, y: 0 }, South: { x: 0, y: 1 }, West: { x: 1, y: 0 } },
};

//constructing commands to reduce if conditions in code. 
const constructCommand = {
    East: {1: "F", 0:{1: "LF", _1:"RF"}},
    North:{1: "F", 0:{1:"RF", _1:"LF"}}, 
    West: {1:"F", 0:{1:"RF", _1:"LF"}}, 
    South:{1:"F", 0:{1:"RF",_1:"LF"}}
};
// this Dictionary has fixed values for rotations if R it will increase by 1, if L it will increse by -1
const rotate = {
    R: 1,
    L: -1
};
// each Direction will have a number represents it to help reducing Conditions.     
const Directions = {
    North: 1,
    East: 2,
    South: 3,
    West: 4,
};
// way has all points with their parents to use in path construction. 
let way =[] ; 

//obstacles positions 
const Obstacles = [[1, 4], [3, 5], [7, 4]];
// Class Rover has data about the rover "Cordinations" and "Direction"        
const Rover = class {
    #x;
    #y;
    #direction;
    #directionNumber;
    // Constructor initialize the Rover with the start cordinations and start direction
    constructor(x, y, direction) {
        // check if placing the rover is valid. 
        let goodPlace = true;
        for (let obstacle of Obstacles) {
            if (x === obstacle[0] && y === obstacle[1])
                goodPlace = false;

        }
        // if the position is valid it will be placed successfully. 
        if (goodPlace) {
            this.#x = x;
            this.#y = y;
            this.#direction = direction;
            this.#directionNumber = Directions[direction];
            console.log(`The Rover Is Placed Successfully.`);
        }
        // if it isn't a valid postion, it will be redirected to the origin. 
        else {
            this.#x = 0;
            this.#y = 0;
            this.#direction = 'East';
            this.#directionNumber = Directions[this.#direction];
            console.log(`The Rover Can't Be Placed Here. The Rover Will Be Redirected To The Origin:(0,0) East.`);
        }

    }

    //move function take the commands and start applying them by moving the Rover and changing it's cordintaions.  
    move(commands) {
        for (let command of commands) {
            //checks if the commands are rotations or not, if true it will change the direction based on the rotation. 
            if (command === "L" || command === "R") {
                this.#directionNumber += rotate[command]
                //if the direction is bigger than 4 (West) then it will return to 1 (North).  
                if (this.#directionNumber > 4) this.#directionNumber = 1;

                //if the direction is equal 0 then it will return to 4 (West).
                else if (this.#directionNumber === 0) this.#directionNumber = 4;

                //find the direction name in the object by its value.  
                this.#direction = Object.keys(Directions).find(key => Directions[key] === this.#directionNumber);
                continue;
            }
            //moving the Rover based on command F and B on X and Y. 
            //check if it is valid position to move. 
            if (this.isValidPostion(this.#x, this.#y, command)) {
                this.#x += advance[command][this.#direction]['x'];
                this.#y += advance[command][this.#direction]['y'];
            }
            //if it isn't valid position then stop the rover and show the position it stopped at. 
            else {
                console.log(`(${this.#x},${this.#y}) ${this.#direction} STOPPED.`);
                return `(${this.#x},${this.#y}) ${this.#direction} STOPPED.`;
            }
        }
        // all commands are done. show the rover's postion.
        console.log(`(${this.#x},${this.#y}) ${this.#direction}.`);
        return `(${this.#x},${this.#y}) ${this.#direction}.`;
    }

    //position validation based on obstacles positions 
    isValidPostion(x, y, command) {
        x += advance[command][this.#direction]['x'];
        y += advance[command][this.#direction]['y'];
        for (let obstacle of Obstacles) {
            if (x === obstacle[0] && y === obstacle[1])
                return false
        }
        return true;
    }

    
    // search for the Best route to Avoid Obstacles using BFS.  
    safeRoute(endX,endY){
        //determine searching directions. 
        const directions =[[0,1],[1,0],[0,-1],[-1,0]]; 
        let queue = []  
        queue.push([this.#x,this.#y,[]]); 
        //visited points On mars. 
        const visited = [];
        visited.push([this.#x,this.#y]); 
        //start calculating the route. 
        while(queue.length!=0){
            let currentLocation = queue[0];
            way.push(currentLocation);  
            queue.shift();  
            let row = currentLocation[0] ; let col =currentLocation[1]; 

            //if route end point found stop searching.
            if(row === endX && col ===endY){
                return  currentLocation; 
            } 
            //check if the point is valid or not. 
            if(Obstacles.find(element=> element[0]===row && element[1]===col)){
                continue; 
            }
            //add all adjacent points to the queue to search them. 
            for(let direction of directions){
                let nr = row+direction[0]; 
                let nc = col+direction[1];  
                if(!visited.find(element=>element[0]===nr && element[1]===nc)){
                    //all points have parent to keep track to them. 
                    queue.push([nr,nc,[row,col]]); 
                    visited.push([nr,nc]); 
                }
            }
        }
        return -1; 
    }

    //print the path. 
    printPath(path) {
        let paths = [[path[0],path[1]]]; 
        let parent = path[2];
        //command string 
        let route = "" ;  
        let x_axis = true ; 
        let y_axis = false; 
        let dir = this.#direction; 
        //track every point with its parent, and add them to paths array that have the best route. 
        while(true) { 
           if(parent.length===0) break; 
           let newPath = way.find(element=>element[0] === parent[0] && element[1] === parent[1]); 
           paths.push([newPath[0],newPath[1]]); 
           parent = newPath[2]; 
        }
        //constructing the command here. 
        for(let p = paths.length-1 ; p>0;p--) {
            if(paths[p-1][0] - paths[p][0]===1 && x_axis === true){
                route+=constructCommand[dir][1]; 
            }
            else if(paths[p-1][0]-paths[p][0]===0 && y_axis===false ){
                route+= paths[p-1][1] - paths[p][1] === 1 ? constructCommand[dir][0]['1'] : constructCommand[dir][0]['_1'];  
                dir = paths[p-1][1] - paths[p][1] === 1 ? "North" : "South" ;
                y_axis = true;  
                x_axis = false ;
            }
            else if(paths[p-1][1] - paths[p][1] === 1){
                route+=constructCommand[dir][1];
            } 
            else if(paths[p-1][1] - paths[p][1] === 0 &&  x_axis === false ){
                route += paths[p-1][0] - paths[p][0] === 1 ? constructCommand[dir][0]['1'] : constructCommand[dir][0]['_1']; 
                dir = paths[p-1][0] - paths[p][0] === 1 ? "East" : "West";
                y_axis = false ;
                x_axis = true ;  
            } 
        }
        return route; 
    }

     
}

module.exports = Rover;

// let rover = new Rover(0,0,"West");
// let path = rover.safeRoute(5,10);  
// console.log(rover.printPath(path)); 