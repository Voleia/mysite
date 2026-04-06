class Inertia {
	constructor(position=0,time=0,velocity=0,len=200,ftl=false) {
		this.v = velocity
		this.p = position; //stationary frame
		this.t = time; //stationary frame
		this.len=len;

		this.breaksCausality = abs(this.v)>=1;
		this.timeTravel=ftl;
		this.gamma = 1;

		if (ReferenceFrame==null) {
			this.x0 = this.p;
			this.y0 = this.t;
			this.x1 = this.p+this.v
			this.y1 = this.t+1;
		} else {
			this.x0 = this.p;
			this.y0 = this.t;
			this.x1 = this.p+this.v
			this.y1 = this.t+1;
			this.AdjustReferenceFrame(ReferenceFrame);
		}
	}

	GetLorentz(ref=ReferenceFrame) {
		if (this.breaksCausality || this.timeTravel) {
			return 1;
		}
		let vrel = (this.v - ref.v) / (1 - this.v*ref.v);
		return 1 / sqrt(1-vrel*vrel);
	}
	
	AdjustReferenceFrame(ref=ReferenceFrame) {
		this.lx0 = this.x0;
		this.ly0 = this.y0;
		this.lx1 = this.x1;
		this.ly1 = this.y1;
		let p0pre = this.p;
		let t0pre = this.t;
		let p1pre = this.p + this.v;
		let t1pre = this.t + 1;

		let gamma = 1 / sqrt(1-ref.v*ref.v);
		
		this.lorentz = this.GetLorentz(ref)

		let p0post = gamma * (p0pre - ref.v * t0pre);
		let t0post = gamma * (t0pre - ref.v * p0pre);

		let p1post = gamma * (p1pre - ref.v * t1pre);
		let t1post = gamma * (t1pre - ref.v * p1pre);

		this.x0=p0post;
		this.y0=t0post;
		this.x1=p1post;
		this.y1=t1post;
	}

	AdjustTick() {
		if (adjustTime>=adjustMaxTime) {
			this.rx1=this.x1;
			this.ry1=this.y1;
		} else {
			let factor = adjustTime / adjustMaxTime;
			
			this.rx1 = this.lx1 * (1 - factor) + this.x1 * factor;
			this.ry1 = this.y1//lerp(this.ly1,this.y1,adjustTime/adjustMaxTime)
		}
	}
}