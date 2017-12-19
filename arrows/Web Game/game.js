function Game(callbacks) {
  this.codesMap = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.keyCodes = Object.keys(this.codesMap);
  this.code;
  this.startTime;
  this.timeUsedInterval;
  this.callbacks = callbacks;
}

Game.prototype.started = function() {
  this.allowedTime = 1000;
  this.score = 0;
}

Game.prototype.generateCode = function() {
  /*var newCode = this.code;
  while(newCode == this.code) newCode = this.keyCodes[Math.floor(Math.random() * this.keyCodes.length)];
  return newCode;*/
  return this.keyCodes[Math.floor(Math.random() * this.keyCodes.length)];
}

Game.prototype.updateTimeUsed = function() {
  var ratio = ((new Date()).getTime() - this.startTime.getTime()) / (this.allowedTime + 0.0);
  if(ratio > 1) window.clearInterval(this.timeUsedInterval);

  this.callbacks.updateTimeUsed(ratio);
}

Game.prototype.startRound = function() {
  this.code = this.generateCode();
  this.startTime = new Date();
  this.timeUsedInterval = window.setInterval(this.updateTimeUsed.bind(this), 20);

  this.callbacks.roundStarted(this.codesMap[this.code]);
}

Game.prototype.roundEnded = function(keyCode) {
  var diff = (new Date()).getTime() - this.startTime.getTime();
  
  window.clearInterval(this.timeUsedInterval);
  
  var correct = keyCode == this.code;

  if(diff < 50 || diff > this.allowedTime || !correct) {
    this.callbacks.ended(this.score);
    return;
  }

  if(correct) {
    this.score += (1000 - diff);
    this.callbacks.scoreUpdated(this.score);
  }

  //scoring version 3
  if(this.allowedTime > 300) {
    var allowedTimeChange = Math.round((this.allowedTime - diff) * 0.1);
    this.allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
  }

  this.startRound();
}