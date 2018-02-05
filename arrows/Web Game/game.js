function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
  this.ALLOWED_TIME = 30000;
  this.SCORING_TIME = 1000;
}

Game.prototype.start = function() {
  this.score = 0;
  this.streak = 0;
  this.startTime = Date.now();
  this.direction = null;
}

Game.prototype.nextDirection = function() {
  var next = this.direction;
  while(next == this.direction) next = this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
  return next;
  //return this.DIRECTIONS[Math.floor(Math.random() * this.DIRECTIONS.length)];
}

Game.prototype.timeUsed = function() {
  return (Date.now() - this.startTime) / (this.ALLOWED_TIME + 0.0);
}

Game.prototype.roundStarted = function() {
  this.direction = this.nextDirection();
  this.roundStartTime = Date.now();
  return this.direction;
}

Game.prototype.roundEnded = function(playerDirection) {
  var now = Date.now();
  var diff = now - this.startTime;
  var roundDiff = now - this.roundStartTime;

  var correct = playerDirection == this.direction;

  console.log(this.streak + "," + roundDiff);

  if(roundDiff < 50 || (diff > this.ALLOWED_TIME) || !correct) return true;

  this.streak++;
  this.score += Math.max(0, (this.SCORING_TIME - roundDiff)) + (this.streak * 100);

  return false;
}