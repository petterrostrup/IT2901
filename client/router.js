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

// Routing for the create content
Router.route("/createContent", {
    name: "createContent",
    template: "createContent"
});

// Routing for the home page
Router.route("/content", {
    name: "content",
    template: "content"
});

// Routing for the main category page
Router.route("/category", {
    name: "category",
    template: "mainCategory"
});

// Routing for a distinct category page.
// Takes the category's id as input from the url
Router.route("/category/:_id", function() {
  var data = Category.findOne({_id: this.params._id});
  if (data)
    this.render("category");
  else
    this.render("page_not_found");
});

// Routing for a distinct content page.
// Takes the content's id as input from the url
Router.route("/content/:_id", function() {
  var data = Content.findOne({_id: this.params._id});
  if (data)
    this.render("content");
  else
    this.render("page_not_found");
});

// Routing for creating content
Router.route("/create_content", {
  name: "create_content",
  template: "createContent",
  onBeforeAction: function() {
    if (!Meteor.userId())
      Router.go("/");
    else
      this.next();
  }
});

// Routing for creating content for a specific category
// The input is the category id
Router.route("/create_content/:_id", function() {
  var cat_id = this.params._id;
  var category = Category.findOne({_id: cat_id});
  if (!category) {
    this.render("page_not_found");
  }
  else
    this.render("create_content");
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
