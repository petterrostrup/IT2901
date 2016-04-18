
Meteor.subscribe("allUsers", Meteor.user());

var show_message_error = function(msg) {
	$("#regErrorText").text(msg);
	$("#regError").show();
	setTimeout(function() {
		$("#regError").hide();
	}, 3000);
}

var show_message = function(msg) {
	$("#regMsgText").text(msg);
	$("#regMsg").show();
	setTimeout(function() {
		$("#regMsg").hide();
	}, 3000);
}

Template.admin_user_page.helpers({
	get_user_information: function() {
		var user_id = Session.get("user_id");
		return Meteor.users.findOne({_id: user_id});
	},
	is_admin: function() {
		return Roles.userIsInRole(Session.get("user_id"), ["admin"]);
	}
});

Template.admin_user_page.events({
	"click .toggle_admin": function(event, template) {
		if (event.target.id === "remove_admin") {
			Meteor.call("remove_user_from_role", {
				user_id: Session.get("user_id"),
				role: "admin"
			}, function(error, result) {
				if (error) 
					show_message_error(error);
				else {
					event.target.className = "btn btn-default toggle_admin";
					event.target.id = "add_admin";
					event.target.value = "Give admin";
				}
			});
		}else {
			Meteor.call("add_user_to_role", {
				user_id: Session.get("user_id"),
				role: "admin"
			}, function(error, result) {
				if (error)
					show_message_error(error);
				else {
					event.target.className = "btn btn-warning toggle_admin";
					event.target.id = "remove_admin";
					event.target.value = "Remove admin";
				}
			});
		}
	}
});

Template.admin.helpers({
	get_languages: function() {
		return LanguageTags.find({});
	},
	get_users: function() {
		return Meteor.users.find({});
	}
});


Template.admin.events({
	"click .menu-btn": function(event, template) {
		var children = template.$("#choose_action").children();
		for (i = 0; i < children.length; i++) {
			children[i].className = "menu-btn";
		}
		event.currentTarget.className = "menu-btn active";
		var template_name = event.currentTarget.id;
		children = template.$("#content").children();
		for (i = 0; i < children.length; i++) {
			// console.log(children[i]);
			children[i].style.display = "none";
		}
		var str = "#" + template_name + "_content";
		template.$(str).show();
	},
	"submit #sub_add_lang": function(event, template) {
		event.preventDefault();

		var language = {
			"name": event.target.lang_name.value,
			"english_name": event.target.eng_lang_name.value,
			"short_form": event.target.short_lang_name.value
		}
		Meteor.call("add_language_system", language, function(error, result) {
			if (error) {
				show_message_error(error);				
			} 
			else {
				show_message("{{_ 'lang_added'}}");
				event.target.lang_name.value = "";
				event.target.eng_lang_name.value = "";
				event.target.short_lang_name.value = "";
			}
		});	
	},
	"click button.del_lang": function(event, template) {
		var id = event.target.id;
		Meteor.call("remove_language_system", id, function(error, result) {
			if (error) {
				show_message_error(error);
			}
			else
				show_message("{{_ 'admin.delete_language_msg'}}");
			if (result) {
				console.log(result);
			}
		});
	},


	"click button.del_user": function(event, template) {
		var id = event.target.id;
		Meteor.call("remove_user_system", id, function(error, result) {
			if (error) {
				show_message_error(error);
			}
			else
				show_message("User removed.");
			if (result) {
				console.log(result);
			}
		});
	},


	"click button.show_user": function(event, template) {
		var id = event.target.id;
		Session.set("user_id", id);
		template.$("#list_users_content").hide();
		// template.$("#list_users_content").style.display = "none";
		template.$("#show_user_content").show();
	},


	"click #users_back": function(event, template) {
		template.$("#show_user_content").hide();
		template.$("#list_users_content").show()	
	}
});