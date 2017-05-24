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
		return {
			x: e.offsetX,
			y: e.offsetY
		};
	}
}

class LeafInitializer {
	constructor(stylesJson, container) {
		let styles = JSON.parse(stylesJson);
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

let container = document.getElementById("right");
let overlay = document.getElementById("overlay");
let leafDimensions = {width: 49, height: 71};
new LeafDrawer(container, overlay, leafDimensions);

let stylesJson = '[{"top":"120.734px","left":"942px","transform":"rotate(17.6421deg)","width":"22.2684px","height":"32.2664px"},{"top":"97.8568px","left":"953px","transform":"rotate(-62.7897deg)","width":"18.0425px","height":"26.1432px"},{"top":"84.2333px","left":"970px","transform":"rotate(68.7814deg)","width":"12.2615px","height":"17.7667px"},{"top":"57.3409px","left":"944px","transform":"rotate(-37.6239deg)","width":"10.807px","height":"15.6591px"},{"top":"59.0436px","left":"926px","transform":"rotate(-110.077deg)","width":"15.8431px","height":"22.9564px"},{"top":"101.005px","left":"901px","transform":"rotate(-102.445deg)","width":"16.56px","height":"23.9951px"},{"top":"125.721px","left":"916px","transform":"rotate(-26.481deg)","width":"16.0656px","height":"23.2787px"},{"top":"89.3607px","left":"907px","transform":"rotate(-42.7412deg)","width":"8.03279px","height":"11.6393px"},{"top":"120.683px","left":"909px","transform":"rotate(-85.7813deg)","width":"29.8945px","height":"43.3165px"},{"top":"143.579px","left":"873px","transform":"rotate(-114.685deg)","width":"23.0654px","height":"33.4213px"},{"top":"172.637px","left":"896px","transform":"rotate(22.5603deg)","width":"20.9546px","height":"30.3629px"},{"top":"156.786px","left":"935px","transform":"rotate(-44.4769deg)","width":"13.2602px","height":"19.2137px"},{"top":"127.682px","left":"865px","transform":"rotate(-58.5736deg)","width":"16.7826px","height":"24.3176px"},{"top":"115.906px","left":"817px","transform":"rotate(-42.4645deg)","width":"16.6281px","height":"24.0937px"},{"top":"138.26px","left":"802px","transform":"rotate(-90.9211deg)","width":"16.3837px","height":"23.7397px"},{"top":"157.271px","left":"824px","transform":"rotate(-26.9151deg)","width":"21.2072px","height":"30.7288px"},{"top":"150.75px","left":"814px","transform":"rotate(-96.0007deg)","width":"28.4683px","height":"41.2499px"},{"top":"194.371px","left":"794px","transform":"rotate(-118.441deg)","width":"21.1386px","height":"30.6294px"},{"top":"210.345px","left":"827px","transform":"rotate(-2.13995deg)","width":"37.0293px","height":"53.6547px"},{"top":"208.794px","left":"880px","transform":"rotate(0.700071deg)","width":"16.7055px","height":"24.2059px"},{"top":"239.721px","left":"922px","transform":"rotate(10.3889deg)","width":"16.0656px","height":"23.2787px"},{"top":"251.466px","left":"937px","transform":"rotate(-1.37943deg)","width":"19.6926px","height":"28.5342px"},{"top":"234.672px","left":"895px","transform":"rotate(-48.6474deg)","width":"25.7613px","height":"37.3277px"},{"top":"260.034px","left":"868px","transform":"rotate(-113.301deg)","width":"28.9626px","height":"41.9663px"},{"top":"270.423px","left":"907px","transform":"rotate(197.155deg)","width":"23.8629px","height":"34.5769px"},{"top":"305.92px","left":"835px","transform":"rotate(196.729deg)","width":"14.548px","height":"21.0797px"},{"top":"99.3719px","left":"1007px","transform":"rotate(56.4698deg)","width":"30.1096px","height":"43.6281px"},{"top":"101.628px","left":"999px","transform":"rotate(-22.3464deg)","width":"13.3692px","height":"19.3717px"},{"top":"64.4658px","left":"1040px","transform":"rotate(22.1571deg)","width":"19.6926px","height":"28.5342px"},{"top":"84.9979px","left":"1080px","transform":"rotate(50.4191deg)","width":"26.2268px","height":"38.0021px"},{"top":"143.464px","left":"1110px","transform":"rotate(40.1337deg)","width":"25.905px","height":"37.5358px"},{"top":"142.541px","left":"1082px","transform":"rotate(-42.7412deg)","width":"12.0492px","height":"17.459px"},{"top":"147.17px","left":"1089px","transform":"rotate(24.7382deg)","width":"17.8266px","height":"25.8304px"},{"top":"106.741px","left":"1120px","transform":"rotate(26.5023deg)","width":"18.8128px","height":"27.2594px"},{"top":"61.0533px","left":"1072px","transform":"rotate(-19.7847deg)","width":"19.9773px","height":"28.9467px"},{"top":"41.7863px","left":"1042px","transform":"rotate(-81.3468deg)","width":"13.2602px","height":"19.2137px"},{"top":"48.6113px","left":"1005px","transform":"rotate(-70.6385deg)","width":"15.4514px","height":"22.3887px"},{"top":"66.0127px","left":"1021px","transform":"rotate(-23.6571deg)","width":"17.9349px","height":"25.9873px"},{"top":"154.253px","left":"986px","transform":"rotate(-58.2405deg)","width":"19.8395px","height":"28.7471px"},{"top":"172.643px","left":"1003px","transform":"rotate(24.2296deg)","width":"28.5418px","height":"41.3565px"},{"top":"190.866px","left":"1026px","transform":"rotate(59.0802deg)","width":"35.2895px","height":"51.1337px"},{"top":"236.267px","left":"1105px","transform":"rotate(40.7125deg)","width":"24.6608px","height":"35.733px"},{"top":"211.486px","left":"1123px","transform":"rotate(-34.6111deg)","width":"17.6081px","height":"25.5138px"},{"top":"281.53px","left":"1055px","transform":"rotate(-14.9573deg)","width":"16.888px","height":"24.4703px"},{"top":"273.066px","left":"1042px","transform":"rotate(-48.6474deg)","width":"23.4194px","height":"33.9342px"},{"top":"268.549px","left":"1071px","transform":"rotate(54.3279deg)","width":"30.6775px","height":"44.451px"},{"top":"258.554px","left":"1122px","transform":"rotate(48.9058deg)","width":"25.153px","height":"36.4462px"},{"top":"244.502px","left":"1175px","transform":"rotate(14.2029deg)","width":"12.0759px","height":"17.4978px"},{"top":"230.179px","left":"1158px","transform":"rotate(13.7553deg)","width":"13.6793px","height":"19.8211px"},{"top":"157.816px","left":"1171px","transform":"rotate(-8.74479deg)","width":"20.8311px","height":"30.1839px"},{"top":"138.437px","left":"1148px","transform":"rotate(-12.3621deg)","width":"13.5013px","height":"19.5631px"},{"top":"195.105px","left":"983px","transform":"rotate(-32.1216deg)","width":"26.1529px","height":"37.895px"},{"top":"285.908px","left":"932px","transform":"rotate(-29.5687deg)","width":"19.3872px","height":"28.0916px"},{"top":"290.647px","left":"925px","transform":"rotate(-112.843deg)","width":"27.8496px","height":"40.3535px"},{"top":"306.058px","left":"913px","transform":"rotate(219.443deg)","width":"28.9459px","height":"41.942px"},{"top":"345.928px","left":"915px","transform":"rotate(-15.0745deg)","width":"18.6838px","height":"27.0724px"},{"top":"353.306px","left":"890px","transform":"rotate(-102.305deg)","width":"23.9439px","height":"34.6942px"},{"top":"357.679px","left":"890px","transform":"rotate(213.587deg)","width":"30.5879px","height":"44.3213px"},{"top":"376.857px","left":"818px","transform":"rotate(-96.4326deg)","width":"18.0425px","height":"26.1432px"},{"top":"352.17px","left":"834px","transform":"rotate(-65.2618deg)","width":"17.8266px","height":"25.8304px"},{"top":"310.204px","left":"783px","transform":"rotate(-82.1007deg)","width":"18.4929px","height":"26.7958px"},{"top":"241.147px","left":"782px","transform":"rotate(-100.908deg)","width":"25.4336px","height":"36.8528px"},{"top":"223.359px","left":"764px","transform":"rotate(-58.1097deg)","width":"14.2455px","height":"20.6414px"},{"top":"230.969px","left":"794px","transform":"rotate(-31.2447deg)","width":"19.3455px","height":"28.0313px"},{"top":"161.213px","left":"836px","transform":"rotate(38.1074deg)","width":"26.7686px","height":"38.7871px"},{"top":"145.504px","left":"1065px","transform":"rotate(52.2948deg)","width":"21.0468px","height":"30.4964px"},{"top":"171.589px","left":"1060px","transform":"rotate(73.3168deg)","width":"20.2977px","height":"29.4109px"},{"top":"195.236px","left":"1161px","transform":"rotate(43.4127deg)","width":"19.1612px","height":"27.7642px"},{"top":"195.196px","left":"1151px","transform":"rotate(-11.4126deg)","width":"12.9774px","height":"18.8039px"},{"top":"215.46px","left":"1181px","transform":"rotate(57.7748deg)","width":"27.2878px","height":"39.5395px"},{"top":"241.223px","left":"1193px","transform":"rotate(83.8845deg)","width":"22.6205px","height":"32.7767px"},{"top":"234.691px","left":"1223px","transform":"rotate(19.135deg)","width":"10.5655px","height":"15.3092px"},{"top":"264.953px","left":"1168px","transform":"rotate(58.7553deg)","width":"29.0183px","height":"42.0469px"},{"top":"300.495px","left":"1156px","transform":"rotate(101.328deg)","width":"24.5033px","height":"35.5048px"},{"top":"348.033px","left":"1130px","transform":"rotate(184.483deg)","width":"11.7097px","height":"16.9671px"},{"top":"310.702px","left":"1124px","transform":"rotate(215.253deg)","width":"18.1495px","height":"26.2982px"},{"top":"304.205px","left":"1061px","transform":"rotate(82.3691deg)","width":"35.0555px","height":"50.7948px"},{"top":"306.272px","left":"1043px","transform":"rotate(42.2163deg)","width":"27.4176px","height":"39.7275px"},{"top":"320.451px","left":"1031px","transform":"rotate(132.514deg)","width":"20.3928px","height":"29.5488px"},{"top":"386.04px","left":"1045px","transform":"rotate(86.6526deg)","width":"18.6059px","height":"26.9596px"},{"top":"373.974px","left":"1094px","transform":"rotate(86.173deg)","width":"31.0745px","height":"45.0264px"},{"top":"292.816px","left":"1009px","transform":"rotate(29.5225deg)","width":"20.8311px","height":"30.1839px"},{"top":"234.74px","left":"1092px","transform":"rotate(-2.41541deg)","width":"18.1228px","height":"26.2596px"},{"top":"142.38px","left":"1024px","transform":"rotate(-85.9513deg)","width":"21.822px","height":"31.6196px"},{"top":"99.1285px","left":"1007px","transform":"rotate(-7.26127deg)","width":"18.5451px","height":"26.8715px"},{"top":"100.782px","left":"984px","transform":"rotate(13.4016deg)","width":"22.9251px","height":"33.218px"},{"top":"102.296px","left":"943px","transform":"rotate(-78.1423deg)","width":"15.6691px","height":"22.7042px"},{"top":"80.2459px","left":"864px","transform":"rotate(-33.214deg)","width":"23.2951px","height":"33.7541px"},{"top":"109.95px","left":"840px","transform":"rotate(-58.8389deg)","width":"12.4573px","height":"18.0504px"},{"top":"134.23px","left":"841px","transform":"rotate(-79.6111deg)","width":"18.4754px","height":"26.7705px"},{"top":"168.863px","left":"785px","transform":"rotate(-111.807deg)","width":"25.6295px","height":"37.1366px"},{"top":"198.714px","left":"919px","transform":"rotate(28.8238deg)","width":"21.5916px","height":"31.2858px"},{"top":"206.209px","left":"905px","transform":"rotate(-45.4967deg)","width":"15.0387px","height":"21.7908px"},{"top":"145.67px","left":"1027px","transform":"rotate(-14.3863deg)","width":"23.0024px","height":"33.33px"},{"top":"49.1815px","left":"973px","transform":"rotate(-24.4865deg)","width":"32.3114px","height":"46.8185px"},{"top":"71.0414px","left":"950px","transform":"rotate(-13.6866deg)","width":"20.6757px","height":"29.9586px"},{"top":"203.094px","left":"1103px","transform":"rotate(-27.4861deg)","width":"13.7382px","height":"19.9063px"},{"top":"140.885px","left":"1155px","transform":"rotate(42.8601deg)","width":"36.6572px","height":"53.1155px"},{"top":"132.969px","left":"1174px","transform":"rotate(5.62522deg)","width":"19.3455px","height":"28.0313px"},{"top":"85.3965px","left":"1122px","transform":"rotate(-16.8665deg)","width":"14.9094px","height":"21.6035px"},{"top":"72.6205px","left":"1100px","transform":"rotate(-51.4695deg)","width":"19.5858px","height":"28.3795px"},{"top":"75.4971px","left":"1071px","transform":"rotate(32.4001deg)","width":"20.3612px","height":"29.5029px"},{"top":"326.228px","left":"953px","transform":"rotate(179.079deg)","width":"14.3358px","height":"20.7722px"},{"top":"357.236px","left":"941px","transform":"rotate(157.365deg)","width":"19.1612px","height":"27.7642px"},{"top":"367.041px","left":"923px","transform":"rotate(166.313deg)","width":"20.6757px","height":"29.9586px"},{"top":"306.327px","left":"800px","transform":"rotate(169.956deg)","width":"21.8589px","height":"31.6731px"},{"top":"280.455px","left":"807px","transform":"rotate(-98.6078deg)","width":"25.9112px","height":"37.5448px"},{"top":"252.716px","left":"811px","transform":"rotate(-42.977deg)","width":"19.5198px","height":"28.2838px"},{"top":"219.232px","left":"866px","transform":"rotate(-17.645deg)","width":"35.0371px","height":"50.7681px"},{"top":"156.489px","left":"886px","transform":"rotate(-62.2571deg)","width":"13.4654px","height":"19.5111px"},{"top":"130.45px","left":"895px","transform":"rotate(210.244deg)","width":"30.7457px","height":"44.55px"},{"top":"157.325px","left":"929px","transform":"rotate(-37.791deg)","width":"20.4797px","height":"29.6746px"},{"top":"161.705px","left":"951px","transform":"rotate(-43.2637deg)","width":"26.429px","height":"38.295px"},{"top":"164.79px","left":"1007px","transform":"rotate(-38.0794deg)","width":"18.7785px","height":"27.2097px"},{"top":"90.8228px","left":"1047px","transform":"rotate(-64.356deg)","width":"22.897px","height":"33.1772px"},{"top":"111.367px","left":"1057px","transform":"rotate(7.7863deg)","width":"17.6904px","height":"25.633px"}]';//'[{"top":"192.277px","left":"937px","transform":"rotate(-5.92499deg)","width":"34.3161px","height":"49.7233px"},{"top":"165.708px","left":"1059px","transform":"rotate(22.4566deg)","width":"59.5538px","height":"86.2922px"},{"top":"290.814px","left":"1012px","transform":"rotate(44.7285deg)","width":"49.1282px","height":"71.1858px"},{"top":"40.0503px","left":"971px","transform":"rotate(20.0917deg)","width":"78.6414px","height":"113.95px"}]';//'[{"top":"33.3955px","left":"642px","transform":"rotate(-16.9107deg)","width":"28.0228px","height":"40.6045px"},{"top":"30.9498px","left":"558px","transform":"rotate(-25.1488deg)","width":"27.6403px","height":"40.0502px"},{"top":"150.272px","left":"713px","transform":"rotate(15.4313deg)","width":"27.4176px","height":"39.7275px"},{"top":"239.646px","left":"741px","transform":"rotate(42.2548deg)","width":"17.4978px","height":"25.354px"},{"top":"266.118px","left":"678px","transform":"rotate(111.173deg)","width":"17.1721px","height":"24.8821px"},{"top":"270.497px","left":"650px","transform":"rotate(19.2307deg)","width":"18.2911px","height":"26.5035px"},{"top":"217.807px","left":"615px","transform":"rotate(93.7563deg)","width":"17.3869px","height":"25.1932px"},{"top":"180.538px","left":"647px","transform":"rotate(-39.278deg)","width":"27.9248px","height":"40.4624px"},{"top":"130.268px","left":"657px","transform":"rotate(13.7553deg)","width":"20.519px","height":"29.7316px"},{"top":"110.572px","left":"615px","transform":"rotate(-31.9481deg)","width":"24.4506px","height":"35.4284px"},{"top":"135.535px","left":"586px","transform":"rotate(-4.1456deg)","width":"22.4056px","height":"32.4652px"},{"top":"106.65px","left":"561px","transform":"rotate(-20.1408deg)","width":"18.185px","height":"26.3497px"},{"top":"74.0907px","left":"513px","transform":"rotate(-42.2058deg)","width":"17.1909px","height":"24.9093px"},{"top":"78.144px","left":"451px","transform":"rotate(-43.8573deg)","width":"24.7457px","height":"35.856px"},{"top":"136.661px","left":"409px","transform":"rotate(-91.2033deg)","width":"31.9802px","height":"46.3386px"},{"top":"172.246px","left":"492px","transform":"rotate(-36.0083deg)","width":"23.2951px","height":"33.7541px"},{"top":"132.464px","left":"467px","transform":"rotate(-19.356deg)","width":"25.905px","height":"37.5358px"},{"top":"221.417px","left":"412px","transform":"rotate(-88.5838deg)","width":"23.1771px","height":"33.5831px"},{"top":"203.773px","left":"370px","transform":"rotate(-72.0165deg)","width":"24.3116px","height":"35.227px"},{"top":"268.65px","left":"413px","transform":"rotate(220.919deg)","width":"18.185px","height":"26.3497px"},{"top":"223.46px","left":"479px","transform":"rotate(-36.9971deg)","width":"27.2878px","height":"39.5395px"},{"top":"261.928px","left":"516px","transform":"rotate(212.19deg)","width":"17.3032px","height":"25.0719px"},{"top":"294.888px","left":"492px","transform":"rotate(2.86504deg)","width":"21.4717px","height":"31.1121px"},{"top":"298.151px","left":"447px","transform":"rotate(-53.5816deg)","width":"19.22px","height":"27.8494px"},{"top":"324.828px","left":"440px","transform":"rotate(233.653deg)","width":"18.7527px","height":"27.1723px"},{"top":"338.325px","left":"459px","transform":"rotate(232.209deg)","width":"20.4797px","height":"29.6746px"},{"top":"343.521px","left":"496px","transform":"rotate(211.639deg)","width":"15.5139px","height":"22.4793px"},{"top":"320.902px","left":"523px","transform":"rotate(137.259deg)","width":"20.082px","height":"29.0984px"},{"top":"308.072px","left":"673px","transform":"rotate(40.2348deg)","width":"28.2464px","height":"40.9285px"}]';
new LeafInitializer(stylesJson, container);
var currentLeaf = 0;

function rand(min, max) {
	return Math.random() * (max - min) + min;
}
setInterval( function() {
	let leaves = document.querySelectorAll(".leaf:not(.leafFallAnimation)");
	if(leaves.length > 0) {
		let i = Math.round(rand(0, leaves.length));
		leaves[i].classList.remove("leafReappearAnimation");
		leaves[i].classList.add("leafFallAnimation");
		
	}
}, 10000);

function removeLeaves(percentageToRemove) {
	let totalLeaves = document.querySelectorAll(".leaf");
	console.log(totalLeaves.length);
	let numberOfLeavesToRemove = Math.round((percentageToRemove/100) * totalLeaves.length);
	console.log(numberOfLeavesToRemove);
	var i = 0;
	for(i=0; i < numberOfLeavesToRemove; i++){
		
		let leaves = document.querySelectorAll(".leaf.leafFallAnimation");
		let i = Math.round(rand(0, leaves.length));
		let leaf = leaves[i];
		style = leaf.originalStyle;
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
//document.getElementById("overlay").addEventListener("click", () => removeLeaves(50));
//setInterval(function() {removeLeaves(50);},10000);
/*
setInterval( function() {
var i = 0;
for(i=0; i < 10; i++){
	let leaves = document.querySelectorAll(".leaf.leafFallAnimation");
	let i = Math.round(rand(0, leaves.length));
	let leaf = leaves[i];
	style = leaf.originalStyle;
	leaf.style.transform = "scale(0)";
	leaf.classList.remove("leafFallAnimation");
	leaf.style.top = style.top;
	leaf.style.left = style.left;
	leaf.style.transform = style.transform;
	leaf.style.width = style.width;
	leaf.style.height = style.height;
	leaf.classList.add("leafReappearAnimation");}
}, 10000);*/