function BreakBlock(id) {
	if (selected==null) return false
	let key = `${selected.x},${selected.y},${selected.z}`
	let key2d = `${selected.x},${selected.z}`

	if (placedBlocks[key]==null) {
		blockData = getBlockData(selected.x,selected.y,selected.z);
		if (blockData.solid && !blockData.artificial && !(blockData.unbreakable??false)) {
			placedBlocks[key]=blockList['2'];
			player.inventory.TryAddItem(blockData.type,1);
		}
	} else {
		if (placedBlocks[key].id=='2') return false;
		placedBlocks2D[key2d]-=1
		if (placedBlocks2D[key2d]<=0) placedBlocks2D[key2d]=null;
		player.inventory.TryAddItem(placedBlocks[key].id,1);
		if (placedBlocks[key].onEmpty??false) placedBlocks[key]=blockList['2'];
		else placedBlocks[key]=null;
	}
	player.timer.Set(0)
	return true;
}

function PlaceBlock(id) {
	if (selected==null) {
		return false;
	}
	let key = `${selected.x},${selected.y},${selected.z}`
	let key2d = `${selected.x},${selected.z}`

	let blockData = getBlockData(selected.x,selected.y,selected.z);
	if (blockData.solid) return false;
	if (placedBlocks[key]!=null) {
		if (placedBlocks[key].id=='2') {
			//placedBlocks2D[key2d]=placedBlocks2D[key2d]??0+1;
			let block = blockList[id]
			if (block.natural??false) {
				if (block.id==getNaturalBlockData(selected.x,selected.y,selected.z).type) {
					placedBlocks[key]=null;
					//placedBlocks[key]=block[id];
					return true;
				}
			}
			if (placedBlocks2D[key2d]==null) placedBlocks2D[key2d] = 1;
			else placedBlocks2D[key2d] = placedBlocks2D[key2d] + 1;	placedBlocks[key]=blockList[id];
			placedBlocks[key]=blockList[id];
			placedBlocks[key].onEmpty=true;
			return true;
		} else return false
	}
	if (placedBlocks2D[key2d]==null) placedBlocks2D[key2d] = 1;
	else placedBlocks2D[key2d] = placedBlocks2D[key2d] + 1;	placedBlocks[key]=blockList[id];
	player.timer.Set(0)
	return true;
}

function PlaceBlockFromContainer(id) {
	let container = player.inventory;
	if (container.HasItem(id)) {
		if (PlaceBlock(id)) {
			container.TryRemoveItem(id,1);
		}
	}
}

let blockList = {
	'0':{id:'0',r:184, g:93, b:77}, //RED
	'1':{id:'1',r:0, g:255, b:255}, //CYAN
	'2':{id:'2', solid:false}, //PLACED AIR
	'3':{id:'3', natural:true}, //NATURAL GRASS
	'4':{id:'4', natural:true}, //NATURAL STONE
	'5':{id:'5', natural:true}, //NATURAL DIRT
	'6':{id:'6', natural:true}, //NATURAL STONE WALL
	'7':{id:'7', natural:true}, //NATURAL WATER
	'8':{id:'8', natural:true}, //NATURAL AIR
	//2-32 reserved for natural blocks.
}

function ItemFunctionTeleport(id) {
	let container = player.inventory;
	if (container.HasItem(id)) {
		pos = preciseSelected;
		pos.y-=len/2+0.5
		container.TryRemoveItem(id,1)
	}
	player.timer.Set(1)
	return true;
}

function DebugGetNatural() {
	print(getNaturalBlockData(selected.x,selected.y,selected.z));
}

function DebugGetAll() {
	print(getBlockData(selected.x,selected.y,selected.z));
}