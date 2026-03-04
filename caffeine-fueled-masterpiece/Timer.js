class Timer {
	constructor() {
		this.end = 0;
		this.lastStart = 0;
	}
	Set(time) {
		this.end = curMillis+time*1000;
		this.lastStart = curMillis;
		return this;
	}

	Progress() {
		if (this.end==this.lastStart || this.end <= curMillis) return 1;
		let range = this.end-this.lastStart;
		let cur = curMillis-this.lastStart;
		return 1-cur/range;
	}

	Check() {
		return this.end <= curMillis;
	}
}