function Engine(endedCallback) {
  this.game = new Game();
  this.CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.DIRECTION_CLASSES = this.game.DIRECTIONS.concat("blank");
  this.RANKS = {
    bronze: {
      minScore: 0,
      humanName: "Bronze",
      class: "bronze"
    },
    silver: {
      minScore: 50000,
      humanName: "Silver",
      class: "silver"
    },
    gold: {
      minScore: 80000,
      humanName: "Gold",
      class: "gold"
    },
    platinum: {
      minScore: 100000,
      humanName: "Platinum",
      class: "platinum"
    },
    diamond: {
      minScore: 1100000,
      humanName: "Diamond",
      class: "diamond"
    },
    vanadium: {
      minScore: 120000,
      humanName: "Vanadium",
      class: "vanadium"
    },
    strontium: {
      minScore: 130000,
      humanName: "Strontium",
      class: "strontium"
    }
  };
  this.endedCallback = endedCallback;
  this.$timeUsed = $("#time-used");

  this.transition("attract");
}

Engine.prototype.transition = function(state) {
  this.state = state;
  $("#front").classList.remove("attract", "waiting", "playing", "game-over");
  $("#front").classList.add(state);
}

Engine.prototype.start = function() {
  this.transition("waiting");
  setTimeout(this.postStarted.bind(this), 1500);
}

Engine.prototype.postStarted = function() {
  if(this.state != "waiting") return;

  this.transition("playing");
  $("#score").innerHTML = "0";

  this.game.start();
  this.updateTimeUsed();
  this.startRound();
  this.gameEndTimeout = window.setTimeout(this.gameOver.bind(this), this.game.ALLOWED_TIME + 20);
}

Engine.prototype.showDirection = function(direction) {
  for(var i in this.DIRECTION_CLASSES) $("#out").classList.remove(this.DIRECTION_CLASSES[i]);
  $("#out").classList.add(direction);
}

Engine.prototype.startRound = function() {
  this.showDirection(this.game.roundStarted());
}

Engine.prototype.scoreRank = function() {
  var score = this.game.score;

  var currentRank = null;
  for(var i in this.RANKS) {
    var rank = this.RANKS[i];
    if(score >= rank.minScore) currentRank = rank;
  }

  return currentRank;
}

Engine.prototype.updateTimeUsed = function() {
  this.timeUsedUpdater = window.requestAnimationFrame(this.updateTimeUsed.bind(this));

  var ratio = this.game.timeUsed();
  if(ratio > 1) {
    ratio = 1;
  }

  this.$timeUsed.style.width = (ratio * 100) + "%";
  for(var i in this.RANKS) this.$timeUsed.classList.remove(this.RANKS[i].class);
  this.$timeUsed.classList.add(this.scoreRank().class);
}

Engine.prototype.onKeyDown = function(event) {
  event.preventDefault();
  if(this.state == "waiting") return;
  if(this.state == "playing") this.endRound(event);
  else if(event.keyCode == 32) this.start();
}

Engine.prototype.endRound = function(event) {
  var gameOver = this.game.roundEnded(this.CODES_MAP[event.keyCode]);
  $("#score").textContent = this.nice(this.game.score);

  if(gameOver) this.gameOver();
  else this.startRound();
}

Engine.prototype.nice = function(num) {
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

Engine.prototype.gameOver = function() {
  if(this.state != "playing") return;

  window.cancelAnimationFrame(this.timeUsedUpdater);
  window.clearTimeout(this.gameEndTimeout);

  $("#results-score").textContent = this.nice(this.game.score);
  $("#results-rank").textContent = this.scoreRank().humanName;
  $("#results-streak").textContent = this.game.streak;
  this.transition("game-over");

  this.endedCallback(this.game.score);
}
