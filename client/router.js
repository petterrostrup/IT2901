/* Client-side router settings */
Router.configure({
  layoutTemplate:"layout",
});

Router.route("/", {
  name:"home",
  template:"home"
});

Router.route("/login", {
    name:"login",
    template:"login",
    onBeforeAction: function() {
    	if (Meteor.userId())
    		Router.go("/");
    	this.next();
    }
});
