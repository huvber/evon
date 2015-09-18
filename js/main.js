var Cell = function(number){
  this.n = number;
  this.selected = false;
  this.tried = false;
};
Cell.prototype.isEmpty = function(){
  return this.n === 0;
};
Cell.prototype.pick = function(){
  this.n = Math.floor((Math.random() * 6) + 1);
};
Cell.prototype.toogleSelect = function(){
  this.selected = ! this.selected;
};



var Grid = function(size,game){
  this.grid = [];
  this.size = size;
  this.game = game;
  for(var i=0; i<size; i++){
    this.grid[i]=[];
    for(var k=0; k<size; k++) this.grid[i][k]= new Cell(0);
  }
  this.selectedCells = [];
  this.selectedSum = 0;
  this.goal = 9;
  this.tscore = 0;
  this.tGroup = [];

};
Grid.prototype.forEach = function(handler){
  for(var i=0; i < this.size; i++){
    for(var k=0; k<this.size; k++){
      var c = this.grid[i][k];
      handler(c,i,k);
    }
  }
};
Grid.prototype.fillEmpty = function(){
  this.forEach(function(cell){
    if(cell.isEmpty()){
      cell.pick();
    }
  });
};
Grid.prototype.selectCell= function(cell,i,k){
  cell.toogleSelect();
  this.selectedCells.push({x:i, y:k, c: cell});
  this.selectedSum += cell.n;
};
Grid.prototype.trySelectCell = function(cell,i,k,handler){
  if(this.selectedCells.length === 0){
    this.selectCell(cell,i,k);
  } else {
    /**check if its near a selected cell **/
    var near = false;
    for(var c in this.selectedCells){
      var cl = this.selectedCells[c];
      if((cl.x === i &&( cl.y + 1 === k || cl.y -1 === k )) ||
         (cl.y === k &&( cl.x + 1 === i || cl.x -1 === i ))){
           near = true;
      }
    }
    if(near){
      if(cell.n + this.selectedSum <= this.goal) {
        this.selectCell(cell,i,k);
        if(this.selectedSum === this.goal){
          this.removeSelectedCells(handler);
          return true;
        }
      }
    }
  }
};
Grid.prototype.findNextCell = function(x,y,hOne,hFail){
  var g = this.grid;
  var c = g[x][y];
  if(c.n === 0) return false;
  var tscore = this.tscore;
  if((tscore + c.n) == 9){
    tscore += c.n;
    c.tried = true;
    this.tGroup.push({x: x,y:y, c:c});
    return true;
  }
  if((tscore + c.n ) < 9){
    tscore += c.n;
    c.tried = true;
    this.tGroup.push({x:x,y:y, c:c});
    hOne(x,y,c);
    if((x < this.n -1) &&
      this.findNextCell(x+1,y,hOne,hFail))
        return true;
    else if((x > 0 )&&
      this.findNextCell(x-1,y,hOne,hFail))
        return true;
    else if((y < this.n -1) &&
      this.findNextCell(x,y+1,hOne,hFail))
        return true;
    else if((y > 0) &&
      this.findNextCell(x,y-1,hOne,hFail))
        return true;
  }
  tscore -= c.n;
  this.tGroup.pop();
  return false;
};

Grid.prototype.removeSelectedCells = function(handler){
  console.log('removing');
  var tmpScore = 0;
  var factor = this.selectedCells.length;
  for(var i in this.selectedCells){
    var c = this.selectedCells[i];
    this.grid[c.x].splice(c.y,1);
    this.grid[c.x].unshift(new Cell(0));
    this.game.score += c.c.n * factor;
    handler(c);
  }
  this.selectedCells = [];
  this.selectedSum = 0;
};
Grid.prototype.findEmpty = function(ar){
  for(var i in ar){
    if(ar[i].n === 0) return parseInt(i);
  }
  return -1;
};
var View = function(grid,game){
  this.grid = grid;
  this.parent = '';
  this.game = game;
};

View.prototype.drawGrid = function(parent){
  var view = this;
  if(parent !== undefined)
    this.parent = parent;
  var eGrid = j('#'+this.parent.id).get('#grid').e();
  if( eGrid !== undefined && eGrid !== null ){
    eGrid.innerHTML = '';
  } else {
    eGrid = document.createElement('div');
  }
  eGrid.id = 'grid';
  eGrid.classList.add('grid');
  this.grid.forEach(function(cell,i,k){
    var eCell = view.drawCell(cell,k,i);
    eGrid.appendChild(eCell);
  });
  this.parent.appendChild(eGrid);
};
View.prototype.updateScore = function(){
  j('#score').text(this.game.score);
};
View.prototype.drawCell = function(cell, k, i){
  var view = this;
  var eCell = document.createElement('div');
  eCell.id = 'cell_'+i+'_'+k;
  eCell.classList.add('cell');
  eCell.onclick = function(e){
    view.manageSelect(cell,i,k);
  };
  if(cell.isEmpty()){
      eCell.classList.add('empty');
  } else {
    if(cell.selected){
      eCell.classList.add('selected');
    }
    if(cell.tried){
      eCell.classList.add('tried');
    }
    eCell.innerHTML = cell.n;
  }
  return eCell;
};
View.prototype.manageSelect = function(cell,i,k){
  var view = this;
  this.grid.trySelectCell(cell,i,k,function(sc){
    view.updateScore();
    if(!view.grid.findNextCell(0,0,function(){
      setTimeout(function(){view.drawGrid();},200);
    },function(){
      setTimeout(function(){view.drawGrid();},200);
    }))
      console.log('gameover');
  });
  var eCell = j('#cell_'+i+"_"+k).e();
  if(cell.selected)
    eCell.classList.add('selected');
  else
    eCell.classList.remove('selected');
};
var Game = function(){
  this.grid = new Grid(9,this);
  this.grid.fillEmpty();
  this.score = 0;
  var view = new View(this.grid,this);
  view.drawGrid(j('#container').e());
};
var main = new Game();
