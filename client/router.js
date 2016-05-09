var IR_BeforeHooks = {
  somethingForAnyRoute: function() {
    $('body,html').scrollTop(0);

    $("a[rel=popover]").popover('hide');
    $("a[rel=popover]").popover('disable');
    // Remove the popover DIV from the DOM
    $(".popover").remove();

    $(".navbar-collapse").collapse('hide');

    this.next();
  }
// add more before hooks here
}

// (Global) Before hooks for any route
Router.onBeforeAction(IR_BeforeHooks.somethingForAnyRoute);

// Search
Router.route("/search", {
  name: "search",
  template: "search"
})
// End of search

/* Client-side router settings */
Router.configure({
  layoutTemplate:"layout",
  notFoundTemplate:"page_not_found",
  loadingTemplate: 'loading'
});



// Routing for the home page
Router.route("/", {
  name:"home",
  template:"home"
});

// Router.route("/submit_content",{
//   name:"submit_content",
//   template:"submit_content"
// })

Router.route("/settings", {
  name: "settings",
  template: "settings"
});

Router.route("/activity", {
  name: "activity",
  template: "activity"
});

Router.route("/change_password", function() {
  if (Meteor.userId()) {
    this.render("change_password");
  }
  else {
    this.render("page_not_found");
  }
}, {name: "change_password"});


Router.route("/translateContent/:_id", function() {
  if (!Meteor.user()) {
    this.render("access_denied");
    return;
  }
  var data = Content.findOne({_id: this.params._id});
  // console.log(data);
  Session.set("transelate_content", true);
  if (data)
    this.render("translateContent", {data: {
      edit: false
    }});
  else
    this.render("page_not_found");
}, {name: "translateContent"});


Router.route("/editContent/:_id", function() {
  if (!Meteor.user()) {
    this.render("access_denied");
    return;
  }
  var data = Content.findOne({_id: this.params._id});

  Session.set("transelate_content", false);
  if (data) {
    this.render("translateContent", {data:{
      edit: true
    }});
  }else
    this.render("page_not_found");
}, {name: "editContent"});


// Routing for the edit profile
Router.route("/editprofile", {
    name: "editProfile",
    template: "editProfile",
    onBeforeAction: function() {
    if (!Meteor.userId())
      Router.go("/");
    else
      this.next();
  }
});
  
// Routing for the create content
Router.route("/createContent", {
    name: "createContent",
    template: "createContent",
    onBeforeAction: function() {
    if (!Meteor.userId())
      Router.go("/");
    else
      this.next();
  }
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
  // this.wait(Meteor.subscribe("usernames_category", this.params._id));
  // if (this.ready()) {
  //   var data = Category.findOne({_id: this.params._id});
  //   if (data)
  //     this.render("category");
  //   else
  //     this.render("page_not_found");
  // } else {
  //   this.render('loading');
  // }


  var data = Category.findOne({_id: this.params._id});
  if (data){
    if (!data.content_ids.length && !data.children_id.length && !Meteor.user()){
      this.render("category_empty", {data: data});
    }
    else
      this.render("category", {data: data});
  }
  else
    this.render("page_not_found");
}, {name: "show_category"});

Router.route("/group/:_id", function() {
  var data = Groups.findOne({_id: this.params._id});
  if (data)
    this.render("group");
  else
    this.render("page_not_found");
}, {name: "group_page"});

// Routing for a distinct content page.
// Takes the content's id as input from the url
Router.route("/content/:_id", function() {
  var data = Content.findOne({_id: this.params._id});
  if (data)
    this.render("content");
  else
    this.render("page_not_found");
}, {"name": "show_content"});

// Router.route("/fix_content/", function() {
//   this.render("fix_content");
// }, {name: "fix_content"}); 

Router.route("/submit_content/:_id", function() {
  if (!Meteor.user()) {
    this.render("access_denied");
    return;
  }
  var data = Content.findOne({_id: this.params._id});
  if (data)
    this.render("fix_content");
  else
    this.render("page_not_found");
}, {name: "submit_content"});

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

// Router.route("/submit_content/:_id", function() {
//   var content_id = this.params._id;
//   var content = Content.findOne({_id: content_id});
//   if (!content) {
//     this.render("page_not_found");
//   }
//   else
//     this.render("submitContent");
// }, {"name": "submit_content"});

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

Router.route("/languages", {
  name: "languages",
  template: "languages",

  onBeforeAction: function() {
    if (Meteor.userId()) {
      this.next();
    }else{
      Router.go("/");
    }
  }
});

Router.route("/admin", {
  name: "admin",
  template: "admin",

  onBeforeAction: function() {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.user(), ["admin"]))
      this.next();
    else
      this.render("access_denied");
  }
});
