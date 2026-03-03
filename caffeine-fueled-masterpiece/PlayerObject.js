class PlayerObject {
	constructor() {
		this.speed = 9;
		this.downVelocity = 0;
		this.grounded = false;
		this.inventory = new Container(6);
		this.selected = 0;

		this.inventory.TryAddItem('Teleporter',1000)
		this.inventory.TryAddItem('0',30)
		this.inventory.TryAddItem('1',5)
		this.inventory.TryAddItem('debug',1)
	}
	Update() {
		this.Movement()
		this.Render()	
		this.TickInventory()
	}

	TickInventory() {
		if (Pressed('1')) this.selected=0;
		else if (Pressed('2')) this.selected=1;
		else if (Pressed('3')) this.selected=2;
		else if (Pressed('4')) this.selected=3;
		else if (Pressed('5')) this.selected=4;
		else if (Pressed('6')) this.selected=5;

		if (mouseLeft) this.inventory.Use(this.selected,true);
		if (mouseRight) this.inventory.Use(this.selected,false);


		//Render
		for (let i = 0; i < 6; i++) {
			noStroke();
			fill(50);
			rect(Scale(155+i*74),Scale(15),Scale(60),Scale(60));
			stroke(i==this.selected?255:100);
			strokeWeight(4);
			rect(Scale(155+i*74+5),Scale(20),Scale(50),Scale(50));
			let item = this.inventory.contents[i]??null;
			if (item!=null) {
				item.item.RenderItem(Scale(155+i*74+30),Scale(15+30),Scale(40),item.quantity)
			}
		}
	}
	
	Movement() {
		//Horizontal Movement
		let direction = 0;
		if (Held('a')) direction-=1;
		if (Held('d')) direction+=1;
		if (Held(' ')) {
			if (this.grounded) {
				this.downVelocity=-15;
				this.grounded = false;
			}
		}

		let dirVector=new Vec(-sin(theta),0,cos(theta))

		if (direction!=0) {
			let movement = dirVector.Clone().Multiply(direction*this.speed*deltaTime*0.001)
			
			let BlockData = getBlockDataVect(movement.Clone().Add(practicalPos).Add(dirVector.Clone().Multiply((direction<0?-0.5:0.5)*((size-1)/size))))
			if (BlockData.solid) {
				movement.Multiply(0,1,0);
			}
			pos.x+=movement.x;
			pos.z+=movement.z;
		}



		this.downVelocity+=30*deltaTime*0.001;
		let CenterVector = new Vec(practicalPos.x,practicalPos.y+(this.downVelocity>=0?0.5:-0.5)+this.downVelocity*deltaTime*0.001,practicalPos.z);
		let LeftVector = CenterVector.Clone().Add(dirVector.Clone().Multiply(-0.5*((size-5)/size)))
		let RightVector = CenterVector.Clone().Add(dirVector.Clone().Multiply(-0.5*((size-5)/size)))
		if (getBlockDataVect(LeftVector).solid || getBlockDataVect(CenterVector).solid || getBlockDataVect(RightVector).solid) {
			this.downVelocity = 0;
			if (this.downVelocity>=0) this.grounded = true;
		} else {
			pos.y+=this.downVelocity*deltaTime*0.001;
			this.grounded = false;
		}
	}
	Render() {
		noStroke();
		fill(255,0,255)
		rect(sW/2-size/2+1,sH/2+1,size-2,size-2)
	}
}