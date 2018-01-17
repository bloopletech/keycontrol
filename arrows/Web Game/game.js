function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
  this.MAX_ALLOWED_TIME = 1000;
}

Game.prototype.start = function() {
  this.allowedTime = this.MAX_ALLOWED_TIME;
  this.score = 0;
  this.comboStack = 0;
  this.startTime = null;
  this.direction = null;
}

Game.prototype.nextDirection = function() {
  var next = this.direction;
  while(next == this.direction) next = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
  return next;
  //return this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
}

Game.prototype.timeUsed = function() {
  return (Date.now() - this.startTime) / (this.allowedTime + 0.0);
}

Game.prototype.roundStarted = function() {
  this.direction = this.nextDirection();
  this.startTime = Date.now();
  return this.direction;
}

Game.prototype.roundEnded = function(playerDirection) {
  if(playerDirection == null) return true;

  var diff = Date.now() - this.startTime;
  var correct = playerDirection == this.direction;

  if(diff < 50 || diff > this.allowedTime || !correct) return true;

  this.score += diff;
  this.allowedTime -= 10;
  this.comboStack++;

  return false;
}