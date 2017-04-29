var i = 0;

var container = document.getElementById("container");
container.addEventListener("click", function(e) {
	console.log(`#leaf${i++} { position: absolute;
	left: ${e.clientX-this.offsetLeft}px;
	top: ${e.clientY-this.offsetTop-11}px; 
	width:11px; 
	height:11px;
	animation-name: example;
    animation-duration: 8s;
	animation-fill-mode: forwards;}`);
});
for(var i=0;i<17;i++){
	var image = document.createElement("img");
	//image.src = "/resources/leaf2.svg";
	image.id = `leaf${i}`;
	container.append(image);
}