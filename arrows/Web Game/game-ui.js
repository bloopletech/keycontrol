function GameUi(endedCallback) {
  this.playing = false;

  this.game = new Game({
    roundStarted: this.roundStarted.bind(this),
    updateTimeUsed: this.updateTimeUsed.bind(this),
    scoreUpdated: this.scoreUpdated.bind(this),
    ended: this.ended.bind(this)
  });

  this.endedCallback = endedCallback;
}

GameUi.prototype.start = function() {
  $("body").classList.add("playing");

  $("#info").innerHTML = "Wait...";
  $("#info").style.display = "block";

  this.game.started();

  setTimeout(this.postStarted.bind(this), 1500);
}

GameUi.prototype.postStarted = function() {
  $("#info").style.display = "none";
  $("#score").innerHTML = "GO!";

  this.game.startRound();
  this.playing = true;
}

GameUi.prototype.updateTimeUsed = function(ratio) {
  if(ratio > 1) {
    $("#time-used").style.width = "189px";
  }
  else {
    $("#time-used").style.width = (ratio * 176) + 13 + "px";
  }
}

GameUi.prototype.roundStarted = function(direction) {
  $("#out").classList.remove("left", "up", "right", "down");
  $("#out").classList.add(direction);

  $("#time-used").style.width = "13px";
}

GameUi.prototype.endRound = function(event) {
  event.stopPropagation();
  if(!this.playing) return;

  $("#time-used").style.width = "0px";

  this.game.roundEnded(event.keyCode);
}

GameUi.prototype.nice = function(num) {
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

GameUi.prototype.scoreUpdated = function(score) {
  $("#score").innerHTML = this.nice(score);
}

GameUi.prototype.ended = function(score) {
  this.playing = false;
  $("#out").classList.remove("left", "up", "right", "down");
  $("#out").classList.add("blank");
  $("#info").innerHTML = "Game Over";
  $("#info").style.display = "block";

  setTimeout(this.postEnded.bind(this), 1500);

  this.endedCallback(score);
}

GameUi.prototype.postEnded = function() {
  $("#info").style.display = "none";
  $("body").classList.remove("playing");
  if($("#score").innerHTML == "GO!") $("#score").innerHTML = "Have Fun!";
}
