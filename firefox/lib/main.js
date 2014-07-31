var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var tab;
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
	title: 'Password Advisor',
	url: require("sdk/self").data.url("index.html"),
	onReady: function (worker) {
	//message functions to be used to manage inter sidebar page navigation
		worker.port.on("goFull", function() {
		  tabs.open({
			url: require("sdk/self").data.url("index.html"),
			onOpen: function(thisTab){
				tab = thisTab;
				tab.on('close', onOpen);
			},
			onClose: function(){
				worker.port.emit("tabClosed");
			}
		  });
		});
		worker.port.on("goMin", function() {
		  tab.close();
		});
	}
});