
let table = {} 
let ftable = {
	"a": function(x){
		x.forEach(function(e){console.log(e);});
	}
}

let komut_tipi = {
	TEKRAR: 1,
	DONDUR: 2,
	ILERI: 3,
	KA: 4,
	KB: 5,
	ET: 6,
	HATIRLA: 7,
	KAYDET: 8,
	YAZDIR: 9,
	RENK: 10,
	FUNCCALL: 11,
	FUNC: 12,
};


class Method{
	constructor(name, params, komutlar){
		this.name = name;
		this.komutlar = komutlar;
		this.params = params;
		this.table = {}; // func sym table
	}
	execute(args){
		var k = Object.assign({}, table);
		var t = this.params;
		var i =0;
		while(t != undefined){
			table[t.head] = args[i];
			i++;
			t = t.tail;
		}
		
		interpKomutlar(this.komutlar);
		table = Object.assign({}, k);
		term_.variableListRefresh();
	}
}


class Komut{
	constructor(t, x, y){
		this.tipi = t; 
		this.x = x ; 
		this.y = y ;
	}
}

class Komutlar{
	constructor(head, tail){	
		this.head = head; 
		this.tail = tail;
	}
}

let exp_ops = {
	PLUS : 1,
	MINUS: 2,
	TIME: 3,
	DIV	: 4,
	UMINUS: 5
};

class Exp_Op{
	constructor(e1, op, e2){
		this.e1 = e1;
		this.e2 = e2; 
		this.op = op;
	}
}
class Exp_Id{
	constructor(id){
		this.id = id; 
	}
}
class Exp_Num{
	constructor(num){
		this.num = num;
	}
}
class ExpList{
	constructor(head, tail){
		this.head = head;
		this.tail = tail;
	}
}
class IdList{
	constructor(head, tail){
		this.head = head;
		this.tail = tail;
	}
}
function interpIdList(idList){
	a = []; 
	let h = idList;
	
	while(h != undefined){
		a.push(h.head);
		h = h.tail;
	}
	return a;
}

function interpExpList(expList){
	console.log(expList);
	a = [];
	let h = expList;
	
	while(h != undefined){
		a.push(interpExp(h.head));
		h = h.tail;
	}
	return a;
}

function interpTekrar(komut){
	let k = interpExp(komut.x);
	let aa = komut.y ;	
	let tt = aa ;
	for(var i=0; i<k; i++){	
		while(aa instanceof Komutlar){
			interp(aa.head);
			aa = aa.tail;
		}		
		interp(aa);
		aa = tt ;
	}
}

function interpKomutlar(komutlar){
	var aa = komutlar;
	while(aa instanceof Komutlar){
		interp(aa.head);
		aa = aa.tail;
	}		
	interp(aa);
	
}
function interpExp(exp){
	if(exp instanceof Exp_Id){
		return table[exp.id];
	}else if(exp instanceof Exp_Num){
		return exp.num;
	}else if(exp instanceof Exp_Op){
		switch(exp.op){
			case exp_ops.PLUS:
				return interpExp(exp.e1) + interpExp(exp.e2);	
			case exp_ops.MINUS:
				return interpExp(exp.e1) - interpExp(exp.e2);	
			case exp_ops.TIME:
				return interpExp(exp.e1) * interpExp(exp.e2);	
			case exp_ops.DIV:
				return interpExp(exp.e1) / interpExp(exp.e2);
			case exp_ops.UMINUS:
				return  -1 * interpExp(exp.e1); 
			default: 
				break;
		}
	}
}

function interp(komut){
	switch(komut.tipi){
		case komut_tipi.TEKRAR:
			// give it a shot 
			interpTekrar(komut); 	
			break; 
		case komut_tipi.DONDUR:
			Graphics.rotate(interpExp(komut.x)); 
			break; 

		case komut_tipi.ILERI:
			Graphics.forward(interpExp(komut.x));
			break;
		case komut_tipi.KA: 
			Graphics.pendown();
			break;
		case komut_tipi.KB:
			Graphics.penup();
			break;
		case komut_tipi.ET: 
			Graphics.clearscreen();
			break;
		case komut_tipi.KAYDET:
			let k = interpExp(komut.x);
			table[komut.y.id] = k ; 
			term_.variableListeEkle(komut.y.id, k);
			break;
		case komut_tipi.YAZDIR:
			term_.yaz(interpExp(komut.x));
			break;
		case komut_tipi.RENK: 
			Graphics.setpencolor(interpExp(komut.x));
			break;
		case komut_tipi.FUNCCALL:
			a = interpExpList(komut.y);
			ftable[komut.x].execute(a);
			break;
		case komut_tipi.FUNC:
			ftable[komut.x] = komut.y;
			break;
		case komut_tipi.Program:
			interpKomutlar(komut.x);
			break;
		default: 
			console.log("An error occur !! "); 
			break ;
	}
}



/*
	tekrar 10 [ sag 10 alt 10 sol 10 ust 10 ]
	new Komut(komut_tipi.TEKRAR, 10, 
		new Komutlar(new Komut(komut_tipi.SAG, 10), 
			new Komutlar(new Komut(komut_tipi.ALT, 10),
				new Komutlar(new Komut(komut_tipi.SOL, 10),
					new Komut(komut_tipi.UST, 10)))));
	
*/