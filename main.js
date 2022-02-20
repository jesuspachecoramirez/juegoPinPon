(function(){ //función que crea y recoge los datos del pizarron o fondo que se utilizara
  self.Board = function(width,height){
  	//variables que se reciben y se utilizan en el transcurso del programa
    this.width= width;
    this.height=height;
    this.playing=false;
    this.game_over=false;
    this.bars = [];
    this.ball=null;
    this.playing=false;

  }
// se modifica el prototipo de la clase anterior con un elemento JSON, donde se utiliza un getter para obtener los elementos
  self.Board.prototype = {
  	get elements(){
      var elements = this.bars.map(function(bar){return bar;});
      elements.push(this.ball);
      return elements;  
  	}
  }

})();

(function(){ //funcion que termina las barras, recibiendo los parametros y ubicandolas en el tablero
	self.Bar= function(x,y,width,height,board){
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		this.board=board;
		this.board.bars.push(this);
		this.kind="rectangle";
		this.speed=20;
	}

    self.Bar.prototype={// determina la funcion que tendras las barras dentro del tablero y la velocidad recibida de la funcion anterior
    	down: function(){
            this.y +=this.speed;
    	},
    	up: function(){
    		this.y -= this.speed;

    	},
    	toString: function(){
    		return "x: "+this.x +"y: "+this.y;
    	}
    }
})();

(function(){ //Funcion que recibe el elementos canvas y dibuja el tablero basado en los datos asignados
	self.BoardView= function(canvas,board){
		this.canvas=canvas;
		this.canvas.width = board.width; //se recibe los parametros para dibujar el tablero
		this.canvas.height = board.height;
		this.board=board;
		this.ctx= canvas.getContext("2d"); //se genera un contexto para poder dibujar el tablero
	}
//se modifica el prototipo de la clase anterior con un elemento JSON, donde se utiliza un getter para obtener los elementos
	self.BoardView.prototype ={
		clean: function(){ //Limpia el tablero para poder actualizar el lugar de las barras
			this.ctx.clearRect(0,0,this.board.width,this.board.height);
		},
		draw: function(){ //dibuja la nueva posicion de las barras laterales
			for(var i=this.board.elements.length -1; i>=0; i--){
				var el= this.board.elements[i];

				draw(this.ctx,el);
			};

		},
		
		play: function(){ //determina el comienzo del juego y envia la orden de utilizacion de las funciones anteriores
			if(this.board.playing){
				this.clean();
                this.draw();
                this.board.ball.move();

			}
			
		}
	}
   

    }
    function draw(ctx, element){// funcion swicht que se encarga de recibir los parametros de los elementos que seran dibujados
    	switch(element.kind){
    	  case "rectangle":
    	    ctx.fillRect(element.x,element.y,element.width,element.height);
    		   break;
          
    	}
    	
    	
    }

})();

 var board = new Board(800,400);// se brindan los datos de tamaño para el tablero
 var canvas = document.getElementById("canvas");//se llama el objeto canvas por su id
 var bar = new Bar(20,100,40,100,board);//se brindan los datos del tamaño y posicion en el tablero de una de las barras
 var bar_2 = new Bar(735,100,40,100,board);//se brindan los datos del tamaño y posicion en el tablero de una de la siguiente barra
 var board_view = new BoardView(canvas,board);//aplica y envia los datos recibidos


document.addEventListener("keydown",function(ev){//se crea un evento donde cada vez que se presione la tecla realizara el proceso
		
		if(ev.keyCode==38){
			ev.preventDefault();
			bar.up();
		}
		else if(ev.keyCode==40){
			ev.preventDefault();
			bar.down();
		}
		else if(ev.keyCode==87){
			ev.preventDefault();
			//w
			bar_2.up();
		}else if(ev.keyCode==83){
			ev.preventDefault();
			//s
			bar_2.down();
		}





board_view.draw();// comienza el dibujo cuando la funcion controller envia la orden
 window.requestAnimationFrame(controller);
 


function controller(){ //funcion main que realiza la orden de comienzo al programa
   board_view.play();
   window.requestAnimationFrame(controller);



}