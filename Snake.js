/**Snake.js
  it's Snake... in javascript
  
  uses jQuery, html5 canvas
  */


/**
 Gfx
 
 Used to abstract the drawing mechanisms. 
 */

var Gfx=function(ctx){
    this.ctx=ctx;
    /**
     Initialised any eventual variables for drawing.
     */

    this.drawRect=function(x,y,w,h,filled){
        if(filled===undefined){
            filled=true;
        }
        if(filled==true){
            this.ctx.fillRect(x,y,w,h);
        }else{
            this.ctx.strokeRect(x,y,w,h);
        }
    }

    this.drawSquare=function(x,y,sz,filled){
        this.drawRect(x,y,sz,sz,filled);
    }

    this.drawCircle=function(x,y,sz,text){
        this.ctx.beginPath();
        this.ctx.arc(x,y,sz,0,Math.PI*2,true);    
        this.ctx.stroke();
    }

}
 

/**
 Node

 acts as a poor-man's linked list
 **/
var Node=function(value,nextNode){
    this.val=value;
    this.next=nextNode;
}

//Node definition block
/**adds a node after the current node**/
Node.prototype.append=function(value){
    var N=new Node(value,this.next);
    this.next=N;
}

/**makeCircular

for when you want to have a circular list.
doesn't work on already-circular lists...
**/

Node.prototype.makeCircular=function(){
    var curNode=this;

    while(curNode.next!==null){
        curNode=curNode.next;
    }

    curNode.next=this;
}


/**
  Snake

  the snake.
  */


var Snake=function(){
    /**
     the ptList contains x,y pairs which represent the nodes of the snake
     **/

     //this is a bad initialisation example....
     this.ptList=new Node({x:5,y:5},null);
     this.ptList.append({x:6,y:5});
     this.ptList.append({x:7,y:5});

     this.ptList.makeCircular();

     this.head=this.ptList.next.next;

     this.tl=this.ptList;
     /*
      direction: 1= left
                 2= up;
                 4= right;
                 8= down;
                */
                
     this.direction=4;

}
//prototype definition block

/**
 adds one part to the tail.
 how this works is that we just duplicate the tail. after a "step", the new tail will have moved to become the new head, so the old tail will still "exist". 

 THE README. READ IT (Wayne Jarvis voice)
 **/

Snake.prototype.lengthen=function(){
    //the notation for the value is to make a copy of 
    this.head.append({x:this.tl.val.x,y:this.tl.val.y});
    this.tl=this.head.next;
    //THAT'S IT. Crazy
}

/**
 move forward a "beat". This moves according the current direction and that's it. 
 */
Snake.prototype.tick=function(){
    var newPos;
    var hd=this.head;
    switch(this.direction){
        case 1://left
            newPos={x:hd.x-1,y:hd.y};
            break;
        case 2://up
            newPos={x:hd.x,y:hd.y-1};
            break;
        case 4://right
            newPos={x:hd.x+1,y:hd.y};
            break;
        case 8:
            newPos={x:hd.x,y:hd.y+1};
            break;
        default:
            newPos={x:hd.x,y:hd.y};
    }

    //here I "move the tail". 

    //THE README. READ IT

    this.tl.val=newPos;

    /**
     this part's a little tricky...
     seeing how the tl is placed at the head, the head goes towards the tail and the tail's next becomes the new tail... got it...?
     (see pseudo-drawing in the README for an idea of how this works...)
     **/
     //this.head.next=tl;//this is always true... so no need to do it ourselves
     this.head=this.tl;
     this.tl=tl.next;
     //CRAAAAZY! basically the structure works by itself.
}

/**
 checks if the snake is present at a certain point (except for the head)

 coords={x,y}
 **/
Snake.prototype.atPoint=function(coord){
    var curNode=this.tl;
    do{
        //check for colision with this point....
        if(coord.x==curNode.val.x && coord.y==curNode.val.y){
            return true;
        }

        curNode=curNode.next;
    }while(curNode!==this.head);

    return false;
}

Snake.prototype.draw=function(GfxObj,sz){
    var curNode=this.tl;
    do{
        GfxObj.drawRect(curNode.val.x*sz,curNode.val.y*sz,sz);
        curNode=curNode.next;
    }while(curNode!==this.tl);

}

/**
 randomInt(n)

 returns a random integer in [0,n[
 */
var randomInt=function(n){
    return Math.floor(Math.random()*n);
}

var World=function(dimensions){
    this.nugget={x:Math.random(dimensions.x),y:Math.random(dimensions.y)};
    this.s=new Snake();
    this.dim=dimensions;
    this.score=0;
}

World.prototype.inputUpdate=function(evt){
    //left=37
    //up=38
    //right=39
    //down=40
    var x;
    switch(evt.keyCode){
        case 37:
            x=1;
            break;
        case 38:
            x=2;
            break;
        case 39:
            x=4;
            break;
        case 40:
            x=8;
            break;
        default:
            x=this.s.direction;
    }
    this.s.direction=x;
}

World.prototype.generateNugget=function(){
    var hd=this.s.head;
    this.nugget=hd;
    while(this.nugget.x==hd.x || this.nugget.y==hd.y || this.s.atPoint(this.nugget)){
        this.nugget={x:Math.random(dimensions.x),y:Math.random(dimensions.y)};
    }
}

World.prototype.tick=function(){
    this.inputUpdate();
    this.s.tick();

    var hd=s.head;
    if(hd.x<0 ||
    hd.x>=this.dim.x ||
    hd.y<0 ||
    hd.y>=this.dim.y ||
    this.s.atPoint(hd)){
        //game over, man!
    }

    if(hd.x==this.nugget.s.x && hd.y==this.nugget.s.y){
        //got nugget
        this.score++;
        this.generateNugget();
    }

    //can't forget to set the timeout again

    setTimeout(this.loopFunction,500);

}

World.prototype.draw=function(GfxObj,sz){
    //draw a box around the gameworld
    GfxObj.drawRect(0,0,this.dim.x,this.dim.y,false);
    GfxObj.drawText(this.nugget.val.x*sz,this.nugget.val.y*sz,sz,'+');
    this.snake.draw(GfxObj,sz);
}
/**
 to be called when the game wants to be started
 */
World.prototype.init=function(id,sz){
    if(selector===undefined){
        selector="canvas.snake";
    }
    $(selector).keydown(inputUpdate);
    var obj=document.getElementById(id);
    obj.onkeydown=this.inputUpdate;
    var ctx=obj.getContext("2d");
    var gfx=new Gfx(ctx);

    this.loopFunction=function(){
        this.draw(gfx,sz);
        this.tick();   
    }
    setTimeout(this.loopFunction,500);
}