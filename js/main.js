var Cell = function(number){
  this.n = number;
  this.selected = false;
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
var Grid = function(size){
  this.grid = [];
  this.size = size;
  for(var i=0; i<size; i++){
    this.grid[i]=[];
    for(var k=0; k<size; k++) this.grid[i][k]= new Cell(0);
  }
  this.selectedCells = [];
  this.selectedSum = 0;
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
      if(cell.n + this.selectedSum <= 9) {
        this.selectCell(cell,i,k);
        if(this.selectedSum === 9){
          this.removeSelectedCells(handler);
          return true;
        }
      }
    }
  }
};
Grid.prototype.removeSelectedCells = function(handler){
  console.log('removing');
  for(var i in this.selectedCells){
    var c = this.selectedCells[i];
    this.grid[c.x][c.y].selected = false;
    this.grid[c.x][c.y].n = 0;
  }
  this.selectedCells = [];
  this.selectedSum = 0;
  this.shiftsCells(handler);
};
Grid.prototype.shiftsCells = function(handler){
  console.log('shifting');
  for(var i = 0; i < this.size; i++){
    console.log({i:i, ind: this.findEmpty(this.grid[i]), grid: this.grid[i]});
    while(this.findEmpty(this.grid[i]) > 0){
      k=0;
      for(var k = this.findEmpty(this.grid[i]); k >= 0; k--){
        if(k===0)
          this.grid[i][k].n = 0;
        else
          this.grid[i][k] = this.grid[i][k-1];
      }
    }
  }
};
Grid.prototype.findEmpty = function(ar){
  for(var i in ar){
    if(ar[i].n === 0) return parseInt(i);
  }
  return -1;
};
var View = function(grid){
  this.grid = grid;
  this.parent = '';
};
View.prototype.drawGrid = function(parent){
  var view = this;
  this.parent = parent;
  var eGrid = j(parent).get('#grid').e();
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
  parent.appendChild(eGrid);
};
View.prototype.drawCell = function(cell, k, i){
  var view = this;
  var eCell = document.createElement('div');
  eCell.id = 'cell_'+i+'_'+k;
  eCell.classList.add('cell');
  eCell.onclick = function(e){
    console.log('click');
    view.manageSelect(cell,i,k);
    view.drawGrid(view.parent);
  };
  console.log(cell);
  if(cell.isEmpty()){
      eCell.classList.add('empty');
  } else {
    if(cell.selected){
      eCell.classList.add('selected');
    }
    eCell.innerHTML = cell.n;
  }
  return eCell;
};
View.prototype.manageSelect = function(cell,i,k){
  this.grid.trySelectCell(cell,i,k);
  var eCell = j('#cell_'+i+"_"+k).e();
  if(cell.selected)
    eCell.classList.add('selected');
  else
    eCell.classList.remove('selected');
};
var Game = function(){
  this.grid = new Grid(9);
  this.grid.fillEmpty();
  var view = new View(this.grid);
  view.drawGrid(j('#container').e());
};
var main = new Game();
