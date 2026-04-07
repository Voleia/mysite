let ReferenceFrame = null;
let StationaryFrame = null;
let lastReference = null;
let center;
let m = 1;
let scale = 1;

let vals = [];
let adjustTime = 0.5;
const adjustMaxTime = 0.5;

let adjWindowWidth;
let adjWindowHeight;

function setup() {
	adjWindowWidth = windowWidth-85;
	adjWindowHeight = windowHeight;
	let canvas = createCanvas(adjWindowWidth, adjWindowHeight)
	background(100);

	StationaryFrame = new Inertia(0,0,0,-1)
	ReferenceFrame = StationaryFrame;
	StationaryFrame.name = "Stationary Reference"
	StationaryFrame.display = "Stationary Reference"
	
	append(vals,StationaryFrame)
	append(vals,new Inertia(-150,0,0,10000))
	append(vals,new Inertia(-400,-200,1,10000,false,"moving at EXACTLY C"))
	append(vals,new Inertia(-150,100,0.8,10000))
	append(vals,new Inertia(130,140,0.99,0)) //event

	for (let i = 0; i < vals.length; i++) {
		vals[i].AdjustReferenceFrame()
	}

	center=new Vec(adjWindowWidth/2,3*adjWindowHeight / 4);
	Vec.up = new Vec(0,1);
	Vec.right = new Vec(1,0);
	Vec.zero = new Vec(0,0);
	canvas.parent('app_container');
}

let lastSelected = null;

let n = true;
function draw() {
	adjustTime+=deltaTime/1000;
	/*for (let i = 0; i < vals.length; i++) {
		StationaryFrame.v = mouseX / 800;
		vals[i].ReferenceFrame(StationaryFrame)
	}*/
	background(225);
	if (n) {
		textAlign(LEFT);
		let off = 55;
		fill(100)
		noStroke();
		textSize(25)
		text("Minkowski Diagram Simulator", 50, 50)
		textSize(12)
		text("By Avery Volei - Credit is Appreciated.",50,10+off)
		text("Press 'n' to toggle this menu",50,25+off)
		text("- Hover over a line to view it's space axis",50,45+off)
		text("- Hold 'Shift' and drag mouse to make a new line",50,65+off)
		text("- Release 'Shift' before releasing the mouse to set",50,80+off)
		text("that line's length to infinity", 70, 95+off)
		text("- Control+Click to delete a line",50,110+off)
		text("- Click to shift into a STL line's reference frame",50,125+off)
		text("- Click to shift into a STL line's reference frame",50,125+off)
		text("- Solid red = STL line",50,140+off)
		text("- Dotted red = FTL line",50,155+off)
		text("- Dotted purple = Time travel in stationary reference frame",50,170+off)
		text("- Magenta = Stationary reference frame (default)",50,185+off)
		text("- you may need to press shift twice for it to work.",50,200+off)
		text("- Hold 'q' to keep space line on screen",50,215+off)
		text("- yellow/brown/orange = speed of light, C",50,230+off)
		text("- Scroll to zoom in or out",50,245+off)
		text("- Press 'r' with an object hovered to rename it,",50,260+off)
	}
	textAlign(CENTER)

	if (Pressed('r') && lastSelected!=null) {
		let answer = prompt("What would you like to call this\nVARIABLES (form %<var><num decimals>):\nv - velocity\ns - speed / absolute velocity\nl - length\nt - start time\np - start position\ny or γ - Relative Lorentz Factor" + (lastSelected.len==0?"event":"object"), lastSelected.name)
		lastSelected.name = answer==null?lastSelected.name:answer;
		lastSelected.display = Parse(lastSelected.name,lastSelected);
	}

	/*noStroke();
	textAlign(CENTER)
	fill(100)
	text("Width: " + floor(adjWindowWidth * scale) + "m -- Height: " + (floor(adjWindowHeight * scale / 299792458 * 1000000000)/1000) + "μs",center.x,center.y/3*4-10);
	strokeWeight(3)
	stroke(100)
	drawingContext.setLineDash([]);
	line(30,center.y/3*4-30,center.x*2-30,center.y/3*4-30);*/

	if (Pressed('n')) {
		n=!n;
	}
	
	stroke(255,0,0)
	if (!Held('q')) {
		lastSelected = null;
	}
	let intersectionFound = false;

	let refA;

	if (adjustTime >= adjustMaxTime) {
		refA = TransformToScreen(ReferenceFrame.x0,ReferenceFrame.y0).Subtract(TransformToScreen(0,0));
	} else {
		let factor = adjustTime / adjustMaxTime;
		let OldStart = TransformToScreen(lastReference.lx0,lastReference.ly0);
		let NewStart = TransformToScreen(ReferenceFrame.x0,ReferenceFrame.y0);
		refA = new Vec(OldStart).Lerp(NewStart, factor).Subtract(TransformToScreen(0,0));
	}

	
	for (let i = 0; i < vals.length; i++) {
		/*val.AdjustTick();
		let a = TransformToScreen(val.x0,val.y0);
		let b0 = TransformToScreen(val.x1,val.y1);
		let direction0 = new Vec(b0.x-a.x,b0.y-a.y)
		let direction;
		if (adjustTime>=adjustMaxTime) {
			direction = direction0;
 		} else {
			let b1 = TransformToScreen(val.lx1,val.ly1);
			let direction1 = new Vec(b1.x-a.x,b1.y-a.y)
			let factor = adjustTime / adjustMaxTime;
			direction = new Vec(lerp(direction1.x,direction0.x,factor),lerp(direction1.y,direction0.y,factor))
		}*/
		let val = vals[i];
		let direction;
		let a;
		let angle;
		if (adjustTime >= adjustMaxTime) {
			a = TransformToScreen(val.x0,val.y0).Subtract(refA);
			let b = TransformToScreen(val.x1,val.y1).Subtract(refA);
			direction = new Vec(b.x-a.x,b.y-a.y).Normalize();
			angle = atan2(direction.y,direction.x);
		} else {
			let factor = adjustTime / adjustMaxTime;
			let OldStart = TransformToScreen(val.lx0,val.ly0).Subtract(refA);
			let NewStart = TransformToScreen(val.x0,val.y0).Subtract(refA);
			a = new Vec(OldStart).Lerp(NewStart, factor);

			let OldEnd = TransformToScreen(val.lx1,val.ly1).Subtract(refA);
			let NewEnd = TransformToScreen(val.x1,val.y1).Subtract(refA);

			let OldDirection = new Vec(OldEnd.x - OldStart.x, OldEnd.y - OldStart.y);
			let NewDirection = new Vec(NewEnd.x - NewStart.x, NewEnd.y - NewStart.y);
			
			let oldTheta = atan2(OldDirection.y, OldDirection.x)
			let newTheta = atan2(NewDirection.y, NewDirection.x)

			let diff = newTheta - oldTheta;
			while (diff > PI)  diff -= TWO_PI;
			while (diff < -PI) diff += TWO_PI;

			//let theta = lerp(oldTheta,newTheta,factor);
			let theta = oldTheta + diff * factor;
			angle = theta;

			direction = new Vec(cos(theta),sin(theta));
		}

		if (val.timeTravel) {
			direction.Multiply(-1);
		}
		let end = new Vec(direction).Multiply(val.len==-1?(adjWindowWidth+adjWindowHeight):(val.len/scale*val.lorentz)).Add(a);

		if (((Intersects(a,end) && !intersectionFound) || lastSelected == val)) {
			strokeWeight(4);
			intersectionFound = true;

			stroke(0,255,0)
			let end0 = new Vec(direction.y,direction.x).Multiply(val.len==-1?(-adjWindowWidth-adjWindowHeight):(-val.len/scale*val.lorentz)).Add(a);
			let end1 = new Vec(direction.y,direction.x).Multiply(val.len==-1?(adjWindowWidth+adjWindowHeight):(val.len/scale*val.lorentz)).Add(a);
			
			if (!val.timeTravel) {
				drawingContext.setLineDash([10, 10]);
				line(a.x,a.y,end0.x,end0.y);
				line(a.x,a.y,end1.x,end1.y);
			}
			lastSelected = val;
			//let slope = direction.y / direction.x;
			//let spaceSlope = 1/x;
		} else {
			strokeWeight(2)
		}
		if (i==0) {
			stroke(255,0,130);
			fill(255,0,130)
			strokeWeight(4)
		} else {
			stroke(255,0,0);
			fill(255,0,0)
		}
		if (val.timeTravel) {
			drawingContext.setLineDash([5, 15]);
			stroke(255,0,255);
			fill(255,0,255)
		} else if (val.breaksCausality) {
			drawingContext.setLineDash([5, 15]);
		} else {
			drawingContext.setLineDash([]);
		}
		if (val.event) {
			strokeWeight(20);
			stroke(0,130,130)
			fill(0,130,130)
			point(a.x,a.y);
		} else {
			line(a.x,a.y,end.x,end.y);
			strokeWeight(20);
			point(a.x,a.y);
		}


		push() //start own group
		translate(a.x,a.y)
		if (val.v < 0) {
			rotate(angle+PI)
		} else {
			rotate(angle)
		}
		noStroke();
		text(/*floor(val.v*1000)/1000+"c"*/val.display,0,-15)
		pop()
	}


		//C Lines
	drawingContext.setLineDash([6, 12]);
	strokeWeight(2);
	stroke(173, 112, 31);
	let a=TransformToScreen(0,0);
	let b=TransformToScreen(1000*scale,1000*scale);
	let c=TransformToScreen(-1000*scale,1000*scale);
	line(a.x,a.y,b.x,b.y)
	line(a.x,a.y,c.x,c.y)

	stroke(0);
	line(0,center.y,center.x*2,center.y);
	line(center.x,0,center.x,center.y*2);
	drawingContext.setLineDash([6, 12]);


	//Intersection Check

	keysLast={}
	drawingContext.setLineDash([10,10]);
	if (mouseIsPressed && selectStart!=null) {
		let selectEnd = TransformToWorld(mouseX,mouseY);
		stroke(255,0,0)
		let a_ = TransformToScreen(selectStart.x,selectStart.y)
		let b_ = TransformToScreen(selectEnd.x,selectEnd.y);
		line(a_.x,a_.y,b_.x,b_.y)

		drawingContext.setLineDash([]);
		strokeWeight(1)
		stroke(173, 112, 31);
		let t0=TransformToScreen(1000*scale+selectStart.x,1000*scale+selectStart.y);
		let t1=TransformToScreen(-1000*scale+selectStart.x,1000*scale+selectStart.y);
		line(a_.x,a_.y,t0.x,t0.y)
		line(a_.x,a_.y,t1.x,t1.y)
		stroke(0,255,0)
		line(0,a_.y,adjWindowWidth,a_.y)
		stroke(255,0,130)
		line(a_.x,0,a_.x,a_.y)

	}
	drawingContext.setLineDash([]);

}

let selectStart = null;

function mousePressed() {
	if (Held('Shift')) {
		selectStart = TransformToWorld(mouseX,mouseY);
	}
	else if (lastSelected!=null) {
		if (Held('Control')) {
		 	let index = vals.indexOf(lastSelected);
			if (index>0) {
				vals.splice(index,1);
			}
		} else if (!lastSelected.breaksCausality && !lastSelected.timeTravel && !lastSelected.event) {
			adjustTime=0;
			lastReference = ReferenceFrame;
			ReferenceFrame = lastSelected;
			for (let i = 0; i < vals.length; i++) {
				vals[i].AdjustReferenceFrame(lastSelected);
			}
		}
	}
}

function mouseReleased() {
	if (selectStart!=null) {

		let refA;
		if (adjustTime >= adjustMaxTime) {
			refA = TransformToScreen(ReferenceFrame.x0,ReferenceFrame.y0).Subtract(TransformToScreen(0,0));
		} else {
			let factor = adjustTime / adjustMaxTime;
			let OldStart = TransformToScreen(lastReference.lx0,lastReference.ly0);
			let NewStart = TransformToScreen(ReferenceFrame.x0,ReferenceFrame.y0);
			refA = new Vec(OldStart).Lerp(NewStart, factor).Subtract(TransformToScreen(0,0));
		}
		refA.Multiply(1,-1);


		
		let selectEnd = TransformToWorld(mouseX,mouseY);
		selectStart.Add(refA);
		selectEnd.Add(refA);
		/*if (selectEnd.y < selectStart.y) {
			console.log("No time travel in your own reference frame")
			return;
		}*/
		let refV = ReferenceFrame.v;
		let gamma = 1 / sqrt(1 - refV*refV);
		let x = selectEnd.x;
		let t = selectEnd.y;
		selectEnd.x = gamma * (x + refV * t);
		selectEnd.y = gamma * (t + refV * x);

		x = selectStart.x;
		t = selectStart.y;
		selectStart.x = gamma * (x + refV * t);
		selectStart.y = gamma * (t + refV * x);

		let slope = (selectEnd.y-selectStart.y) / (selectEnd.x - selectStart.x);
		let v = 1 / slope; //(c over slope.)
		
		let timeTravel = selectEnd.y < selectStart.y;
		let length = new Vec(selectEnd).Subtract(selectStart).Magnitude();
		if (!Held('Shift')) {
			length=-1;
		}

		let val = new Inertia(selectStart.x,selectStart.y,v,length,timeTravel);
		if (val.len!=-1 && !val.breaksCausality && !val.timeTravel) {
			val.len/=val.GetLorentz();
		}
		append(vals,val);

		selectStart=null;
	} else {
		selectStart = null;
	}
}

function Intersects(p0,p1) {
	let inertia = {x0:p0.x,y0:p0.y,x1:p1.x,y1:p1.y};
	let mouse = {x:mouseX,y:mouseY}
	let radius = 8;
	//Vector from A to B
	let dx = inertia.x1-inertia.x0;
	let dy = inertia.y1-inertia.y0;

	//Vector from A to circle center.
	let fx = mouse.x-inertia.x0;
	let fy = mouse.y-inertia.y0;

	//Project F onto AB, clamped to [0,1] to stay within segment
	let t = (fx*dx + fy*dy) / (dx*dx + dy*dy);
	t = max(0,min(1,t));

	let closestX = inertia.x0 + t * dx;
	let closestY = inertia.y0 + t * dy;

	let distX = mouse.x - closestX;
	let distY = mouse.y - closestY;

	let d3=new Vec(p0.x,p0.y).Subtract(mouse.x,mouse.y).Magnitude();
	if (d3<10) {
		return true;
	}

	return (distX*distX + distY*distY) <= radius*radius;
}

function TransformToScreen(x,y) {
	y/=-scale;
	y+=center.y;
	x/=scale;
	x+=center.x;
	return new Vec(x,y);
}

function TransformToWorld(x,y) {
	x-=center.x;
	x*=scale;
	y-=center.y;
	y*=-scale;
	return new Vec(x,y);
}

//Input
let keys={};
let keysLast={};

function Held(key) {
	return keys[key]??false;
}

function Pressed(key) {
	return keysLast[key]??false;
}

function keyPressed(event) {
	keys[event.key]=true;
	keysLast[event.key]=true;
}

function keyReleased(event) {
	keys[event.key]=false;
}

function mouseWheel(event) {
	/*if (event.delta>0) {
		scale*=1.25
	} else if (event.delta<0) {
		scale/=1.25
	}
	if (scale * adjWindowWidth < 100) {
		scale = 100 / adjWindowWidth;
	}
	if (scale < 1) {
		scale = 1;
	}
	if (scale * adjWindowWidth > 299792458) {
		scale = 299792458 / adjWindowWidth
	}*/
}

function Parse(name,inertia) {
	let args = name.split('%');
	let final = "";
	for (let i = 0; i < args.length; i++) {
		let arg = args[i];
		let value = -1;
		if (arg.length==0) {
			continue;
		}
		if (arg.length<2) {
			final+=arg;
			continue;
		} else switch (arg[0]) {
			case 'v': //velocity
				value = inertia.v;
				break;
			case 's': //absolute velocity / speed
				value = abs(inertia.v)
				break;
			case 'y': //lorentz
				value = inertia.GetLorentz()
				break;
			case 'γ': //also lorentz
				value = inertia.GetLorentz()
				break;
			case 'p': //Starting position
				value = inertia.p;
				break;
			case 't': //Starting time
				value = inertia.t;
				break;
			case 'l': //length
				if (inertia.len==-1) {
					final+="Infinite"+arg.substring(2);
					continue;
				}
				value = inertia.len;
				break;
			default:
				final+=arg;
				continue;
		}
		try {
			let num = pow(10,int(arg[1]))
			final=final+floor(value*num)/num+arg.substring(2);
		} catch (exception) {
			return "Error: Invalid Decimal Length; " + arg[1]
		}
	}
	return final;
}