// global state
const eventSourceUrl = "http://localhost:8080/events";
const treeContainerId = "treeContainer";
const chartContainerId = "chart";

let timeoutId;
let currentMode;

start();

// functions
function start() {
    let eventSource = new EventSource(eventSourceUrl);
    eventSource.addEventListener("reset", onReset);
    eventSource.addEventListener("steps", onSteps);
}

function onReset(e) {
    console.log("Reset", e.data);
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    switch (e.data) {
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

function onSteps(e) {
    switch (currentMode) {
        case "CHART":
            onStepsChart(e);
            break;
        case "TREE":
            onStepsTree(e);
            break;
        default:
            console.error("Not a valid mode.", currentMode);
    }
}
function onStepsChart(e){
    let stepCount = parseInt(e.data);
    updateStepsForChart(stepCount);
}
function onStepsTree(e) {
    let stepCount = parseInt(e.data);

    let steps = $("#steps");
    steps.empty();
    steps.append(`
                <p class="fade">+${stepCount} Punkte!</p>
            `);

    // Make the leaves rise when new steps incoming
    removeLeaves(stepCount/10);
}