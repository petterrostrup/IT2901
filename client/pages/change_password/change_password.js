
Template.change_password.events({
	"submit form": function(event, template) {
		event.preventDefault();

		var old = event.target.old_pass.value;
		var new1 = event.target.new_pass.value;
		var new2 = event.target.re_new_pass.value;
		if (new1 !== new2 && new1.length < 5) {
			template.$("#regError").show();
			return;
		}
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
			event.target.old_pass.value = "";
			event.target.new_pass.value = "";
			event.target.re_new_pass.value = "";
		});
	}
});