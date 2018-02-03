function Game() {
  this.DIRECTIONS = ["left", "up", "right", "down", "wait"];
  this.MAX_ALLOWED_TIME = 1000;
}

Game.prototype.start = function() {
  this.allowedTime = this.MAX_ALLOWED_TIME;
  this.score = 0;
  this.streak = 0;
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
  if(this.direction == "wait") diff = 50;

  console.log(this.streak + "," + diff + "," + this.allowedTime);

  if(diff < 50 || (diff > this.allowedTime) || !correct) return true;

  this.streak++;
  //console.log("streak: ", this.streak, ", diff: ", diff, ", allowedTime: ", this.allowedTime);
  this.score += (this.allowedTime - diff) + (this.streak * 100);

  if(this.direction != "wait") {
    if(this.allowedTime > 700) this.allowedTime -= 10;
    else if(this.allowedTime > 300) this.allowedTime -= 3;
  }

  return false;
}