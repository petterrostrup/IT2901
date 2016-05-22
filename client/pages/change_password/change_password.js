
Template.change_password.events({
	//listens for submit.
	"submit form": function(event, template) {
		event.preventDefault();

		var old = event.target.old_pass.value;
		var new1 = event.target.new_pass.value;
		var new2 = event.target.re_new_pass.value;
		//Checks for restrictions. Passwords must match and be at least 6 char. 
		if (new1 !== new2 && new1.length < 5) {
			template.$("#regError").show();
			return;
		}
		//Calls changePassword, via the Accounts package. 
		Accounts.changePassword(old, new1, function(error) {
			if (error) {
				template.$("#regErrorText").text("Password not changed.");
				template.$("#regError").show();
				template.$("#logSuccess").hide();
			} else {
				template.$("#regSuccessText").text("Password changed.");
				template.$("#logSuccess").show();
				template.$("#regError").hide();
			}
			//resets the template. 
			event.target.old_pass.value = "";
			event.target.new_pass.value = "";
			event.target.re_new_pass.value = "";
		});
	}
});