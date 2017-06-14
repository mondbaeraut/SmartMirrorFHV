class TrigUtil {
	static adjacentLeg(angle, hypotenuse) {
		return Math.cos(TrigUtil.degToRad(angle)) * hypotenuse;
	}

	static oppositeLeg(angle, hypotenuse) {
		return Math.sin(TrigUtil.degToRad(angle)) * hypotenuse;
	}

	static distance(pointA, pointB) {
		let a = pointA.x - pointB.x;
		let b = pointA.y - pointB.y;
		return Math.sqrt(a * a + b * b);
	}

	static diagonalAngle(width, height) {
		return TrigUtil.radToDeg(Math.atan(width / height));
	}

	static angle(pointA, pointB) {
		let angle = TrigUtil.radToDeg(Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x)) - 270;
		return angle < 0 ? 360 + angle : angle;
	}

	static radToDeg(rad) {
		return rad * 180 / Math.PI;
	}

	static degToRad(deg) {
		return deg / 180 * Math.PI;
	}
}

class LeafDrawer {
	constructor(container, mouseTarget, leafDimensions) {
		this.container = container;
		mouseTarget.addEventListener("mousedown", e => this.onMousedown(e));
		mouseTarget.addEventListener("mousemove", e => this.onMousemove(e));
		mouseTarget.addEventListener("mouseup", e => this.onMouseup(e));
		this.leafDiagonalAngle = TrigUtil.diagonalAngle(leafDimensions.width, leafDimensions.height);
	}

	static get leafClass() {
		return "leaf";
	}

	static createNewLeaf() {
		let leaf = new Image();
		leaf.src = "resources/leaf.svg";
		leaf.classList.add(LeafDrawer.leafClass);
		leaf.style.width = 0;
		leaf.style.height = 0;
		leaf.addEventListener("mouseup", e => console.log(e));
		return leaf;
	}

	onMousedown(e) {
		this.mouseIsPressed = true;
		this.start = LeafDrawer.getPointInContainer(e);
		this.leaf = LeafDrawer.createNewLeaf();
		this.container.appendChild(this.leaf);
	}

	onMousemove(e) {
		if (this.mouseIsPressed) {
			let current = LeafDrawer.getPointInContainer(e);

			let alpha = TrigUtil.angle(this.start, current);
			let rotation = alpha - this.leafDiagonalAngle;
			let hypotenuse = TrigUtil.distance(this.start, current);
			let width = TrigUtil.oppositeLeg(this.leafDiagonalAngle, hypotenuse);
			let height = TrigUtil.adjacentLeg(this.leafDiagonalAngle, hypotenuse);

			this.leaf.style.left = this.start.x + "px";
			this.leaf.style.top = this.start.y - height + "px";
			this.leaf.style.transform = "rotate(" + rotation + "deg)";
			this.leaf.style.width = width + "px";
			this.leaf.style.height = height + "px";
		}
	}

	onMouseup(e) {
		this.mouseIsPressed = false;
		let current = LeafDrawer.getPointInContainer(e);
		if (this.start.x === current.x && this.start.y === current.y) {
			this.removeTempLeaf();
			this.tryRemoveClickedLeaf(e);
			LeafDrawer.outputStyleArray();
		}
	}

	static outputStyleArray() {
		let leaves = document.getElementsByClassName(LeafDrawer.leafClass);
		let leavesArray = Array.prototype.slice.call(leaves);
		let styles = leavesArray.map(leaf => {
			return {
				top: leaf.style.top,
				left: leaf.style.left,
				transform: leaf.style.transform,
				width: leaf.style.width,
				height: leaf.style.height
			};
		});
		console.log(styles);
	}

	removeTempLeaf() {
		this.leaf.parentNode.removeChild(this.leaf);
	}

	tryRemoveClickedLeaf(e) {
		let elements = document.elementsFromPoint(e.clientX, e.clientY);
		let leaf = elements.find(el => el.classList.contains(LeafDrawer.leafClass));
		if (leaf) {
			leaf.parentNode.removeChild(leaf);
		}
	}

	static getPointInContainer(e) {
		console.log(e);
		return {
			x: e.offsetX,
			y: e.offsetY
		};
	}
}

class LeafInitializer {
	constructor(styles, container) {
		styles.forEach(style => {
			let leaf = new Image();
			leaf.src = "resources/leaf.svg";
			leaf.originalStyle = style;				
			leaf.classList.add("leaf");
			leaf.style.top = style.top;
			leaf.style.left = style.left;
			leaf.style.transform = style.transform;
			leaf.style.width = style.width;
			leaf.style.height = style.height;
			container.appendChild(leaf);
		});
	}
}

class AppleInitializer {
	constructor(styles, container) {
		styles.forEach(style => {
			let apple = new Image();
			apple.src = "resources/apple.svg";
			apple.originalStyle = style;				
			apple.classList.add("apple");
			apple.style.top = style.top;
			apple.style.left = style.left;
			container.appendChild(apple);
		});
	}
}

let container = document.getElementById("right");
let overlay = document.getElementById("overlay");
let leafDimensions = {width: 49, height: 71};
new LeafDrawer(container, overlay, leafDimensions);

fetch("/resources/leaves.json")
	.then(response => response.json())
	.then(stylesJson => new LeafInitializer(stylesJson, container));

fetch("/resources/apples.json")
    .then(response => response.json())
    .then(stylesJson => new AppleInitializer(stylesJson, container));

function rand(min, max) {
	return Math.random() * (max - min) + min;
}

setInterval( function() {
	let apples = document.querySelectorAll(".apple:not(.appleFallAnimation)");
	if (apples.length > 0) {
		let i = Math.floor(rand(0, apples.length));
		apples[i].classList.remove("appleReappearAnimation");
		apples[i].classList.add("appleFallAnimation");
	} else {	
		let leaves = document.querySelectorAll(".leaf:not(.leafFallAnimation)");
		if(leaves.length > 0) {
			let i = Math.round(rand(0, leaves.length));
			leaves[i].classList.remove("leafReappearAnimation");
			leaves[i].classList.add("leafFallAnimation");
		}
	}
}, 10000);

function removeLeaves(percentageToRemove) {
	let totalLeaves = document.querySelectorAll(".leaf");
	console.log(totalLeaves.length);
	let numberOfLeavesToRemove = Math.round((percentageToRemove/100) * totalLeaves.length);
	console.log(numberOfLeavesToRemove);
	
	// Check if apples should also reappear on the tree
	let fallenLeaves = document.querySelectorAll(".leaf.leafFallAnimation");
	let percentageOfLeavesAlreadyDown = (fallenLeaves.length * 100) / (totalLeaves.length);
	console.log("Percentage of leaves already down: " + percentageOfLeavesAlreadyDown);
	if(percentageOfLeavesAlreadyDown<=15) {
		// Put apples back on tree
		let fallenApples = document.querySelectorAll(".apple.appleFallAnimation");
		
		for(i = 0; i < fallenApples.length; i++){
			let fallenApple = fallenApples[i];
			fallenApple.classList.remove("appleFallAnimation");
			fallenApple.classList.add("appleReappearAnimation");
		}
	}
	
	var i;
	for(i=0; i < numberOfLeavesToRemove; i++){		
		let leaves = document.querySelectorAll(".leaf.leafFallAnimation");
		let i = Math.round(rand(0, leaves.length));
		let leaf = leaves[i];
		let style = leaf.originalStyle;
		leaf.style.transform = "scale(0)";
		leaf.classList.remove("leafFallAnimation");
		leaf.style.top = style.top;
		leaf.style.left = style.left;
		leaf.style.transform = style.transform;
		leaf.style.width = style.width;
		leaf.style.height = style.height;
		leaf.classList.add("leafReappearAnimation");
	}
}