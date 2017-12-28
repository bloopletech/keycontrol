function GameUi(endedCallback) {
  this.game = new Game();
  this.CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.playing = false;
  this.endedCallback = endedCallback;
}

GameUi.prototype.start = function() {
  $("body").classList.add("playing");

  $("#info").innerHTML = "Wait...";
  $("#info").style.display = "block";

  this.game.start();

  setTimeout(this.postStarted.bind(this), 1500);
}

GameUi.prototype.postStarted = function() {
  $("#info").style.display = "none";
  $("#score").innerHTML = "GO!";

  this.playing = true;
  this.startRound();
}

GameUi.prototype.startRound = function() {
  var direction = this.game.roundStarted();
  $("#out").classList.remove("left", "up", "right", "down");
  $("#out").classList.add(direction);

  $("#time-used").style.width = "13px";
  this.timeUsedInterval = window.setInterval(this.updateTimeUsed.bind(this), 20);
}

GameUi.prototype.updateTimeUsed = function(ratio) {
  var ratio = this.game.timeUsed();
  if(ratio > 1) {
    window.clearInterval(this.timeUsedInterval);
    $("#time-used").style.width = "189px";
  }
  else {
    $("#time-used").style.width = (ratio * 176) + 13 + "px";
  }
}

GameUi.prototype.endRound = function(event) {
  event.stopPropagation();
  if(!this.playing) return;

  window.clearInterval(this.timeUsedInterval);
  $("#time-used").style.width = "0px";

  var gameOver = this.game.roundEnded(this.CODES_MAP[event.keyCode]);
  $("#score").innerHTML = this.nice(this.game.score);

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
  this.playing = false;
  $("#out").classList.remove("left", "up", "right", "down");
  $("#out").classList.add("blank");
  $("#info").innerHTML = "Game Over";
  $("#info").style.display = "block";

  setTimeout(this.postEnded.bind(this), 1500);

  this.endedCallback(this.game.score);
}

GameUi.prototype.postEnded = function() {
  $("#info").style.display = "none";
  $("body").classList.remove("playing");
  if($("#score").innerHTML == "GO!") $("#score").innerHTML = "Have Fun!";
}
