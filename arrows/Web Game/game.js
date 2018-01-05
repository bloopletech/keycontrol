function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
}

Game.prototype.start = function() {
  this.allowedTime = 1000;
  this.score = 0;
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
  var diff = Date.now() - this.startTime;
  var correct = playerDirection == this.direction;

  if(diff < 50 || diff > this.allowedTime || !correct) return true;

  this.score += (1000 - diff);

  //scoring version 3
  if(this.allowedTime > 300) {
    var allowedTimeChange = Math.round((this.allowedTime - diff) * 0.1);
    this.allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
  }

  return false;
}