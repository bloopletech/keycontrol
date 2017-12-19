function Game() {
  this.codesMap = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.keyCodes = Object.keys(this.codesMap);
}

Game.prototype.start = function() {
  this.allowedTime = 1000;
  this.score = 0;
  this.startTime = null;
  this.code = null;
}

Game.prototype.generateCode = function() {
  /*var newCode = this.code;
  while(newCode == this.code) newCode = this.keyCodes[Math.floor(Math.random() * this.keyCodes.length)];
  return newCode;*/
  return this.keyCodes[Math.floor(Math.random() * this.keyCodes.length)];
}

Game.prototype.timeUsed = function() {
  return ((new Date()).getTime() - this.startTime.getTime()) / (this.allowedTime + 0.0);
}

Game.prototype.roundStarted = function() {
  this.code = this.generateCode();
  this.startTime = new Date();

  return this.codesMap[this.code];
}

Game.prototype.roundEnded = function(keyCode) {
  var diff = (new Date()).getTime() - this.startTime.getTime();

  var correct = keyCode == this.code;

  if(diff < 50 || diff > this.allowedTime || !correct) return true;

  this.score += (1000 - diff);

  //scoring version 3
  if(this.allowedTime > 300) {
    var allowedTimeChange = Math.round((this.allowedTime - diff) * 0.1);
    this.allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
  }

  return false;
}