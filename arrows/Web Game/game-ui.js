function GameUi(endedCallback) {
  this.game = new Game();
  this.CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.DIRECTION_CLASSES = this.game.DIRECTIONS.concat("blank");
  this.endedCallback = endedCallback;
  this.transition("attract");
}

GameUi.prototype.transition = function(state) {
  this.state = state;
  $("#front").classList.remove("attract", "waiting", "playing", "game-over");
  $("#front").classList.add(state);
}

GameUi.prototype.start = function() {
  this.transition("waiting");
  this.game.start();

  setTimeout(this.postStarted.bind(this), 1500);
}

GameUi.prototype.postStarted = function() {
  if(this.state != "waiting") return;
  this.transition("playing");
  $("#score").innerHTML = "0";

  this.updateTimeUsed();
  this.startRound();
}

GameUi.prototype.showDirection = function(direction) {
  for(var i in this.DIRECTION_CLASSES) $("#out").classList.remove(this.DIRECTION_CLASSES[i]);
  $("#out").classList.add(direction);
}

GameUi.prototype.startRound = function() {
  this.showDirection(this.game.roundStarted());

  this.roundEndTimeout = window.setTimeout(this.endRound.bind(this), this.game.MAX_ALLOWED_TIME + 250);
}

GameUi.prototype.scoreRank = function() {
  var score = this.game.score;
  if(score < 10000) return "bronze";
  if(score < 20000) return "silver";
  return "gold";
}

GameUi.prototype.transitionRank = function(element) {
  element.classList.remove("unranked", "bronze", "silver", "gold");
  element.classList.add(this.scoreRank());
}

GameUi.prototype.updateTimeUsed = function() {
  this.timeUsedUpdater = window.requestAnimationFrame(this.updateTimeUsed.bind(this));

  var ratio = this.game.timeUsed();
  if(ratio > 1) {
    ratio = 1;
  }

  $("#time-used").style.width = (ratio * 100) + "%";
  this.transitionRank($("#time-used"));
}

GameUi.prototype.onKeyDown = function(event) {
  event.preventDefault();
  if(this.state == "waiting") return;
  if(this.state == "playing") this.endRound(event);
  else if(event.keyCode == 32) this.start();
}

GameUi.prototype.endRound = function(event) {
  window.clearTimeout(this.roundEndTimeout);

  var gameOver = this.game.roundEnded(event == null ? null : this.CODES_MAP[event.keyCode]);
  $("#score").textContent = this.nice(this.game.score);

  if(gameOver) this.gameOver();
  else this.startRound();
}

GameUi.prototype.nice = function(num) {
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

GameUi.prototype.gameOver = function() {
  window.cancelAnimationFrame(this.timeUsedUpdater);

  $("#game-over-score").textContent = this.nice(this.game.score);
  $("#game-over-rank").textContent = this.scoreRank();
  $("#game-over-combo-stack").textContent = this.game.comboStack;
  this.transition("game-over");
  this.transitionRank($("#game-over"));

  this.endedCallback(this.game.score);
}
