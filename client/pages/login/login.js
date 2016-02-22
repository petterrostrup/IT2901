Template.login.events({
  "click #login-form-link":function(event, template){
    template.$("#login-form").delay(100).fadeIn(100);
    template.$("#register-form").fadeOut(100);
    template.$('#register-form-link').removeClass('active');
    template.$("#login-form-link").addClass('active');
  },
  "click #register-form-link":function(event, template){
    template.$("#register-form").delay(100).fadeIn(100);
    template.$("#login-form").fadeOut(100);
    template.$('#login-form-link').removeClass('active');
    template.$("#register-form-link").addClass('active');
  },
  "submit form":function(event, template){
    event.preventDefault();
    if (template.$("#register-form-link").hasClass('active')){
      var userVar = template.find("#username2").value;
      var firstVar = template.find("#firstname").value;
      var lastVar = template.find("#lastname").value;
      var emailVar = template.find("#email").value;
      var passVar = template.find("#password2").value;
      var confirmVar = template.find("#confirm-password").value;
      var user = {
        username: template.find("#username2").value,
        email: template.find("#email").value,
        profile: {
          first_name: template.find("#firstname").value,
          last_name: template.find("#lastname").value,
        },
        roles: "norm",
      }
      Meteor.call("add_user", user, passVar, function(error, result) {
        if (error){
          console.log(error);
        } else {
          console.log("User added.");
        }
        console.log(result);
      });
    }
    else {
        var userVar = template.find("#username1").value;
        var passVar = template.find("#password1").value;

        Meteor.loginWithPassword(userVar, passVar);

        console.log(Meteor.userId());
    }
  }
});
