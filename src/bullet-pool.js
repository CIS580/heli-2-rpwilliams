module.exports = exports = BulletPool;

function BulletPool(maxSize) {
	this.pool = new Float32Array(4 * maxSize);
	this.end = 0;
	this.max = maxSize;
}

BulletPool.prototype.add = function(position, velocity) {
	if(this.end < this.max) {
		this.pool[4*this.end+0] = position.x;	// an array of structs doesnt actually exist so we use offsets
		this.pool[4*this.end+1] = position.y;
		this.pool[4*this.end+2] = velocity.x;
		this.pool[4*this.end+3] = velocity.y;
		this.end++;
	}
}

BulletPool.prototype.update = function(elapsedTime, callback) {
	for(var i = 0; i < this.end; i++) {
		this.pool[4*i] += this.pool[4*i+2];
		this.pool[4*i+1] += this.pool[4*i+3];
		if(callback({
			x: this.pool[4*i],
			y: this.pool[4*i+1]
		})) {
			// Object dead
			this.pool[4*i] = this.pool[4*(this.end-1)];
			this.pool[4*i+1] = this.pool[4*(this.end+1)];
			this.pool[4*i+2] = this.pool[4*(this.end+2)];
			this.pool[4*i+3] = this.pool[4*(this.end+3)];
			this.end--;
			i--;
		}
	}
}

BulletPool.prototype.render = function(elapsedTime, ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "black";
	for(var i = 0; i < this.end; i++) {
		ctx.moveTo(this.pool[4*i], this.pool[4*i+1]);
		ctx.arc(this.pool[4*i], this.pool[4*i+1], 2, 0, 2*Math.PI);
	}
	ctx.fill();
	ctx.restore();
}