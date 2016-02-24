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
      var passVar = template.find("#password2").value;
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
          template.$("#login-form").delay(100).fadeIn(100);
          template.$("#register-form").fadeOut(100);
          template.$('#register-form-link').removeClass('active');
          template.$("#login-form-link").addClass('active');
          // template.$("#register-form-link").removeClass("active");
        }
      });
    }
    else {
        var userVar = template.find("#username1").value;
        var passVar = template.find("#password1").value;

        if (Meteor.userId()) {
          console.log("Du er allerede logget inn.");
          return;
        }

        Meteor.loginWithPassword({username: userVar}, passVar, function(error) {
          if (error) {
            console.log(error);
            console.log("Feil brukernavn eller passord");
          } else
            console.log("Du har logget inn!!");
        });
    }
  }
});
