/* Client-side router settings */

Router.configure({
  layoutTemplate:"layout",
});

Router.route("/", {
  name:"home",
  template:"home"
});
