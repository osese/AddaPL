
function Terminal() {
	let terminal = this; 
	let histCommands = [];
	let hist_index = -1;
	let current_command = "";
	
	this.textarea = document.getElementById("shell");
	
	this.textarea.onkeyup = function(e){
		// console.log(e.keyCode);
		
		if(e.keyCode == 13){		// Enter key 
			e.preventDefault();
			terminal.hist();
			hist_index = histCommands.length;
			current_command = this.value.slice(0,-1);
			this.value = "";
			terminal.exec();
		}else if(e.keyCode == 38){  // Up Arrow 
			e.preventDefault();
			if(hist_index >= 0 && hist_index < histCommands.length){
				terminal.textarea.value = histCommands[hist_index];
				hist_index -= 1;
			}
		}else if(e.keyCode == 40){  // Down Arrow 
			e.preventDefault();
			if(hist_index >= -1 && hist_index < histCommands.length-1){
				hist_index += 1;
				terminal.textarea.value = histCommands[hist_index];
			}
		}
	}

	this.clearHist = function(){
		$( ".pis" ).each(function(index) {
			this.remove(); 	// remove all commands  
		});
	}
	
	this.exec   = function(){
		histCommands.push(current_command);
		gramer.parse(current_command + " $");
	}
	
	this.result = function(str){
		let p = document.createElement('li');
		p.className = "pis";
		p.innerHTML = str ; 
		let h = document.getElementById("hist")
		h.insertBefore(p, h.childNodes[0]);
	}
	
	this.hist   = function(){
		terminal.result("-> "+ $("#shell").val());
	}
}
