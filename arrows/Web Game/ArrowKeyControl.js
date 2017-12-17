function preference(key, value) {
  key = "akc-" + key;

  if(arguments.length == 2) {
    localStorage[key] = value;
  }
  else {
    return localStorage[key];
  }
}

function $(x) {
  return document.getElementById(x);
}

var ajax = null;

function load() {
  setupParts();

  window.onkeydown = endRound;
  ajax = new XMLHttpRequest();
  ajax.overrideMimeType("text/plain");

  show();
}

function showBack(event) {
  $("username").value = preference('username');
  $("crypt").value = preference('crypt');
  $("netScoring").checked = preference('netScoring') != "false";

  $("front").style.display = "none";
  $("back").style.display = "block";
}

function showFront(event) {
  $("front").style.display = "block";
  $("back").style.display = "none";

  preference('username', $("username").value);
  preference('crypt', $("crypt").value);
  preference('netScoring', $("netScoring").checked ? "true" : "false");
}

function show() {
  if((typeof preference('crypt')) == 'undefined' || (typeof preference('username')) == 'undefined') {
    preference('crypt', randomCrypt(20));
    preference('username', 'Anonymous-' + randomCrypt(6));
  }
}

function randomCrypt(count) {
  var out = "";
  var randChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for(var i = 0; i < count; i++) out += randChars.charAt(Math.floor(Math.random() * randChars.length + 1) - 1);
  return out;
}

function nice(num) {
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

var playing = false;
//left up right down
var codesMap = { 37: "left", 38: "up", 39: "right", 40: "down" };
var allowedCodes = [37, 38, 39, 40];

var allowedTime = 0;
var percentChange = 0;
var code = '';
var startTime = null;
var score = 0;

var timeUsedInterval = null;

function generateCode() {
  /*var newCode = code;
  while(newCode == code) newCode = allowedCodes[Math.floor(Math.random() * allowedCodes.length)];
  return newCode;*/
  return allowedCodes[Math.floor(Math.random() * allowedCodes.length)];
}

function playGame(event) {
  $("play").style.display = "none";
  $("out").classList.add("blank");

  $("biginfo").innerHTML = "Wait...";
  $("biginfo").style.visibility = "visible";

  score = 0;
  allowedTime = 1000;
  percentChange = 0.1;

  setTimeout(function() {
    $("biginfo").style.visibility = "hidden";
    $("score").innerHTML = "GO!";
    code = generateCode();

    startRound();
    playing = true;
  }, 1500);
}

function startRound() {
  code = generateCode();
  $("out").classList.remove("left", "up", "right", "down");
  $("out").classList.add(codesMap[code]);

  $("time_used").style.width = "13px";
  timeUsedInterval = window.setInterval(updateTimeUsed, 20);
  
  startTime = new Date();
}

function endRound(event) {
  event.stopPropagation();
  if(!playing) return;

  var diff = (new Date()).getTime() - startTime.getTime();

  $("time_used").style.width = "0px";
  window.clearInterval(timeUsedInterval);

  var correct = event.keyCode == code;

  if(diff < 50 || diff > allowedTime || !correct) {
    gameOver();
    return;
  }

  if(correct) {
    score += (1000 - diff);
    $("score").innerHTML = nice(score);
  }

  //scoring version 3
  if(allowedTime > 300) {
    var allowedTimeChange = Math.round((allowedTime - diff) * percentChange);
    allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
  }

  startRound();
}

function gameOver() {
  playing = false;
  $("out").classList.remove("left", "up", "right", "down");
  $("out").classList.add("blank");
  $("biginfo").innerHTML = "Game Over";
  $("biginfo").style.visibility = "visible";

  var ns = preference("netScoring");
  if(ns == undefined || ns == "true") {
    ajax.onreadystatechange = function(http) {
      if((ajax.readyState == 4) && (ajax.responseText.length > 1)) {
        var parts = ajax.responseText.split("|");
        if(parts[0] == "1") preference("netScoring", "false");
        window.open(parts[1]);
      }
    };

    ajax.open("GET", "http://akc.bloople.net/add/dashboard/10/" + preference("username") + "/" + preference("crypt") + "/" + score
     + "?" + Math.random());
    ajax.send(" ");
  }

  setTimeout(function() {
    $("biginfo").style.visibility = "hidden";
    $("play").style.display = "block";
    if($("score").innerHTML == "GO!") $("score").innerHTML = "Have Fun!";
  }, 1500);
}

function gotoSite(event) {
  window.open("http://akc.bloople.net");
}

function updateTimeUsed() {
  var ratio = ((new Date()).getTime() - startTime.getTime()) / (allowedTime + 0.0);
  if(ratio > 1) {
    $("time_used").style.width = "189px";
    window.clearInterval(timeUsedInterval);
  }
  else {
    $("time_used").style.width = (ratio * 176) + 13 + "px";
  }
}