var buttons = require('sdk/ui/button/action');
const { Sidebar } = require('sdk/ui');

var button = buttons.ActionButton({
  id: "password-advisor-link",
  label: "Password Advisor",
  icon: {
    "16": "./media/icon-16.png",
    "32": "./media/icon-32.png",
    "64": "./media/icon-64.png"
  },
  onClick: onOpen
});

function onOpen(state) {
  sidebar.show();
}

let sidebar = Sidebar({
  id: 'sidebar-box',
  title: 'Password Advice',
  url: require("sdk/self").data.url("index.html"),
  onAttach: function (worker) {
	console.log(window.top.document.getElementById("sidebar-box").width);
    }
});








