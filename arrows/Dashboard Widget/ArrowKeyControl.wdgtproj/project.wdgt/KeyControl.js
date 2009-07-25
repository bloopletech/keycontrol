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

var allowedTime = 1000;
var diffs = [];
var chars = [];
var lastChar = null;
var startTime = null;
var endTime = null;
var score = 0;

function generateCharacter()
{
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

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("score").innerHTML = "GO!";
diffs = [];
      chars = [];
      for(var i = 0; i < 3; i++) chars.push(generateCharacter());

      startRound();
      playing = true;
   }, 3000);
}

function startRound()
{
   chars.push(generateCharacter());
   chars.shift();

   $("out").innerHTML = chars[0];
   startTime = new Date();
}

function endRound(event)
{
   event.stopPropagation();
   if(!playing) return;

   var diff = (new Date()).getTime() - startTime.getTime();
   diffs.push(diff);
   
   var correct = allowedChars[allowedCodes.indexOf(event.keyCode)] == chars[0];

   if(diff < 50 || diff > allowedTime || !correct) gameOver();

   if(correct)
   {
      if(diff <= 1000) score += 1000 - diff;
      $("score").innerHTML = nice(score);
      cloneAndGrow(chars[0]);
   }

   allowedTime -= 7;

   startRound();
}

function gameOver()
{
console.log(diffs);
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

function cloneAndGrow(character)
{
  var growNode = $("out").cloneNode();
  growNode.setTimeout(function()
  {
  
  }, 