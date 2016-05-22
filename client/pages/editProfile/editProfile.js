Template.editProfile.events({

	// can use "submit form"
	"submit #edit-profile-submit": function (event, template) {
	    // Prevent default browser form submit
	    event.preventDefault();

	    console.log($("#first_name").val());
	    console.log($("#last_name").val());
	    // console.log($("#organization").val());
	    // console.log($("#languages").val());
	    console.log($("#email").val());
	    var profile = {
	    	first_name: $("#first_name").val(),
	    	last_name: $("#last_name").val()
	    	// organization: $("#organization").val(),
	    	// languages: $("#languages").val().split(","),
	    	// home_adress: "Oslo"
	    }

	    var email = $("#email").val();
	    // console.log(profile.languages);
        //Calls the edit_profile method in methods.js
    	Meteor.call("edit_profile", profile, email, function(error, result){
    		if (error) {
    			console.log(error);
    		} else {
    			// template.$("#createSuccess").show();
                Router.go("profile");
    		}
    	});

	}
});

Template.editProfile.helpers({

    //returns the current user. 
    getUserInfo: function() {
    	var user = Meteor.user();
    	if (user) {
    		user.createdAt = user.createdAt.toISOString().slice(0, 10);
    		return user;
    	} else {
    		return null;
    	}
    },
    //returns the currents users profile. 
    getUserProfile: function() {
    	var profile = Meteor.user().profile;
    	if (profile) {
    		return profile;
    	} else {
    		return null;
    	}
    }
});