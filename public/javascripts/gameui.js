//Various functions forthe game UI
var player = 1;
var tokenImage = 'images/red-chip.png';
var playerOne = function(player){
  player = 1;
  tokenImage = 'images/red-chip.png';
  console.log("Player: " + player + " Token image: " + tokenImage);
}
var playerTwo = function(player){
  player = 2;
  tokenImage = 'images/yellow.png';
  console.log("Player: " + player + " Token image: " + tokenImage);
}

var getPlayer = function(){
  return player;
}

var mouseOverA = function(){
  var cell = document.getElementById('colatop');

  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverB(){
  var cell = document.getElementById('colbtop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverC(){
  var cell = document.getElementById('colctop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverD(){
  var cell = document.getElementById('coldtop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverE(){
  var cell = document.getElementById('coletop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverF(){
  var cell = document.getElementById('colftop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}
function mouseOverG(){
  var cell = document.getElementById('colgtop');
  var imgtag = '<img src=\"' + tokenImage + '\" alt=\"\" style=\"width:64px;height:64px;display:block;margin:auto;\">';
  cell.innerHTML = imgtag;
}

var mouseOutA = function(){
  var cell = document.getElementById('colatop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutB(){
  var cell = document.getElementById('colbtop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutC(){
  var cell = document.getElementById('colctop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutD(){
  var cell = document.getElementById('coldtop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutE(){
  var cell = document.getElementById('coletop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutF(){
  var cell = document.getElementById('colftop');
  cell.innerHTML = "<br><br><br><br>";
}
function mouseOutG(){
  var cell = document.getElementById('colgtop');
  cell.innerHTML = "<br><br><br><br>";
}

function clickA(column,player){
  var targetID = "imga"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickB(column,player){
  var targetID = "imgb"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickC(column,player){
  var targetID = "imgc"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickD(column,player){
  var targetID = "imgd"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickE(column,player){
  var targetID = "imge"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickF(column,player){
  var targetID = "imgf"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}

function clickG(column,player){
  var targetID = "imgg"
  for(var i=0; i < column.length; i++){
    if(column[i] == 0){
      column[i] = player;
      targetID += (i+1);
      checkWin();
      break;
    }
  }
  element = document.getElementById(targetID);
  element.src = tokenImage;

}
function initColumn(){
  column=[0,0,0,0,0,0];
  return column;
}
