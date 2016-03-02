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

Router.route("/content", {
    name:"content",
    template:"content"
});

// Routes the user to the login page.
Router.route("/login", {
    name:"login",
    template:"login",

    // This function is executed before the route happens.
    // If the user is logged in, it will not be sent to the login page
    onBeforeAction: function() {
    	if (Meteor.userId())
    		Router.go("/");
      else
    	  this.next();
    }
});

// Routes the user to the profile page
Router.route("/profile", {
    name:"profile",
    template:"profile",

    //Executed before the action. 
    //If the user is logged in, it can see the profile page
    onBeforeAction: function() {
      if (Meteor.userId())
        this.next();
      else
        Router.go("/");
    }
});
