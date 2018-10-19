
function Terminal() {
	let terminal = this; 
	let history = [];
	let output = [];
	let hist_index = -1;
	let current_command = "";
	this.hist = $('#hist');

	this.textarea = document.getElementById("term");
	
	this.textarea.onkeyup = function(e){
		// console.log(e.keyCode);
		
		if(e.keyCode == 13){		// Enter key 
			e.preventDefault();
			hist_index = history.length;
			//current_command = this.value.slice(0,-1);
			current_command = this.value.replace('\n', '');
			this.value = "";
			terminal.exec();
		}else if(e.keyCode == 38){  // Up Arrow 
			e.preventDefault();
			if(hist_index >= 0 && hist_index < history.length){
				terminal.textarea.value = history[hist_index];
				hist_index -= 1;
			}
		}else if(e.keyCode == 40){  // Down Arrow 
			e.preventDefault();
			if(hist_index >= -1 && hist_index < history.length-1){
				hist_index += 1;
				terminal.textarea.value = history[hist_index];
			}
		}else if(e.keyCode == 27){ // ESC 
			terminal.textarea.value = "";
		}
	}

	$('#hist').click(function(e){
		if(e.target.tagName == "BUTTON"){
			//console.log(e.target.innerText.split('.')[1]);
			let index = parseInt(e.target.innerText.split('.')[0]);
			$('#term').val(history[index-1]);
		}
	});

	$('#calistirbtn').click(function(e){
		hist_index = history.length;
		//current_command = this.value.slice(0,-1);
		current_command = $('#term').val().replace('\n', '');
		$('#term').val("");
		terminal.exec();
	});

	$('#temizlebtn').click(function(){
		terminal.textarea.value = "";

	});
	
	this.clearHist = function(){
		$( ".pis" ).each(function(index) {
			this.remove(); 	// remove all commands  
		});
	}
	
	this.exec = function(){
		history.push(current_command);
		try{
			gramer.parse(current_command + " $");
			this.result("success");
		}catch(e){
			// bir hata oluştu 
			this.result("fail");
		}
	}
	
	this.result = function(state){
		let html = "";
		let x = current_command;
		if(current_command.length > 20){
			x = x.slice(0, 20);
			x += "...";
		}


		if(state == "fail"){
			html = `<li class="pis"><button class="btn-fail">${history.length}. ${x}</button></li>`; 
		}else{
			html = `<li class="pis"><button class="btn-scss">${history.length}. ${x}</button></li>`; 
		}

		let h = document.getElementById("hist")
		$('#hist').append(html);
	}
	
	this.hist   = function(){
		terminal.result(history.length+". "+ current_command);
	}

	this.yaz = function(text){
		let html = `<li> ${text} </li>`;
		$('#output-list').append(html);
	}

	this.outputTemizle = function(){
		$('$output-list').empty();
	}
}
