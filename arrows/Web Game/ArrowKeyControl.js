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
    //document.body.onkeydown = endRound;
    window.onkeydown = endRound;
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

var allowedTime = 0;
var percentChange = 0;
var character = '';
var startTime = null;
var score = 0;

var timeUsedInterval = null;

function generateCharacter()
{

   /*var newChar = character;
   while(newChar == character) newChar = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length + 1) - 1);
   return newChar;*/
   return allowedChars.charAt(Math.floor(Math.random() * allowedChars.length + 1) - 1);
}

function playGame(event)
{
   $("play").style.visibility = "hidden";
   $("out").innerHTML = "";
   $("out").style.visibility = "visible";

   $("biginfo").innerHTML = "Wait...";
   $("biginfo").style.visibility = "visible";

   score = 0;
   allowedTime = 1000;
   percentChange = 0.1;

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("score").innerHTML = "GO!";
      character = generateCharacter();

      startRound();
      playing = true;
   }, 1500);
}

function startRound()
{
   character = generateCharacter();
   $("out").innerHTML = character;

   $("time_used").style.width = "13px";
   timeUsedInterval = window.setInterval(updateTimeUsed, 20);
   
   startTime = new Date();
}

function endRound(event)
{
   event.stopPropagation();
   if(!playing) return;

   var diff = (new Date()).getTime() - startTime.getTime();

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
      score += (1000 - diff);
      $("score").innerHTML = nice(score);
   }

   //scoring version 3
   if(allowedTime > 300)
   {
      var allowedTimeChange = Math.round((allowedTime - diff) * percentChange);
      allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
   }

   startRound();
}

function gameOver()
{
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

      ajax.open("GET", "http://akc.bloople.net/add/dashboard/10/" + widget.preferenceForKey(K("username")) + "/" + widget.preferenceForKey(K("crypt")) + "/" + score
       + "?" + Math.random());
      ajax.send(" ");
   }

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("play").style.visibility = "visible";
      if($("score").innerHTML == "GO!") $("score").innerHTML = "Have Fun!";
   }, 1500);
}

function gotoSite(event)
{
   window.widget.openURL("http://akc.bloople.net");
}

function updateTimeUsed()
{
   var ratio = ((new Date()).getTime() - startTime.getTime()) / (allowedTime + 0.0);
   if(ratio > 1)
   {
      $("time_used").style.width = "189px";
      window.clearInterval(timeUsedInterval);
   }
   else
   {
      $("time_used").style.width = (ratio * 176) + 13 + "px";
   }
}