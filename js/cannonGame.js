// Create manually in the console with :
// var can = new cannonCanvas
// receives 2 parameters as string, cannonColor and ballColor
// to use manually please remove the first line of createEl function which deletes the button

class cannonCanvas {
	constructor(cannonColor = '#ccc', ballColor = 'red') {
		this.cannonColor = cannonColor;
		this.ballColor = ballColor;
		this.cannon = null;
		this.key = this.unique();
		this.shots = [];
		this.el = this.createEL();
		this.domRect;
		this.animate = this.animate.bind(this);
		this.shot = function(x, y, dx, dy) {
			this.x = x;
			this.y = y;
			this.dx = dx;
			this.dy = dy;
		};
		this.animID;
	}

	createEL(el = 'div') {
		document.querySelector('.start-btn').remove();
		let element = document.createElement(el);
		element.setAttribute(`class`, `container-${this.key}`);
		element.addEventListener('mousedown', this.handleClick.bind(this));
		element.addEventListener('mousemove', this.startShooting.bind(this));
		element.innerHTML += `<canvas class="can-${this.key}" />`;
		document.body.appendChild(element);
		this.drawCanvas();
		this.domRect = document.querySelector(`.can-${this.key}`).getBoundingClientRect();
		return 'Working with unique key';
	}

	startShooting(ev) {
		if (ev.which !== 1) return false;
		if (ev.type === 'mousemove') {
			console.log('creating shot');
			return this.createShot(ev);
		}
	}

	handleClick(ev) {
		if (ev.which !== 1) return false;
		let w = this.domRect.width;
		let h = this.domRect.height;
		let xOffset = this.domRect.left;
		let yOffset = this.domRect.top;
		let [x, y] = [ev.clientX - this.domRect.left, ev.clientY - this.domRect.top];
		let isInBound =
			x <= w + xOffset - 15 - 1 &&
			x >= xOffset + 15 + 1 &&
			y <= h + yOffset - 15 - 1 &&
			y >= yOffset + 15 + 1;
		if (isInBound && !this.cannon) {
			this.cannon = { placed: true, x, y };
			return this.drawCanvas();
		} else if (this.cannon) {
			let isCollision = this.isIntersect({ x, y }, this.cannon);
			if (isCollision) {
				console.log('cannon removed');
				this.cannon = null;
				return this.drawCanvas();
			}
		}
		this.createShot(ev);
		return (this.animID = requestAnimationFrame(this.animate));
	}

	isIntersect(point, circle) {
		return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < 15;
	}

	drawCanvas() {
		let canvas = document.querySelector(`[class="can-${this.key}"]`);
		let ctx = canvas.getContext('2d');
		canvas.width = 650;
		canvas.height = 350;
		canvas.style.border = '1px solid';
		ctx.fillStyle = 'rgba(255, 255, 255, 1)';
		ctx.fillRect(0, 0, 650, 350);
		if (this.cannon) {
			ctx.fillStyle = this.cannonColor;
			ctx.beginPath();
			ctx.arc(this.cannon.x, this.cannon.y, 15, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();
		}
	}

	drawShot(x, y) {
		let canvas = document.querySelector(`[class="can-${this.key}"]`);
		let ctx = canvas.getContext('2d');
		ctx.fillStyle = this.ballColor;
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	createShot(ev) {
		if (!this.cannon) return false;
		let diffX = ev.clientX - this.cannon.x;
		let diffY = ev.clientY - this.cannon.y;
		const magnitude = Math.sqrt(diffX * diffX + diffY * diffY);
		let dx = diffX / magnitude;
		let dy = diffY / magnitude;
		this.shots.push(new this.shot(this.cannon.x, this.cannon.y, dx, dy));
	}

	animate() {
		if (this.animID) cancelAnimationFrame(this.animID);
		if (this.shots.length === 0) return;
		let w = this.domRect.right;
		let h = this.domRect.height + this.domRect.top;

		this.shots = this.shots.filter(shot => {
			shot.x += shot.dx;
			shot.y += shot.dy;
			return shot.x >= 0 && shot.x <= w && shot.y > 0 && shot.y <= h;
		});

		this.drawCanvas();

		for (var i = 0; i < this.shots.length; i++) {
			this.drawShot(this.shots[i].x, this.shots[i].y);
		}
		return (this.animID = requestAnimationFrame(this.animate));
	}
	// utility function
	unique() {
		var key = '';
		var abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
		for (var i = 0; i < 6; i++) {
			key += abc[parseInt(Math.random() * 36)];
		}
		return key;
	}
}
