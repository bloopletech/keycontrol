//All non-Apple-copyright code copyright 2008-2009 Brenton Fletcher.
//Check out my portfolio at i.bloople.net

function $(x)
{
   return document.getElementById(x);
}

var ajax = null;

function load()
{
    setupParts();
    document.body.onkeydown = endRound;
    ajax = new XMLHttpRequest();
    ajax.overrideMimeType("text/plain");
}

function showBack(event)
{
   $("username").value = widget.preferenceForKey(K('username'));
   $("crypt").value = widget.preferenceForKey(K('crypt'));
   $("netScoring").checked = widget.preferenceForKey(K('netScoring')) != "false";

    if(window.widget) widget.prepareForTransition("ToBack");

    $("front").style.display = "none";
    $("back").style.display = "block";

    if(window.widget) setTimeout('widget.performTransition();', 0);
}

function showFront(event)
{
    if(window.widget) widget.prepareForTransition("ToFront");

    $("front").style.display = "block";
    $("back").style.display = "none";

    if(window.widget) setTimeout('widget.performTransition();', 0);

   widget.setPreferenceForKey($("username").value, K('username'));
   widget.setPreferenceForKey($("crypt").value, K('crypt'));
   widget.setPreferenceForKey($("netScoring").checked ? "true" : "false", K('netScoring'));
}

function show()
{
   if(widget.preferenceForKey(K('crypt')) == undefined || widget.preferenceForKey(K('username')) == undefined)
   {
      widget.setPreferenceForKey(randomCrypt(20), K('crypt'));
      widget.setPreferenceForKey('Anonymous-' + randomCrypt(6), K('username'));
   }
}

if(window.widget) widget.onshow = show;

function randomCrypt(count)
{
   var out = "";
   var randChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   for(var i = 0; i < count; i++) out += randChars.charAt(Math.floor(Math.random() * randChars.length + 1) - 1);
   return out;
}

function K(key)
{
   return widget.identifier + "-" + key;
}

function nice(num)
{
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

var playing = false;
//left up right down
var allowedChars = "\u25c0\u25b2\u25b6\u25bc";
var allowedCodes = [37, 38, 39, 40];

var allowedTime = 750;
var diffs = [];
var character = '';
var lastChar = null;
var startTime = null;
var endTime = null;
var score = 0;

var timeUsedInterval = null;

function generateCharacter()
{

   var newChar = character;
   while(newChar == character) newChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length + 1) - 1);
   return newChar;
}

function playGame(event)
{
   $("play").style.visibility = "hidden";
   $("out").innerHTML = "";
   $("out").style.visibility = "visible";

   $("biginfo").innerHTML = "Wait...";
   $("biginfo").style.visibility = "visible";

   score = 0;
   allowedTime = 750;

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("score").innerHTML = "GO!";
diffs = [];
      character = '';

      startRound();
      playing = true;
   }, 3000);
}

function startRound()
{
   character = generateCharacter();
   $("out").innerHTML = character;

   $("time_used").style.width = "13px";
   timeUsedInterval = window.setInterval(updateTimeUsed, 50);
   
   startTime = new Date();
}

function endRound(event)
{
   event.stopPropagation();
   if(!playing) return;

   var diff = (new Date()).getTime() - startTime.getTime();
   alert(diff);
   diffs.push(diff);

   $("time_used").style.width = "0px";
   window.clearInterval(timeUsedInterval);
   
   var correct = allowedChars[allowedCodes.indexOf(event.keyCode)] == character;

   if(diff < 50 || diff > allowedTime || !correct)
   {
      gameOver();
      return;
   }

   if(correct)
   {
      if(diff <= 1000) score += 1000 - diff;
      $("score").innerHTML = nice(score);
      //cloneAndGrow(character);
   }

   if(allowedTime >= 200) allowedTime -= 10;

   startRound();
}

function gameOver()
{
//console.log(diffs);
   playing = false;
   $("out").style.visibility = "hidden";
   $("biginfo").innerHTML = "Game Over";
   $("biginfo").style.visibility = "visible";

   var ns = widget.preferenceForKey(K("netScoring"));
   if(ns == undefined || ns == "true")
   {
      ajax.onreadystatechange = function(http)
      {
         if((ajax.readyState == 4) && (ajax.responseText.length > 1))
         {
            var parts = ajax.responseText.split("|");
            if(parts[0] == "1") widget.setPreferenceForKey("false", K("netScoring"));
            window.widget.openURL(parts[1]);
         }
      };

      //ajax.open("GET", "http://kc.bloople.net/add/dashboard/11/" + widget.preferenceForKey(K("username")) + "/" + widget.preferenceForKey(K("crypt")) + "/" + score
      // + "?" + Math.random());
      //ajax.send(" ");
   }

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("play").style.visibility = "visible";
      if($("score").innerHTML == "GO!") $("score").innerHTML = "Have Fun!";
   }, 3000);
}

function gotoSite(event)
{
   window.widget.openURL("http://kc.bloople.net");
}

function updateTimeUsed()
{
   var ratio = ((new Date()).getTime() - startTime.getTime()) / (allowedTime + 0.0);
   if(ratio > 1)
   {
      $("time_used").style.width = "207px";
      window.clearInterval(timeUsedInterval);
   }
   else
   {
      $("time_used").style.width = (ratio * 194) + 13 + "px";
      
   /*
   var movePerFrame = 194 / (allowedTime / 50.0);
   var currentWidth = $("time_used").clientWidth;
   alert(currentWidth);
*/

   /*if((currentWidth + movePerFrame) > (207))
   {
      $("time_used").style.width = "207px";
      window.clearInterval(timeUsedInterval);
   }
   else
   {
      $("time_used").style.width = (currentWidth + movePerFrame) + "px";
   }*/
}

function cloneAndGrow(character)
{/*
  var growNode = $("out").cloneNode();
  $("out").parentNode.appendChild(growNode);
  growNode.opacity = 0.5;
  setTimeout(function()
  {
      var oldWidth = growNode.clientWidth;
      alert(oldWidth);
      growNode.style.width = oldWidth * 1.1 + "px";
      var newWidth = growNode.clientWidth;
      alert(newWidth);
      growNode.style.left = growNode.style.left - ((newWidth - oldWidth) / 2.0) + "px";

      var oldHeight = growNode.clientHeight;
      growNode.style.height = oldHeight * 1.1 + "px";
      var newHeight = growNode.clientHeight;
      alert(growNode.style.top);
      growNode.style.top = growNode.style.top - ((newHeight - oldHeight) / 2.0) + "px";
            alert(growNode.style.top);
  }, 100);*/
}