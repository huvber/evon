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
Grid.prototype.trySelectCell = function(cell,i,k){
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
          this.removeSelectedCells();
          return true;
        }
      }
    }
  }
};
Grid.prototype.removeSelectedCells = function(){
  for(var i in this.selectedCell){
    var c = this.selectedCell[i];
    this.grid[c.x][c.y].n = 0;
  }
};
var View = function(grid){
  this.grid = grid;
};
View.prototype.drawGrid = function(parent){
  var view = this;
  var eGrid = j(parent).get('#grid').e();
  if( eGrid !== undefined && eGrid !== null ){
    eGrid.innerHTML = '';
  } else {
    eGrid = document.createElement('div');
  }
  eGrid.id = 'grid';
  eGrid.classList.add('grid');
  this.grid.forEach(function(cell,i,k){
    var eCell = view.drawCell(cell,i,k);
    eGrid.appendChild(eCell);
  });
  parent.appendChild(eGrid);
};
View.prototype.drawCell = function(cell, i, k){
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
    if(eCell.selected){
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
var main = function(){
  var grid = new Grid(9);
  grid.fillEmpty();
  var view = new View(grid);
  view.drawGrid(j('#container').e());
}; main();
