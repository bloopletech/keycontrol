function preference(key, value) {
  key = "akc-" + key;

  if(arguments.length == 2) {
    localStorage[key] = value;
  }
  else {
    return localStorage[key];
  }
}

function showBack(event) {
  $("#username").value = preference('username');
  $("#crypt").value = preference('crypt');
  $("#netScoring").checked = preference('netScoring') != "false";

  $("#front").style.display = "none";
  $("#back").style.display = "block";
}

function showFront(event) {
  $("#front").style.display = "block";
  $("#back").style.display = "none";

  preference('username', $("#username").value);
  preference('crypt', $("#crypt").value);
  preference('netScoring', $("#netScoring").checked ? "true" : "false");
}

var $;
var ajax = null;

function uploadScore(score) {
  if(ajax == null) {
    ajax = new XMLHttpRequest();
    ajax.overrideMimeType("text/plain");
  }

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
}

function randomCrypt(count) {
  var out = "";
  var randChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for(var i = 0; i < count; i++) out += randChars.charAt(Math.floor(Math.random() * randChars.length + 1) - 1);
  return out;
}

function initPreferences() {
  if((typeof preference('crypt')) == 'undefined' || (typeof preference('username')) == 'undefined') {
    preference('crypt', randomCrypt(20));
    preference('username', 'Anonymous-' + randomCrypt(6));
  }
}

function init() {
  $ = document.querySelector.bind(document);

  var engine = new Engine(uploadScore);

  window.addEventListener("keydown", function(event) {
    engine.onKeyDown(event);
  })

  $("body").addEventListener("click", function(e) {
    if(e.target.matches(".play")) engine.start();
    else if(e.target.matches("#settings")) showBack;
    else if(e.target.matches("#done")) showFront;
  })

  initPreferences();
}

document.addEventListener("DOMContentLoaded", init);