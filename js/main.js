const mainCanvas = document.getElementById('mainCanvas');
mainCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;

const mainCtx = mainCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(mainCanvas.width/2, mainCanvas.width * 0.9);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if (i!== 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1)
        }
    }
}


const traffic =  [
    new Car(road.getLaneCenter(1),-100,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(2),-300,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(0),-300,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1),-500,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(1),-500,30,50, "DUMMY", 0.5),
    new Car(road.getLaneCenter(2),-700,30,50, "DUMMY", 0.5),
];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), 100,30,50, "AI")
        );
    }
    return cars;
}

function animate(time){
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y === Math.min(
            ...cars.map(c => c.y)
        )
    );
    
    mainCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    mainCtx.save();
    mainCtx.translate(0, -bestCar.y + mainCanvas.height * 0.7);
    road.draw(mainCtx);

    for (let i = 0;i < traffic.length; i++) {
        traffic[i].draw(mainCtx, "green");
    }
    mainCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(mainCtx, "blue");
    }
    mainCtx.globalAlpha = 1;
    bestCar.draw(mainCtx,"blue", true);

    mainCtx.restore();
    networkCtx.lineDashOffset = - time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
