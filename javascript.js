document.addEventListener('DOMContentLoaded', start);

var timer = setInterval(drawStart,200);
var timerCounter = 0;
var my_canvas = document.getElementById("canvas");
var context = my_canvas.getContext("2d");


var mazePositionX = 48;
var mazePositionY = 48;


var mazeWidth = 100;
var mazeHeight = 100;
var mazeArray = [];
var startX = 20;
var startY = 0;
var entranceExitValue = 6;
var initialLine = entranceExitValue;
var endLine = 0;
var endX = mazeWidth - startX;
var endY = mazeHeight - 1;

var corridorWidth = 8;

var treeArray = [];
var branchArray = [];

function randomBranchValue() {
  return Math.floor((Math.random() * 15) + 1);
}

function randomBranchLength() {
  return Math.floor((Math.random() * 15) + 3);
}

function setStartingValues() {
  mazeArray = [];
  treeArray = [];
  branchArray = [];
  doneYet = false;
  initialLine = entranceExitValue;
}

function start() {
  setStartingValues();
  for (var i = 0; i < mazeWidth; i++) {
    mazeArray.push([]);
    for (var j = 0; j < mazeHeight; j++) {
      mazeArray[i].push(false);
    }
  }
  mazeArray[startX][startY] = true;
  treeArray.push({xPos: startX, yPos: startY, direction: 2, moving: true, counter: randomBranchLength()});
  branchArray.push({fromID: 0, leftTurn: false, counter: randomBranchValue()})
  branchArray.push({fromID: 0, leftTurn: true, counter: randomBranchValue()})
}

function drawStart() {
  drawBranch(startX,startY - initialLine,2);
  initialLine --;
  if (initialLine === 0) {
    clearInterval(timer);
    timer = setInterval(drawMore,200);
  }
}

function drawMore() {
  if (endLine > 0) {
    drawBranch(endX,endY + entranceExitValue - endLine,2);
    endLine --;
  }

  for (var i = 0; i < treeArray.length; i++) {
    if (treeArray[i].moving) {
      if (checkEmpty(treeArray[i].xPos, treeArray[i].yPos, treeArray[i].direction) && (treeArray[i].counter != 0)) {
        drawBranch(treeArray[i].xPos, treeArray[i].yPos, treeArray[i].direction);
        treeArray[i].xPos += xOffset(treeArray[i].direction);
        treeArray[i].yPos += yOffset(treeArray[i].direction);
        mazeArray[treeArray[i].xPos][treeArray[i].yPos] = true;
        treeArray[i].counter --;
      }
      else {
        treeArray[i].moving = false;
      }
    }
  }
  if (branchArray.length === 0) {
    clearInterval(timer);
    timer = setInterval(wipeAndStartAgain,5000);
  }
  else {
    for (i = 0; i < branchArray.length; i++) {
      if (branchArray[i].counter === 0) {
        branchOff(branchArray[i]);
        if (treeArray[branchArray[i].fromID].moving === false) {
          branchArray.splice(i,1);
          i --;
        }
        else {
          branchArray[i].counter = randomBranchValue();
        }
      }
      else {
        branchArray[i].counter --;
      }
    }
  }
}

function branchOff(branch) {
  var thisX = treeArray[branch.fromID].xPos;
  var thisY = treeArray[branch.fromID].yPos;
  var thisWay = treeArray[branch.fromID].direction;
  if (branch.leftTurn) {
    thisWay --;
    if (thisWay === -1) {
      thisWay = 3;
    }
  }
  else {
    thisWay ++;
    if (thisWay === 4) {
      thisWay = 0;
    }
  }
  if (checkEmpty(thisX,thisY,thisWay)) {
    treeArray.push({xPos: thisX, yPos: thisY, direction: thisWay, moving: true, counter: randomBranchLength()})
    branchArray.push({fromID: treeArray.length-1, leftTurn: false, counter: randomBranchValue()})
    branchArray.push({fromID: treeArray.length-1, leftTurn: true, counter: randomBranchValue()})
  }
}

function checkEmpty(fromX,fromY,thisWay) {
  var toX = fromX + xOffset(thisWay);
  var toY = fromY + yOffset(thisWay);
  if ((toX >= mazeWidth)||(toX <= 0)||(toY >= mazeHeight)||(toY <= 0)) {
    return false;
  }
  if (mazeArray[toX][toY]) {
    return false;
  }
  return true;
}

function xOffset(thisWay) {
  switch (thisWay) {
    case 1: return 1; break;
    case 3: return -1; break;
    default: return 0; break;
  }
}

function yOffset(thisWay) {
  switch (thisWay) {
    case 0: return -1; break;
    case 2: return 1; break;
    default: return 0; break;
  }
}

function drawBranch(fromX,fromY,thisWay) {
  fromX = fromX * corridorWidth + mazePositionX;
  fromY = fromY * corridorWidth + mazePositionY;
  toX = fromX + xOffset(thisWay) * corridorWidth;
  toY = fromY + yOffset(thisWay) * corridorWidth ;
  context.beginPath();
  context.moveTo(fromX,fromY);
  context.lineTo(toX,toY);
  context.stroke();

  if ((toX === endX * corridorWidth + mazePositionX)&&(toY === endY * corridorWidth + mazePositionY)) {
    endLine = entranceExitValue;
  }
}

function wipeAndStartAgain() {
  setStartingValues();
  start();
  clearInterval(timer);
  timer = setInterval(drawStart,200);
  context.clearRect(0,0, my_canvas.width, my_canvas.height);
}
