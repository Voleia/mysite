class Container {
	constructor(size) {
		this.size=size;
		this.contents = []
	}

	Use(selected,left) {
		let item = this.contents[selected]??null
		if (item!=null) {
			(left?item.item.ActionLeft:item.item.ActionRight)(item.id);
		} else if (!left)  {
			BreakBlock();
		}
	}
	
	TryAddItem(id,quantity) {
		for (let i = 0; i < this.contents.length; i++) {
			if (this.contents[i].id==id) {
				this.contents[i].quantity+=quantity;
				return true;
			}
		}
		if (this.contents.length>=size) {
			return false
		} else {
			append(this.contents, {id:id,quantity:quantity,item:items[id]})
			return true;
		}
	}

	TryRemoveItem(id,quantity) {
		for (let i = 0; i < this.contents.length; i++) {
			if (this.contents[i].id==id) {
				this.contents[i].quantity-=quantity;
				if (this.contents[i].quantity<=0) {
					this.contents.splice(i,1);
					return 0
				}
				return this.contents[i].quantity;
			}
		}
		return 0;
	}

	HasItem(id) {
		for (let item of this.contents) {
			if (item.id==id) {
				return true;
			}
		}
		return false;
	}

	GetScrollInt(cur,direction) {
		cur+=direction;
		if (cur<0) {
			cur = size-1;
		} else if (cur>=size) {
			cur = 0;
		}
	}
}