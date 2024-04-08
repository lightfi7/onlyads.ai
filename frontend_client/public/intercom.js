"use strict";

var urlParams = new URLSearchParams(document.currentScript.src.split("?")[1]);

window.intercomSettings = {
  api_base: "https://api-iam.intercom.io",
  app_id: urlParams.get("app_id"), //"a3im1m25",
  name: urlParams.get("name"),
  user_id: urlParams.get("user_id"),
  email: urlParams.get("email"),
  user_hash: urlParams.get("user_hash"),
};
console.log(window.intercomSettings.user_hash);
var w = window;
var ic = w.Intercom;
if (typeof ic === "function") {
  ic("reattach_activator");
  ic("update", w.intercomSettings);
} else {
  var d = document;
  var i = function () {
    i.c(arguments);
  };
  i.q = [];
  i.c = function (args) {
    i.q.push(args);
  };
  w.Intercom = i;
  var l = function () {
    var s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src =
      "https://widget.intercom.io/widget/" + window.intercomSettings.app_id;
    var x = d.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  };
  if (document.readyState === "complete") {
    l();
  } else if (w.attachEvent) {
    w.attachEvent("onload", l);
  } else {
    w.addEventListener("load", l, false);
  }
}
