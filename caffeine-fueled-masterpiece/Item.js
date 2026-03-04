let items = {}

class Item {
	constructor(id, name, ActionLeft, ActionRight) {
		this.id = id;
		this.name = name
		this.ActionLeft=ActionLeft
		this.ActionRight=ActionRight
		this.textColor=255;
		items[id]=this
		this.FillBlockColor = this.FillBlockColor.bind(this)
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

	SetMultiRenderer(width, height, r, g, b, rV, gV, bV, eq) {
		this.RenderMode = 'MULTI';
		this.width = width;
		this.height = height;
		if (sqrt(r*r+g*g+b*b)>216.506350946) this.textColor = 0
		else this.textColor=255;
		this.colorList=[]
		for (let i = 0; i < 9; i++) {
			if (eq) {
				let rand=random();
				append(this.colorList,r+rV*rand);
				append(this.colorList,g+gV*rand);
				append(this.colorList,b+bV*rand);
			} else {
				append(this.colorList,r+rV*random());
				append(this.colorList,g+gV*random());
				append(this.colorList,b+bV*random());
			}
		}

		blockList[this.id]={id:this.id,ref:this.FillBlockColor};
		
		return this;
	}

	SetCustomMultiRenderer(width, height, colors) {
		this.RenderMode = 'MULTI';
		this.width = width;
		this.height = height;
		if (sqrt(colors[0]*colors[0]+colors[1]*colors[1]+colors[2]*colors[2])>216.506350946) this.textColor = 0
		else this.textColor=255;
		this.colorList=colors
		blockList[this.id]={id:this.id,ref:this.FillBlockColor};
		return this;
	}

	FillBlockColor(x,y,z,m) {
		if (this.RenderMode=='SQUARE') {
			fill(this.r,this.g,this.b);
		} else if (this.RenderMode=='MULTI') {
			randomSeed(x*59879275.532+z*72173013.23459+y*879502.2352);
			this.Fill(floor(random()*9),m);
		}
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
		} else if (this.RenderMode=='MULTI') {
			this.Fill(0);
			let w=this.width*s;
			let h=this.height*s;
			rect(x-w*0.5,y-h*0.5,w,h);
		} else {
			fill(255,100,255);
			rect(x,y,s,s)
		}
		return this;
	}

	Fill(index,m=1) {
		fill(m*this.colorList[index*3],m*this.colorList[index*3+1],m*this.colorList[index*3+2]);
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
		} else if (this.RenderMode=='MULTI') {
			let h=this.height/this.width*s
			this.Fill(0);
			rect(x-s*0.5,y-h*0.5,s/3+1,h/3+1);
			this.Fill(1);
			rect(x-s/6,y-h*0.5,s/3+1,h/3+1);
			this.Fill(2);
			rect(x+s/6,y-h*0.5,s/3+1,h/3+1);
			this.Fill(3);
			rect(x-s*0.5,y-h/6,s/3+1,h/3+1);
			this.Fill(4);
			rect(x-s/6,y-h/6,s/3+1,h/3+1);
			this.Fill(5)
			rect(x+s/6,y-h/6,s/3+1,h/3+1);
			this.Fill(6)
			rect(x-s*0.5,y+h/6,s/3+1,h/3+1);
			this.Fill(7);
			rect(x-s/6,y+h/6,s/3+1,h/3+1);
			this.Fill(8)
			rect(x+s/6,y+h/6,s/3+1,h/3+1);
			fill(this.textColor)
			textSize(Scale(10))
			text(this.name+"\n"+quantity,x,y);
		}
	}
}