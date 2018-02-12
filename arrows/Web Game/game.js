function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down"];
  this.ALLOWED_TIME = 30000;
  this.ROUND_SCORING_TIME = 1000;
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

Game.prototype.timeRemaining = function() {
  return this.ALLOWED_TIME - (Date.now() - this.startTime);
}

Game.prototype.timeUsedRatio = function() {
  return (Date.now() - this.startTime) / (this.ALLOWED_TIME + 0.0);
}

Game.prototype.roundTimeUsedRatio = function() {
  return (Date.now() - this.roundStartTime) / (this.roundScoringTime + 0.0);
}

Game.prototype.calcRoundScoringTime = function() {
  var score = this.score;
  if(score >= 50000) return 700;
  if(score >= 30000) return 800;
  if(score >= 20000) return 900;
  return 1000;
}

Game.prototype.roundStarted = function() {
  this.direction = this.nextDirection();
  this.roundStartTime = Date.now();
  this.roundScoringTime = this.calcRoundScoringTime();
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
  var roundScore = this.ROUND_SCORING_TIME - roundDiff;
  if(roundScore > 0) this.score += roundScore + (this.streak * 100);
  else this.streak = 0;

  return false;
}