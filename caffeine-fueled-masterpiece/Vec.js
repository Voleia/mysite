class Vec {
	constructor(x,y,z) {
		this.x=x
		this.y=y
		this.z=z
	}

	GetMagnitude() {
		return sqrt(x*x+y*y+z*z)
	}

	GetSquareLength() {
		return (x*x+y*y+z*z)
	}

	GreaterThan(other) {
		return (x*x+y*y+z*z)>other*other
	}

	Normalize() {
		let m = this.GetMagnitude()
		this.x/=m
		this.y/=m
		this.z/=m
		return this;
	}

	Multiply(other) {
		this.x*=other;
		this.y*=other;
		this.z*=other;
		return this;
	}

	Divide(other) {
		this.Multiply(1/other)
		return this;
	}

	Add(other) {
		this.x+=other.x;
		this.y+=other.y;
		this.z+=other.z;
		return this;
	}

	Clone() {
		return new Vec(this.x,this.y,this.z);
	}

	CloneHorizontal() {
		return new Vec(this.x,0,this.z);
	}

	CloneVertical() {
		return new Vec(0,this.y,0);
	}

	MultiplyInt(x,y,z) {
		this.x*=x;
		this.y*=y;
		this.z*=z;
		return this;
	}

	Floor() {
		this.x=floor(x)
		this.y=floor(y)
		this.z=floor(z)
		return this;
	}
}