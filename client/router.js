/* Client-side router settings */
Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"page_not_found"
});

// Routing for the home page
Router.route("/", {
  name:"home",
  template:"home"
});

// Routes the user to the login page.
Router.route("/login", {
    name:"login",
    template:"login",
    onBeforeAction: function() {
    	
    	// If a user is logged in, then send it to the home-page
    	if (Meteor.userId())
    		Router.go("/");
    	this.next();
    }
});

Router.route("/profile", {
    name:"profile",
    template:"profile"
});
