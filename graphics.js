
var W = 1200 ;
var H = 600 ;

var drawables = [] 

var drawable_type = {
	line : 0,
	rect : 1, 
	ellipse : 2,	
};

class Drawable{
	constructor(type, X, Y, C){
		this.type = type;
		this.begin = X ;
		this.end   = Y ;
		this.color = "#000000";
		if(C){
			this.color = C ;
		}
	}
}
function linEqGen(type, x1, y1, x2, y2){
	if(type == "X"){
		return function(X){
			return (( y2 - y1)* (X - x2) )/ (x2 - x1) + y2 
		}
	}else{
		return function(Y){
			return ((Y-y2)*(x2-x1))/(y2-y1) + x2 
		}
	}
}

var Kurbaga = {
	pos: new Point2D(W/2, H/2),
	
	dir: new Point2D(0, 1),
	
	pen: true,
	
	pencolor: "#000000",  	// default color is black 
	
	background: "#FF00FF",	// default background is Pink 
	
	arrow : { 
		show : true,
		
		scale: 10,
		forward: function(){
			this.pos1.set(this.pos1_c.x + Kurbaga.pos.x, this.pos1_c.y + Kurbaga.pos.y)
			this.pos2.set(this.pos2_c.x + Kurbaga.pos.x, this.pos2_c.y + Kurbaga.pos.y)
			this.pos3.set(this.pos3_c.x + Kurbaga.pos.x, this.pos3_c.y + Kurbaga.pos.y)
		},
		
		rotate: function(){
			let angle = Math.atan2(Kurbaga.dir.x, Kurbaga.dir.y);
			angle = angle * 180 / Math.PI
			this.pos1_c.x = this.scale 
			this.pos1_c.y = 0
			this.pos2_c.x = 0
			this.pos2_c.y = -this.scale 
			this.pos3_c.x = -this.scale 
			this.pos3_c.y = 0
			this.pos1_c.rot(-angle);
			this.pos2_c.rot(-angle);
			this.pos3_c.rot(-angle);
			this.pos1.set(Kurbaga.pos.x + this.pos1_c.x , Kurbaga.pos.y + this.pos1_c.y);
			this.pos2.set(Kurbaga.pos.x + this.pos2_c.x , Kurbaga.pos.y + this.pos2_c.y);
			this.pos3.set(Kurbaga.pos.x + this.pos3_c.x , Kurbaga.pos.y + this.pos3_c.y);
		},
		
		pos1_c : new Point2D(0,0),
		pos2_c : new Point2D(0,0),
		pos3_c : new Point2D(0,0),
		pos1: new Point2D(0,0),
		pos2: new Point2D(0,0),
		pos3: new Point2D(0,0),
		
		init : function(){
			this.pos1.x = this.scale + Kurbaga.pos.x;
			this.pos1.y = Kurbaga.pos.y;
			this.pos2.x = Kurbaga.pos.x; 
			this.pos2.y = -this.scale + Kurbaga.pos.y
			this.pos3.x = -this.scale + Kurbaga.pos.x; 
			this.pos3.y = Kurbaga.pos.y;
		
			this.pos1_c.x = this.scale 
			this.pos1_c.y = 0
			this.pos2_c.x = 0
			this.pos2_c.y = -this.scale 
			this.pos3_c.x = -this.scale 
			this.pos3_c.y = 0
		},
	},
	
	forward: function(dX_vector){
		let kurbaga_pos_old = new Point2D(Kurbaga.pos.x, Kurbaga.pos.y);
		Kurbaga.pos.add(dX_vector);
		kurbaga_pos_new = new Point2D(Kurbaga.pos.x, Kurbaga.pos.y);
		if(Kurbaga.pen){
			let obj = new Drawable(drawable_type.line, kurbaga_pos_old, kurbaga_pos_new);
			obj.color = Kurbaga.pencolor;
			drawables.push(obj);	// push object into array
		}
		Kurbaga.arrow.forward();		// Update the arrow 
	},
	setpos: function(x, y){
		Kurbaga.pos.x = x ;
		Kurbaga.pos.y = y ;
	},
	safeforward: function(dX){
		let dX_vector = muls2D(Kurbaga.dir, dX);
		let old_pos = Kurbaga.pos 
		let new_pos = add2D(Kurbaga.pos, dX_vector)
		
		let fx = linEqGen("X", new_pos.x, new_pos.y, old_pos.x, old_pos.y)
		let fy = linEqGen("Y", new_pos.x, new_pos.y, old_pos.x, old_pos.y)
		
		if(new_pos.x > W){
			drawables.push(new Drawable(drawable_type.line, new Point2D(old_pos.x, old_pos.y), 
							new Point2D(W, fx(W))));
			let left_x = old_pos.x + dX_vector.x - W
			drawables.push(new Drawable(drawable_type.line, new Point2D(0, fx(0)), 
							new Point2D(left_x, fx(left_x))));
			Kurbaga.setpos(left_x, fx(left_x));
		}else if(new_pos.y > H){
			drawables.push(new Drawable(drawable_type.line, new Point2D(old_pos.x, old_pos.y), 
							new Point2D(fy(H), H)));
			let left_x = old_pos.y + dX_vector.y - H
			drawables.push(new Drawable(drawable_type.line, new Point2D(fy(0), 0), 
							new Point2D(fy(left_x), left_x)));
			Kurbaga.setpos(fy(left_x), left_x);
		}else if(new_pos.x < 0){
			drawables.push(new Drawable(drawable_type.line, new Point2D(old_pos.x, old_pos.y), 
							new Point2D(0, fx(0))));
			let left_x = old_pos.x + dX_vector.x + W 
			drawables.push(new Drawable(drawable_type.line, new Point2D(W, fx(W)), 
							new Point2D(left_x, fx(left_x))));
			Kurbaga.setpos(left_x, fx(left_x));
		}else if(new_pos.y < 0){
			drawables.push(new Drawable(drawable_type.line, new Point2D(old_pos.x, old_pos.y), 
							new Point2D(fy(0), 0)));
			let left_x = old_pos.y + dX_vector.y + H
			drawables.push(new Drawable(drawable_type.line, new Point2D(fy(H), H), 
							new Point2D(fy(left_x), left_x)));
			Kurbaga.setpos(fy(left_x), left_x);
		} 
		else{
			Kurbaga.forward(dX_vector);	
		}
	},
	
	pendown: function(){
		Kurbaga.pen = true;
	},
	
	penup: function(){
		Kurbaga.pen = false;
	},
	setpencolor: function(X){
		Kurbaga.pencolor = X;
	},	
	rotate: function(X){
		Kurbaga.dir.rot(-X);
		Kurbaga.arrow.rotate();			// Update the arrow 
	},
	init : function(){
		Kurbaga.arrow.init();
	},
	reset: function(){
		Kurbaga.setpos(W/2, H/2);
		Kurbaga.arrow.init();
	}
};


function Point2D(x,y){
	this.x = x;
	this.y = y;
	this.add  = function(a){
		this.x += a.x; 
		this.y += a.y;
	}
	this.set = function (x, y){
		this.x = x;
		this.y = y;
	}
	this.add2 = function(a){
		return new Point2D(this.x + a.x , this.y + a.y);
	}
	
	this.sub  = function(a){
		this.x -= a.x;
		this.y -= a.y;
	}
	
	this.rot  = function(a){
		let angle = Math.PI * ( a / 180)
		let x1 = [ Math.cos(angle), -Math.sin(angle)];
		let x2 = [ Math.sin(angle), Math.cos(angle)];
		let n = this.x * x1[0] + this.y*x1[1];
		let m = this.x * x2[0] + this.y*x2[1];
		this.x = n;
		this.y = m;
	}
	// Multiply with a scalar 
	this.muls = function(a){
		return new Point2D(this.x * a, this.y * a);
	}
	this.length = function(){
		return Math.sqrt(this.x**2 + this.y**2);
	}
	return this;
}

function distance2d(p1 , p2){
	return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}
function muls2D(p1, s){
	// scalar times vector 
	return new Point2D(p1.x * s, p1.y*s);
}
function add2D(p1, p2){
	return new Point2D(p1.x + p2.x, p1.y + p2.y);
}
function sub2D(p1, p2){
	return new Point2D(p1.x - p2.x, p1.y - p2.y);
}

/*
Public functions 
----------------
dondur
forward 
pendown 
penup
clearscreen
setpencolor 
*/

var Graphics = {
rotate: function(x){
// Rotate the direction of the turtle x : (degree)
	Kurbaga.rotate(-x);
},

forward: function(x){	
// Go forward respect to turtle 
	Kurbaga.safeforward(-x);
},

pendown: function(){
	Kurbaga.pendown();
},

penup: function(){
	Kurbaga.penup();
},

clearscreen: function(){
// Clears the screen and reset the turtle 
	drawables = [];		
	Kurbaga.reset();
},

setpencolor: function(x){
// Pick the pen color 
// param x : "YELLOW", "#FF....", or index number 

	let Colors = {
		YELLOW: "#FFFF00",
		BLACK: 	"#000000",
		BROWN:	"#8B4513",
		GREEN: 	"#008000",
		YELLOWGREEN: "#9ACD32",
		TURQUOISE: "#40E0D0",
		SKYBLUE:  "#87CEEB",
		ORANGE:	  "#FFA500",
		BLUE :	   "#0000FF",
		WHITE: "#FFFFFF",
		GOLD: "#FFD700",
		PINK: "#FF00FF",
		GREY: "#808080",
	};
	
	Kurbaga.setpencolor(Colors[x]);
}

};


function setup(){
	let canvas = createCanvas(W, H);	
	canvas.parent("canvas-holder");
	Kurbaga.init();
}


function draw(){
	
	background(Kurbaga.background);
	
	for( var i=0; i<drawables.length; i++){
		if ( drawables[i].type == drawable_type.line ){
			stroke(drawables[i].color);  
			line(drawables[i].begin.x, drawables[i].begin.y, drawables[i].end.x, drawables[i].end.y);
		}else if(drawables[i].type == drawable_type.rect){
			stroke(drawables[i].color);
			line(drawables[i].begin.x, drawables[i].begin.y, drawables[i].end.x, drawables[i].end.y);
		}else if(drawables[i].type == drawable_type.ellipse){
			stroke(drawables[i].color);
			line(drawables[i].begin.x, drawables[i].begin.y, drawables[i].end.x, drawables[i].end.y);
		}
	}
	
	if(Kurbaga.arrow.show){
		stroke(255,255, 255);
		fill(30);
		
		triangle(Kurbaga.arrow.pos1.x, 
				Kurbaga.arrow.pos1.y, 
				Kurbaga.arrow.pos2.x, 
				Kurbaga.arrow.pos2.y, 
				Kurbaga.arrow.pos3.x, 
				Kurbaga.arrow.pos3.y
		);		
	}
	
}


