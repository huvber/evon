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
    for(var j=0; j<size; j++) this.grid[i][j]= new Cell(0);
  }
};
Grid.prototype.forEach = function(handler){
  for(var i=0; i < this.size; i++){
    for(var j=0; j<this.size; j++){
      var c = this.grid[i][j];
      handler(c,i,j);
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

var View = function(){

};
View.prototype.drawGrid = function(parent,grid){
  var view = this;
  var eGrid = document.createElement('div');
  eGrid.id = 'grid';
  eGrid.classList.add('grid');
  grid.forEach(function(cell,i,j){
    var eCell = view.drawCell(cell,i,j);
    eGrid.appendChild(eCell);
  });
  parent.appendChild(eGrid);
};
View.prototype.drawCell = function(cell, i, j){
  var view = this;
  var eCell = document.createElement('div');
  eCell.id = 'cell_'+i+'_'+j;
  eCell.classList.add('cell');
  eCell.onclick = function(e){
    view.manageSelect(cell,i,j);
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

var main = function(){
  var grid = new Grid(9);
  grid.fillEmpty();
  var view = new View();
  view.drawGrid(j('#container').e(), grid);
}; main();
