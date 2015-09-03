if (Meteor.isServer && Package['netanelgilad:angular-server']) {
  angular = Package['angular:angular-server'].angular;
}
else if (Meteor.isClient && Package['angular:angular']) {
  angular = window.angular;
}
