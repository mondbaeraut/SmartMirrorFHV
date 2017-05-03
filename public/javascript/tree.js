
// Maximum number of leaves
var maxLeaves = 91;
var leafCounter = 0;

var container = document.getElementById("right");

var leafOnTree = 0;
// Helper function for adding leaves to the tree
container.addEventListener("click", function(e) {
	console.log(`#leaf${leafOnTree++} { position: absolute;
	left: ${(e.clientX-11)*100/1600}%;
	top: ${(e.clientY-11)*100/900}%; 
	width:11px; 
	height:11px;}`);
});

// Create all leaf objects and "place" them on the tree
for(var leafOnTree=0;leafOnTree<maxLeaves;leafOnTree++){
	var image = document.createElement("img");
	image.src = "/resources/leaf2.svg";
	image.id = `leaf${leafOnTree}`;
	container.append(image);
}

// Add animation to leaf
function triggerAnimationOnLeaf(leafId){
	document.getElementById(leafId).classList.add('leafFallAnimation');
}

// Remove animation from leaf, setting it to the initial position
function resetLeaf(leafId){
	document.getElementById(leafId).classList.remove('leafFallAnimation');
}

// Reset all leaves at a specified interval
setInterval( function() {
	for (var i = 0; i < maxLeaves; i++){
		resetLeaf("leaf"+i);
	}
	leafCounter = 0;
}, 500000 );

function getNextLeaf() {
	if(leafCounter == maxLeaves) {
		// All leaves have fallen
		return null;
	}
	return "leaf"+leafCounter++;
}

setInterval( function() {triggerAnimationOnLeaf(getNextLeaf())}, 5000);
