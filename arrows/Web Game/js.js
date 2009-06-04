//Copyright 2008 Brenton Fletcher.
//Check out my portfolio at i.bloople.net

function $(x)
{
   return document.getElementById(x);
}

var ajax = null;

function load()
{
    document.body.onkeypress = endRound;
    window.onkeypress = endRound;
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
var allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
var allowedTime = 1500;
var char = null;
var lastChar = null;
var startTime = null;
var endTime = null;
var score = 0;

function playGame(event)
{
   $("play").style.visibility = "hidden";
   $("out").innerHTML = "";
   $("out").style.visibility = "visible";

   $("biginfo").innerHTML = "Wait...";
   $("biginfo").style.visibility = "visible";

   allowedTime = 1500;
   score = 0;

   setTimeout(function()
   {
      $("biginfo").style.visibility = "hidden";
      $("score").innerHTML = "GO!";
      startRound();
      playing = true;
   }, 3000);
}

function startRound()
{
   while(char == lastChar) char = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length + 1) - 1);
   lastChar = char;
   $("out").innerHTML = char;
   startTime = new Date();
}

function endRound(event)
{
   event.stopPropagation();
   if(!playing) return;

   var diff = (new Date()).getTime() - startTime.getTime();

   if((diff > allowedTime) || (diff <= 60))
   {
      gameOver();
      return;
   }

   if(String.fromCharCode(event.charCode).toLowerCase() == char.toLowerCase())
   {
      score += Math.floor(Math.pow(1.01, allowedTime - diff));
      $("score").innerHTML = nice(score);
      $("up").style.visibility = "visible";
      $("down").style.visibility = "hidden";
   }
   else
   {
      score = Math.floor(score * 0.9);
      $("score").innerHTML = nice(score);
      $("down").style.visibility = "visible";
      $("up").style.visibility = "hidden";
   }
   
   if(allowedTime >= 252) allowedTime *= 0.99; 

   startRound();
}

function gameOver()
{
   playing = false;
   $("out").style.visibility = "hidden";
   $("up").style.visibility = "hidden";
   $("down").style.visibility = "hidden";
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

      ajax.open("GET", "http://kc.bloople.net/add/dashboard/11/" + widget.preferenceForKey(K("username")) + "/" + widget.preferenceForKey(K("crypt")) + "/" + score
       + "?" + Math.random());
      ajax.send(" ");
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