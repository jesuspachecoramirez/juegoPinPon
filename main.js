(function(){//función que crea y recoge los datos del pizarron o fondo que se utilizara
  self.Board = function(width,height){
  	//atributos que se reciben y se utilizan en el transcurso del programa
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
(function(){//Funcion que recibe los parametros y crea la pelota del juego, con las dimenciones y ubicacion proporcionada
	self.Ball=function(x,y,radius,board){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speed_y=0;
        this.speed_x=3;
        this.board=board;
        this.direction=1;
        this.bounce_angle=0;
        this.max_bounce_angle=Math.PI/12;
        this.speed= 8;
        board.ball=this;
        this.kind="circle";

       
	}
	 self.Ball.prototype={
        	move: function(){//determina la velocidad y lugar en el mapa que tendra la bola en cada momento
        		this.x +=(this.speed_x * this.direction);
        		this.y +=(this.speed_y);
        	},
        	get width(){
        		return this.radius * 2;
        	},         //getter de las dimensiones planas de la pelota
        	get height(){
        		return this.radius * 2;
        	},
        
        	collision: function(bar){
        		//reacciona a la colicion con una barra que recibe como parametro
        		//calcula el angulo al cual se movera la pelota luego de la colición
        		var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;

        		var normalized_intersect_y= relative_intersect_y / (bar.height/2);

        		this.bounce_angle= normalized_intersect_y * this.max_bounce_angle;

        		this.speed_y=this.speed * -Math.sin(this.bounce_angle);
        		this.speed_x=this.speed * Math.cos(this.bounce_angle);
                //cambia la direccion dependiente de la barra a la cual golpee 
        		if(this.x > (this.board.width /2)) this.direction=-1;
        		else this.direction= 1;
        

        	}
        }
})();
(function(){//funcion que termina las barras, recibiendo los parametros y ubicandolas en el tablero
	self.Bar= function(x,y,width,height,board){
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		this.board=board;
		this.board.bars.push(this);
		this.kind="rectangle";
		this.speed=30;
	}
//se modifica el prototipo de la clase anterior con un elemento JSON, donde se utiliza un getter para obtener los elementos
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

(function(){//Funcion que recibe el elementos canvas y dibuja el tablero basado en los datos asignados
	self.BoardView= function(canvas,board){
		this.canvas=canvas;
		this.canvas.width = board.width;//se recibe los parametros para dibujar el tablero
		this.canvas.height = board.height;
		this.board=board;
		this.ctx= canvas.getContext("2d");//se genera un contexto para poder dibujar el tablero
	}

	self.BoardView.prototype ={
		clean: function(){//Limpia el tablero para poder actualizar el lugar de las barras
			this.ctx.clearRect(0,0,this.board.width,this.board.height);
		},
		draw: function(){//dibuja la nueva posicion de las barras laterales
			for(var i=this.board.elements.length -1; i>=0; i--){
				var el= this.board.elements[i];

				draw(this.ctx,el);
			};

		},
		check_collisions: function(){
                                      //función que determina si la bola choca con una barra y con cual lo hace
			for(var i=this.board.bars.length-1;i>=0;i--){
				var bar = this.board.bars[i];
				console.log(bar);
				if(hit(bar,this.board.ball)){
            this.board.ball.collision(bar);
				}
			}
		},
		play: function(){//determina el comienzo del juego y envia la orden de utilizacion de las funciones anteriores
			if(this.board.playing){
				this.clean();
        this.draw();
        this.check_collisions();
        this.board.ball.move();

			}
			
		}
	}
    function hit(a,b){
    		//revisa si a colisiona con b
    	var hit=false;
        //colisiones horinzontales
        if(b.x + b.width >= a.x && b.x < a.x +a.width){
           //colisiones verticales
           if(b.y+b.height >=a.y && b.y<a.y+a.height){
        			hit=true;
           }
        	}
        //colision de a con b
        if(b.x<=a.x && b.x+b.width>=a.x+a.width){
        	 if(b.y<=a.x && b.x + b.width>=a.x + a.width){
        		hit=true;
        	}
         }
         //Colisión b con a
         if(a.x<=b.x && a.x + a.width >=b.x + b.width){
         	 if(a.y<=b.y && a.y + a.height>=b.y + b.height){
         		hit=true;
         	}
         }
         return hit;
         console.log(hit);

    }
    function draw(ctx, element){// funcion swicht que se encarga de recibir los parametros de los elementos que seran dibujados
    	switch(element.kind){
    	  case "rectangle":
    	    ctx.fillRect(element.x,element.y,element.width,element.height);
    		   break;
          case "circle": 
            ctx.beginPath();
            ctx.arc(element.x,element.y,element.radius,0,7);
            ctx.fill();
            ctx.closePath();
            break;
    	}
    	
    	
    }

})();

 var board = new Board(900,500);// se brindan los datos de tamaño para el tablero
 var bar = new Bar(0,100,15,100,board)//se brindan los datos del tamaño y posicion en el tablero de una de las barras
 var bar_2 = new Bar(885,100,15,100,board)//se brindan los datos del tamaño y posicion en el tablero de una de la siguiente barra
 var canvas = document.getElementById("canvas");//se llama el objeto canvas por su id
 var board_view = new BoardView(canvas,board);//aplica y envia los datos recibidos
 var ball= new Ball(350,100,10,board);//se brindan los datos del tamaño de la pelota con la que se juega



document.addEventListener("keydown",function(ev){//se crea un evento donde cada vez que se presione la tecla realizara el proceso
		
		if(ev.keyCode==38){//se especifica el numero de tecla para realizar el movimiento
			ev.preventDefault();//funcion que previene que la tecla que se esta usando reaccione a otro comando durante el juego
			bar_2.up();
		}
		else if(ev.keyCode==40){
			ev.preventDefault();
			bar_2.down();
		}
		else if(ev.keyCode==87){
			ev.preventDefault();
			//w
			bar.up();
		}else if(ev.keyCode==83){
			ev.preventDefault();
			//s
			bar.down();
		}else if(ev.keyCode===32){// se especifica que con la tecla designada el juego entre en pausa
			ev.preventDefault();
			board.playing = !board.playing;
		}

		console.log(""+bar_2);


});

board_view.draw();// comienza el dibujo cuando la funcion controller envia la orden
 window.requestAnimationFrame(controller);


function controller(){//funcion main que realiza la orden de comienzo al programa
   board_view.play();
   window.requestAnimationFrame(controller);


}