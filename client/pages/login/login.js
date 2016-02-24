Template.login.events({

  // Switches from register form to login form
  "click #login-form-link":function(event, template){
    template.$("#login-form").delay(100).fadeIn(100);
    template.$("#register-form").fadeOut(100);
    template.$('#register-form-link').removeClass('active');
    template.$("#login-form-link").addClass('active');
  },

  // Switches from login form to register form
  "click #register-form-link":function(event, template){
    template.$("#register-form").delay(100).fadeIn(100);
    template.$("#login-form").fadeOut(100);
    template.$('#login-form-link').removeClass('active');
    template.$("#register-form-link").addClass('active');
  },

  // Function for either logging in or create new user
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

      // Calls the method "add_user" in the server. 
      Meteor.call("create_user", user, passVar, function(error, result) {
        if (error){
          console.log(error);
        } else {
          console.log("User added.");

          // Switches from the registration page to login page
          template.$("#login-form").delay(100).fadeIn(100);
          template.$("#register-form").fadeOut(100);
          template.$('#register-form-link').removeClass('active');
          template.$("#login-form-link").addClass('active');
          // template.$("#register-form-link").removeClass("active");

          // Small delay for resetting the html-information
          var tar = event.target;
          setTimeout(function() {
            tar.username2.value = "";
            tar.firstname.value = "";
            tar.lastname.value = "";
            tar.email.value = "";
            tar.password2.value = "";
            tar["confirm-password"].value = "";
          }, 200);
        }
      });
    }
    else {

      // Loads the information from html-page login
      var userVar = template.find("#username1").value;
      var passVar = template.find("#password1").value;

      // If a user are logged in, you cant log in again.
      if (Meteor.userId()) {
        console.log("Du er allerede logget inn.");
        return;
      }

      // Logs the user into the system, throws error if username/password
      // is incorrect.
      Meteor.loginWithPassword({username: userVar}, passVar, function(error) {
        if (error) {
          console.log(error);
          console.log("Feil brukernavn eller passord");
          event.target.password1.value = "";
        } else
          console.log("Du har logget inn!!");
      });
    }
  }
});
