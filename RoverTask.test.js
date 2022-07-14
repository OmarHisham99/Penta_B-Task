
const Rover = require('./RoverTask') ;

test('Moving the Rover',()=>{
    console.log(`Test 1`);
    let rover = new Rover(4,2,"East");
    let commands = "FLFFFRFLB";
    expect(rover.move(commands)).toBe("(6,4) North."); 
})

test('Moving the Rover Forward only',()=>{
    console.log(`Test 2`);
    let rover = new Rover(0,0,"East");
    let commands = "FFFFFFF";
    expect(rover.move(commands)).toBe("(7,0) East."); 
})

test('Moving the Rover Backward only',()=>{
    console.log(`Test 3`);
    let rover = new Rover(0,0,"East");
    let commands = "BBBBBBB";
    expect(rover.move(commands)).toBe("(-7,0) East."); 
})
test('Rotating the Rover to the Right',()=>{
    console.log(`Test 4`);
    let rover = new Rover(0,0,"East");
    let commands = "RRRRRRR";
    expect(rover.move(commands)).toBe("(0,0) North."); 
})
test('Rotating the Rover to the Left',()=>{
    console.log(`Test 5`);
    let rover = new Rover(0,0,"East");
    let commands = "LLLLLL";
    expect(rover.move(commands)).toBe("(0,0) West."); 
})

test('Placing The Rover On Obstacles', () => {
    console.log(`Test 6`); 
    let rover = new Rover(1, 4, "East");
    let commands = "FFF";
    expect(rover.move(commands)).toBe(`(3,0) East.`); 
})

test('Stopping the Rover when it collides with obstacles',()=>{
    console.log(`Test 7`);
    let rover = new Rover(4,2,"East");
    let commands = "FFLFFFRFLB";
    expect(rover.move(commands)).toBe("(7,5) North STOPPED."); 
})

test('Generate Commands for Auto Rover',()=>{
    console.log(`Test 8`);
    let rover = new Rover(4,2,"East");
    let path = rover.safeRoute(6,4); 
    expect(rover.printPath(path)).toBe("LFFRFF"); 
})

test('Generate Commands for Auto Rover 2',()=>{
    console.log(`Test 9`);
    let rover = new Rover(0,0,"West");
    let path = rover.safeRoute(5,10);  
    expect(rover.printPath(path)).toBe("RFFFFFFFFFFRFFFFF"); 
})