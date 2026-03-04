let len=35;
let lenHor=35;
let size;
let player;

let sW = 1920;
let sH = 1080;
let sf = 1;

function Scale(x,y) {
	return {x:x*sH/600, y:y*sH/600};
}
function Scale(x) {
	return x*sf;
}
function setup() {
	createCanvas(windowWidth, windowHeight);
	sW=windowWidth;
	sH=windowHeight;
	background(100);
	size = sH/len;
	lenHor = sW/size;
	sf = sH/600;
	fill(size)
	strokeWeight(1);
	frameRate(60);
	randomSeed(429091)	
	document.addEventListener("contextmenu", (e) => e.preventDefault());
	new Item("Teleporter", "Teleporter", ItemFunctionTeleport, ItemFunctionTeleport).SetTextRenderer(10, 'Teleport');
	new Item("0", "Concrete", PlaceBlockFromContainer, BreakBlock).SetSquareRenderer(15, 15, 184, 93, 77);
	new Item("1", "Concrete", PlaceBlockFromContainer, BreakBlock).SetSquareRenderer(15, 15, 0, 255, 255);
	new Item('3', "Grass", PlaceBlockFromContainer, BreakBlock).SetSquareRenderer(15, 15, 70, 230, 130);
	new Item('4', "Stone", PlaceBlockFromContainer, BreakBlock).SetSquareRenderer(15, 15, 190, 190, 190);
	new Item('5', "Dirt", PlaceBlockFromContainer, BreakBlock).SetSquareRenderer(15, 15, 190, 160, 120);
	new Item('debug', "Debug", DebugGetNatural, DebugGetAll).SetSquareRenderer(15, 15, 255, 255, 255);
	player = new PlayerObject();
}


let pos = {x:1000,y:-50,z:1000}
let practicalPos = {x:1000.0,y:0,z:1000} //Modifying this does nothing, modify pos instead
let pi = 3.141592653
let theta = 1.57079632679; //90 degrees.
function incrementTheta(value) {
	theta+=pi*value;
	if (theta>pi*2) theta-=pi*2;
	if (theta<0) theta+=pi*2;
}

function mouseClicked() {
  mouseClickedEvent=true;
}

let selected=null;
let preciseSelected=null;
let placedBlocks = {};
let placedBlocks2D = {};
let mouseClickedEvent = false;

function postDrawUpdates() {
	ScreenToVoxelPos(mouseX,mouseY);
	keysLast={}
	mouseLeft=false;
	mouseRight=false;

	if (guide) {
		fill(0)
		rect(Scale(100),Scale(100),Scale(400),Scale(400))
		fill(255)
		textSize(Scale(15))
		text("CONTROLS:\nA & D - left & right\nQ & E - rotate world slice\nr or t - float up or down\nr AND t - go down 1e16 meters per frame\nn - hide or show this menu\n1/2/3/4/5/6 - select inventory slot\nleft click - place held block or use item\nright click - break block\n",Scale(300),Scale(300))
	}
}

let guide = true;
let mapScale = 1;

function draw() {
	//INPUT
	let dx = -sin(theta); //view direction perpendicular to camera.
	let dz = cos(theta);
	
	if (Held('e')) {
		incrementTheta(1/180);
	}
	if (Held('q')) {
		incrementTheta(-1/180);
	}
	if (Held('r')) {
		pos.y-=1;
		player.downVelocity = 0;
	}
	if (Held('t')) {
		pos.y+=1;
	}
	if (Held('t') && Held('r')) {
		pos.y+=1e15
	}
	if (Pressed('+')) {
		mapScale/=2;
		if (mapScale<1) {
			mapScale=1;
		}
	}
	if (Pressed('-')) {
		mapScale*=2;
	}

	//DRAW SCREEN
	clear();

	let startX = pos.x - dx * lenHor/2;
	let startZ = pos.z - dz * lenHor/2;

	let voxelX = floor_(startX);
	let voxelZ = floor_(startZ);
		
	let stepX = dx > 0 ? 1 : -1; //determine start direction
	let stepZ = dz > 0 ? 1 : -1;
	
	//let tDeltaX = Math.abs(1 / dx); //Change in t (LENGTH units)
	//let tDeltaZ = Math.abs(1 / dz);
	let tDeltaX = dx === 0 ? Infinity : Math.abs(1 / dx);
	let tDeltaZ = dz === 0 ? Infinity : Math.abs(1 / dz);
	
	let nextBoundaryX = voxelX + (dx > 0 ? 1 : 0);
	let nextBoundaryZ = voxelZ + (dz > 0 ? 1 : 0);
	
	//let tMaxX = (nextBoundaryX - startX) / dx;
	//let tMaxZ = (nextBoundaryZ - startZ) / dz;
	let tMaxX = dx === 0 ? Infinity : (nextBoundaryX - startX) / dx;
	let tMaxZ = dz === 0 ? Infinity : (nextBoundaryZ - startZ) / dz;
	
	let tEnter = 0;
	noStroke();
	background(70,130,255)
	fill(20,60,255)
	rect(0,size*13-pos.y*size-size*8/9,sW,6000);
	while (tEnter*size < sW) { //loop through COLUMNS

		let tExit = Math.min(tMaxX, tMaxZ);
		
		let screenX = tEnter * size;
		let screenW = (tExit - tEnter) * size;
		
		for (let y = 0; y < len+1; y++) { //loop through items (rows) per column
			if (fillBlock(voxelX,y+floor_(pos.y),voxelZ)) {
				rect(screenX,(y-pos.y%1)*size,screenW+1,size+1);
			}			
		}

		if (tMaxX < tMaxZ) {
			tMaxX += tDeltaX;
			voxelX += stepX;
		} else {
			tMaxZ += tDeltaZ;
			voxelZ += stepZ;
		}

		tEnter =tExit;
	}

	//VISUALIZE
	noStroke();
	startX=pos.x-lenHor*mapScale/2
	startZ=pos.z-lenHor*mapScale/2
	let s_=125/lenHor;
	let b_=15;
	let b_x=15-(startX%1*s_);
	let b_y=15-(startZ%1*s_);
	for (let x = 0; x < lenHor; x+=mapScale) {
		for (let z = 0; z < lenHor; z+=mapScale) {
			if (placedBlocks2D[`${floor_(startX)+x},${floor_(startZ)+z}`]!=null) {
				fill(255);
			} else {
				height = getNoiseAt(floor_(startX)+x,floor(startZ)+z)
				if (height>12) {
					let mapping = (height+10)/27
					fill(200-mapping*200,200-mapping*200,255)
				} else {
					fill(30, floor_(25-height)*10.2, 100);
				}
			}
			rect(Scale(b_x+x*s_),Scale(b_y+z*s_),Scale(s_+1),Scale(s_))
		}
	}
	stroke(255,255,255);
	//line(b_+s_*len/2,b_+s_*len/2,slope*s_*len/2,s_*len/2);
	line(Scale(b_+s_*lenHor/2-dx*s_*lenHor/2),
		 Scale(b_+s_*lenHor/2-dz*s_*lenHor/2), 
		 Scale(b_+s_*lenHor/2+dx*s_*lenHor/2), 
		 Scale(b_+s_*lenHor/2+dz*s_*lenHor/2))	
	strokeWeight(Scale(5))
	point(Scale(b_+s_*lenHor/2), Scale(b_+s_*lenHor/2))
	strokeWeight(min(Scale(1),1))

	practicalPos.x=pos.x;
	practicalPos.y=pos.y+len/2+0.5;
	practicalPos.z=pos.z;

	noStroke()
	fill(50)
	//edges
	rect(Scale(b_-s_),Scale(b_-s_),Scale(125+s_),Scale(5));
	rect(Scale(b_-s_),Scale(b_-s_),Scale(5),Scale(125+s_));
	rect(Scale(b_-s_),Scale(b_-s_+125),Scale(125+s_),Scale(5));
	rect(Scale(b_-s_+125),Scale(b_-s_),Scale(5),Scale(125+s_));

	fill(100)
	rect(Scale(b_-s_+1),Scale(b_-s_+1),Scale(125+s_-2),Scale(5-2));
	rect(Scale(b_-s_+1),Scale(b_-s_+1),Scale(5-2),Scale(125+s_-2));
	rect(Scale(b_-s_+1),Scale(b_-s_+125+1),Scale(125+s_-2),Scale(5-2));
	rect(Scale(b_-s_+125+1),Scale(b_-s_+1),Scale(5-2),Scale(125+s_-2));
		
	player.Update();
	postDrawUpdates();

	fill(50)
	noStroke();
	textAlign(CENTER)
	textSize(Scale(11))
	text(`${floor_(practicalPos.x)}, ${floor_(practicalPos.y)}, ${floor_(practicalPos.z)}, ${floor(1000/deltaTime)}fps, ${floor(theta*180/pi)}°`, Scale(b_+62),Scale(b_+140))
}

let factor = 0.1;

function floor_(value) {
	return (value>=0?Math.floor:Math.ceil)(value)
}

function ScreenToVoxelPos(mouseX,mouseY) {
	selected=null;
	let dx = -sin(theta);
	let dz = cos(theta);

	let tStart = -lenHor/2;

	let t = mouseX/size+tStart; //'t' value on screen

	let globalX = pos.x+dx*t;
	let globalZ = pos.z+dz*t;

	let voxelX = floor_(globalX);
	let voxelZ = floor_(globalZ);
	let voxelY = floor_((mouseY+pos.y%1*size) / size);
	preciseSelected = {x: globalX, y:(mouseY+pos.y%1*size) / size + pos.y, z:globalZ}
	//find points
	let intersectionPoints = [];

	if (dx!=0) {
		//in-case x is never intercepted.
		append(intersectionPoints,(voxelX - pos.x) / dx);
		append(intersectionPoints,(voxelX + 1 - pos.x) / dx)
	}
	if (dz!=0) {
		append(intersectionPoints,(voxelZ - pos.z) / dz);
		append(intersectionPoints,(voxelZ + 1 - pos.z) / dz)
	}

  // Remove ones that arent actually sliced.
	let goodIntersections = [];

	for (let intersection of intersectionPoints) {
		let x = pos.x + dx * intersection;
		let z = pos.z + dz * intersection;
		
		if ( x >= voxelX && x <= voxelX + 1 && z >= voxelZ && z <= voxelZ + 1) {
			append(goodIntersections,intersection);
		}
	}

	if (goodIntersections.length < 2) { return null; }

	goodIntersections.sort((a, b) => a - b);

	let tEnter = goodIntersections[0];
	let tExit  = goodIntersections[1];
	
	// Get screen coords again
	let screenX = (tEnter - tStart) * size;
	let screenW = (tExit - tEnter) * size;
	
	let screenY = voxelY * size;
	let screenH = size;

	fill(0,0,0,0)
	stroke(0)
	strokeWeight(2)
	rect(screenX,screenY-pos.y%1*size,screenW,screenH);
	selected={x:voxelX,y:voxelY+floor_(pos.y),z:voxelZ};
	return {
		voxelX,
		voxelY,
		voxelZ,
		screenX,
		screenY,
		screenW,
		screenH
	};
}

function getNoiseAt(x,z) {
	let height = 25 * noise(factor*x,factor*z);
	let altHeight = (noise(factor*0.1*x,factor*0.1*z)-0.5)*35;
	height+=altHeight
	return height;
}

function fillBlock(x,y,z) {
	placed = placedBlocks[`${x},${y},${z}`]??null;
	if (placed!=null) {
		if (placed.id=='2') {
			return false;
		} else {
			switch (placed.id) {
				case '3': //Grass
					fill(70,200+55*noise(35*x,35*y,35*z),130)
					return true;
				case '4': //Stone
					fill(170+40*noise(35*x,35*y,35*z))
					return true;
				case '5': //Dirt
					fill(170+45*noise(35*x,35*y,35*z),160,120)
					return true;
				default:
					fill(placed.r,placed.g,placed.b)
					return true;
			}
		}
	}
	
	let height = getNoiseAt(x,z)
	if (y<height) {
		return false;
	} else { 
		let caveNoise = noise(0.1*(x+194),0.3*(y+1042),0.1*(z+052));
		if (y<height+5) {
			if (caveNoise<=0.3) fill(90+30*noise(35*x,35*y,35*z))
			//else if (height>=12 || y>=16) fill(246, 220+20*noise(35*x,35*y,35*z), 189)
			else fill(70,200+55*noise(35*x,35*y,35*z),130)
		} else {
			if (caveNoise<=0.4) fill(90+30*noise(35*x,35*y,35*z))
			else if (caveNoise<=0.5) fill(170+40*noise(35*x,35*y,35*z))
			else fill(170+45*noise(35*x,35*y,35*z),160,120)
		}
	}
	return true;
}

function getNaturalBlockData(x,y,z) {
	let height = getNoiseAt(x,z)
	if (y<height) {
		return {solid:false,artificial:false,type:y>=13?'7':'8'}
	} else { 
		let caveNoise = noise(0.1*(x+194),0.3*(y+1042),0.1*(z+52));
		if (y<height+5) {
			if (caveNoise<=0.3) return {solid:false,artificial:false,type:'6'}
			//else if (y>=13) return {solid:true,artificial:false,type:'SAND'}
			else return {solid:true,artificial:false,type:'3'}
		} else {
			if (caveNoise<=0.4) return {solid:false,artificial:false,type:'6'}
			else if (caveNoise<=0.5) return {solid:true,artificial:false,type:'4'}
			else return {solid:true,artificial:false,type:'5'}
		}
	}
}

function getBlockData(x,y,z) {
	placed = placedBlocks[`${x},${y},${z}`]??null;
	if (placed!=null) return {solid:placed.solid??true,artificial:true,type:placed.id}
	let height = getNoiseAt(x,z)
	if (y<height) {
		return {solid:false,artificial:false,type:y>=13?'7':'8'}
	} else { 
		let caveNoise = noise(0.1*(x+194),0.3*(y+1042),0.1*(z+052));
		if (y<height+5) {
			if (caveNoise<=0.3) return {solid:false,artificial:false,type:'6'}
			//else if (y>=13) return {solid:true,artificial:false,type:'SAND'}
			else return {solid:true,artificial:false,type:'3'}
		} else {
			if (caveNoise<=0.4) return {solid:false,artificial:false,type:'6'}
			else if (caveNoise<=0.5) return {solid:true,artificial:false,type:'4'}
			else return {solid:true,artificial:false,type:'5'}
		}
	}
}

function getBlockDataVect(vect) {
	return getBlockData(floor_(vect.x),floor(vect.y),floor_(vect.z));
}

let keys = {}
let keysLast = {}
let mouseLeft = false;
let mouseRight = false;

function mousePressed(event) {
	if (mouseButton === LEFT) mouseLeft = true;
	else if (mouseButton === RIGHT) mouseRight = true;
}

//Input System
function Held(key) {
	return keys[key]??false;
}

function Pressed(key) {
	return keysLast[key]??false;
}

function keyPressed(event) {
	keys[event.key]=true;
	keysLast[event.key]=true;
	if (event.key=='n') {
		guide=!guide;
	}
}

function keyReleased(event) {
	keys[event.key]=false;
}