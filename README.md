# Penta_B-Task

##Table of Contents 

*[Guide] (#Guide)

##Guide
- Open the Terminal and run "npm test" to test all Rover Functionalities automatically. 

- If you want to test the Program manually you can write the following before running command "node RoverTask.js" in the terminal:
 - For the First Part and Second Part you can paste the following code :
    - let rover = new Rover(X,Y,"direction") //where X and Y are the cordinations of the start point and direction is the way the Rover will move.
    - let commands = "Your Command"  // where Your command is the command you want the rover to simulate.  
    - console.log(rover.move(commands))  //send your commands to move function., if the route is all clear then it will not stop, if there is an obstacle it will stop. 
 
 - For the Third Part You can paste the following code: 
    - let rover = new Rover(X,Y,"direction") //where X and Y are the cordinations of the start point and direction is the way the Rover will move.
    - let path = safeRoute(endX,endY)    // where endX and endY are the cordinaitons of the destination point. 
    - console.log(printPath(path))    // it will log the output in the terminal. 
 
 
