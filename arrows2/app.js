/*var AKC = {
  allowedChars: ["\u25c0", "\u25b2", "\u25b6", "\u25bc"],
  allowedTime: 90000,
  
  
  
  
  
  
  
  
  
  
}*/


//left up right down
//var allowedChars = ["\u25c0", "\u25b6"];
//var allowedCodes = [37, 39];
//var allowedChars = ["\u25c0", "\u25b2", "\u25b6", "\u25bc"];
//["◀", "▲", "▶", "▼"]
var correctIndex = null;
var allowedRotations = [270, 0, 90, 180];
var allowedCodes = [37, 38, 39, 40];
var allowedTranslations = [[-10, 0], [0, -10], [10, 0], [0, 10]];
var allowedTime = 90000;
var maximumDiff = 1000;
var playing = true;
var canvas = null;
var timer = null;
var timeRemaining = 0;
var timeRoundStarted = 0;
var timeTimerLastUpdated = 0;

var timerInnerCircle = null;
var outText = null;
var scoreText = null;

function nice(num)
{
  var x = num + '';
  var rgx = /(\d+)(\d{3})/;
  while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
  return x;
}

function updateTimer()
{
  var updateTimerStarted = (new Date()).getTime();
  timeRemaining -= (updateTimerStarted - timeTimerLastUpdated);
  timeTimerLastUpdated = updateTimerStarted;
  //timerIndicator ...
   $("#remaining").text(timeRemaining);
  if(timeRemaining <= 0) endGame();
}

function startGame()
{
  //init the game
  score = 0;
  timeRemaining = 90000;
  timeTimerLastUpdated = (new Date()).getTime();
  playing = true;

  //init the canvas
  var outerCircle = canvas.circle(100, 80, 60);
  outerCircle.attr({ 'stroke-width': 6, 'stroke': '#cccccc' });
  
  timerInnerCircle = canvas.circle(100, 80, 60);
  timerInnerCircle.attr({ 'stroke-width': 4, 'stroke': '#008000' });

  timer = window.setInterval(updateTimer, 1000);
  updateTimer();

  startRound();
}

function endGame()
{
  playing = false;
  window.clearInterval(timer);
  //...
}

function startRound()
{
  if(correctIndex != null)
  {
    var oldTranslation = allowedTranslations[correctIndex];
    outText.translate(-(oldTranslation[0]), -(oldTranslation[1]));
  }

  correctIndex = Math.floor(Math.random() * allowedRotations.length + 1) - 1;
  outText.rotate(allowedRotations[correctIndex], 100, 80);
  var translation = allowedTranslations[correctIndex];
  outText.translate(translation[0], translation[1]);

   //if(outText) outText.remove();
   //outText = canvas.text(100, 80, character);
   //outText.attr({ 'font-size': '80px' });

   timeRoundStarted = new Date();
}

function endRound(event)
{
  event.stopPropagation();
  if(!playing) return false;
  
  var diff = (new Date()).getTime() - timeRoundStarted.getTime();

  if(diff < 50)
  {
    endGame();
    return;
  }

  if(diff < maximumDiff)
  {
    if(allowedCodes.indexOf(event.keyCode) == correctIndex)
    {
      score += (maximumDiff - diff);

      if(scoreText) scoreText.remove();
      scoreText = canvas.text(40, 150, nice(score));
      scoreText.attr({ 'font-size': '18px' });
    }
    else
    {
      timeRemaining = Math.ceil(timeRemaining * 0.9);
    }
  }
  
  //animate

  startRound();

  return false;
}

$(function()
{
  window.onkeydown = endRound;

  canvas = Raphael("canvas", 200, 200);
  var r = canvas.rect(-1, -1, 202, 202);
  r.attr({ 'fill': '90-#262a6f-#3035a7', 'stroke-width': 0 });

  //outText = canvas.path("M 100 40 L 125 125 L 70 125 Z"); 
  //outText = canvas.path("m 162.85715,163.62761 43.37191,75.12235 43.3719,75.12235 -86.74381,0 -86.743821,-1e-5 43.371911,-75.12234 z"); 
  outText = canvas.g.triangle(100, 80, 40);
  outText.attr({ 'fill': '#ffffff', 'stroke-opacity': 0.0 });
  
  

  //allowedPaths.push(canvas.print(0, 0, allowedChars[0], canvas.getFont("Times"), 20));
  //allowedPaths.push(canvas.print(0, 0, allowedChars[1], canvas.getFont("Times"), 20));

  

  startGame();
});

//option 1
//the game is ended only when you get the arrow wrong
//combos for multiple of the same arrow
//combos for pressing close together?
//score is based on how quickly you get the arrow(, multiplied somehow by the number of letters gone?)
//option 2
//limited to 90 seconds with countdown
//if you get one wrong your score stays the same, but the time remaining is halved.
//make sure check for holding-down-one-key-to-win-with-0ms is in