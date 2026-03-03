let items = {}

class Item {
	constructor(id, name, ActionLeft, ActionRight) {
		this.id = id;
		this.name = name
		this.ActionLeft=ActionLeft
		this.ActionRight=ActionRight
		this.textColor=255;
		items[id]=this
	}

	SetSquareRenderer(width, height, r, g, b) {
		this.RenderMode = 'SQUARE';
		this.width = width;
		this.height = height;
		this.r=r;
		this.g=g;
		this.b=b;
		if (sqrt(r*r+g*g+b*b)>216.506350946) this.textColor = 0
		else this.textColor=255;
		return this;
	}

	SetTextRenderer(diameter,text,fontw) {
		this.RenderMode = 'TEXT';
		this.text=text;
		this.fontw=fontw;
		this.diameter=diameter;
		return this;
	}

	RenderObject(x,y,s) {
		if (this.RenderMode=='SQUARE') {
			fill(this.r,this.g,this.b)
			let w=this.width*s;
			let h=this.height*s;
			rect(x-w*0.5,y-h*0.5,w,h);
		} else {
			fill(255,100,255);
			rect(x,y,s,s)
		}
		return this;
	}

	RenderItem(x,y,s,quantity) {
		noStroke()
		if (this.RenderMode=='SQUARE') {
			fill(this.r,this.g,this.b)
			let h=this.height/this.width*s
			rect(x-s*0.5,y-h*0.5,s,h);
			fill(this.textColor)
			textSize(Scale(10))
			text(this.name+"\n"+quantity,x,y);
		} else if (this.RenderMode=='TEXT') {
			fill(255);
			textSize(Scale(this.fontw))
			text(this.text+"\n"+quantity,x,y);
		}
	}
}