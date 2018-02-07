// global state
const eventSourceUrl = "http://localhost:8080/events";
const treeContainerId = "treeContainer";
const chartContainerId = "chart";

let timeoutId;
let currentMode;

start();

// functions
function start() {
    const socket = io();
    socket.on("reset", onReset);
    socket.on("steps", onSteps);
    socket.on("connect", () => console.log("Socket connected."));
    socket.on("disconnect", reason => console.log("Socket disconnected.", reason));
    socket.on("data", data => console.log(data));
    onReset('TREE');
}

function onReset(msg) {
    console.log("Reset", msg);
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    switch (msg) {
        case "CHART":
            currentMode = "CHART";
            document.getElementById(treeContainerId).style.display = "none";
            document.getElementById(chartContainerId).style.display = "block";
            resetChart();
            break;
        case "TREE":
            document.getElementById(treeContainerId).style.display = "block";
            document.getElementById(chartContainerId).style.display = "none";
            currentMode = "TREE";
            timeoutId = treeInit(1000);
            break;
        default:
            console.error("Not a valid reset mode.", e.data);
    }
}

function onSteps(msg) {
    switch (currentMode) {
        case "CHART":
            onStepsChart(msg);
            break;
        case "TREE":
            onStepsTree(msg);
            break;
        default:
            console.error("Not a valid mode.", currentMode);
    }
}
function onStepsChart(msg){
    let stepCount = parseInt(msg);
    updateStepsForChart(stepCount);
}
function onStepsTree(msg) {
    console.log(msg);
    let stepCount = msg.stepsNew;

    let steps = $("#steps");
    steps.empty();
    steps.append(`
                <p class="fade">+${stepCount} Punkte!</p>
            `);

    // Make the leaves rise when new steps incoming
    removeLeaves(stepCount/10);
}