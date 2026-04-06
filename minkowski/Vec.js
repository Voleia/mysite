class Vec {	
	constructor(x=0,y=0) {
		if (x instanceof Vec) {
			this.x=x.x;
			this.y=x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	Multiply(first,second=null) {
		if (second==null) {
			if (first instanceof Vec) {
				this.x*=first.x;
				this.y*=first.y;
			} else {
				this.x*=first;
				this.y*=first;
			}
		} else {
			this.x*=first;
			this.y*=second;
		}
		return this;
	}

	Add(first,second=null) {
		if (second==null) {
			if (first instanceof Vec) {
				this.x+=first.x;
				this.y+=first.y;
			} else {
				this.x+=first;
				this.y+=first;
			}
		} else {
			this.x+=first;
			this.y+=second;
		}
		return this;
	}

	Subtract(first,second=null) {
		if (second==null) {
			if (first instanceof Vec) {
				this.x-=first.x;
				this.y-=first.y;
			} else {
				this.x-=first;
				this.y-=first;
			}
		} else {
			this.x-=first;
			this.y-=second;
		}
		return this;
	}

	Dot(first, second=null) {
		if (second!=null) {
			return this.Dot(new Vec(first,second));
		}
		return this.x*first.x+this.y*first.y;
	}

	Magnitude() {
		return sqrt(this.MagnitudeSquared());
	}

	MagnitudeSquared(first, second=null) {
		return this.x*this.x+this.y*this.y;
	}

	Lerp(other,factor) {
		this.x=this.x*(1-factor)+other.x*factor;
		this.y=this.y*(1-factor)+other.y*factor;
		return this;
	}

	Normalize() {
		let mag = this.Magnitude();
		this.x/=mag;
		this.y/=mag;
		return this;
	}
}