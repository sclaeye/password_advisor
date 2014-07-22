var buttons = require('sdk/ui/button/action');
const { Sidebar } = require('sdk/ui');

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
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
  id: 'my-sidebar',
  title: 'Password Advice',
  url: require("sdk/self").data.url("index.html")
});












