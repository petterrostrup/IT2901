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
    template:"login"
});

Router.route("/profile", {
    name:"profile",
    template:"profile"
});
