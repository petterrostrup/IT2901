

Template.languages.helpers({
	//retunrns the languages you know. 
	getUserLanguages: function() {
		var languages = Meteor.user().profile.languages;
        var langNames = [];
        for (var a in languages) {
            langNames.push(LanguageTags.findOne({_id: languages[a]}));
        }
        // console.log(langNames);
        return langNames;
	},
	//Settings for the search function
	settingsLang: function() {
		return {
	      position: Session.get("position"),
	      limit: 30,  // more than 20, to emphasize matches outside strings *starting* with the filter
	      rules: [
	        {
	          token: '',
	          collection: LanguageTags,  // Mongo.Collection object means client-side collection
	          field: 'name',
	          // set to true to search anywhere in the field, which cannot use an index.
	          matchAll: true,  // 'ba' will match 'bar' and 'baz' first, then 'abacus'
	          template: Template.languagePill
	        }
	      ]
	    }
	}
});


Template.languages.events({
	//adds languages to your profile
	"autocompleteselect input": function(event, template, doc) {
		//Calls the add_language_profile method in method.js
		Meteor.call("add_language_profile", doc._id, function(error, result) {
			if (error) {
				console.log(error);
				template.$("#regErrorText").text(error);
          		template.$("#regError").show();
          		event.target.value = "";
          		setTimeout(function() {
          			template.$("#regError").hide();
          		}, 3000);
			}
			else {
				event.target.value = "";
			}
		});
	},
	//Delete languages from your profile
	"click .delete_button": function(event, template) {
		//calls the remove_language_profile method in the method.js
		Meteor.call("remove_language_profile", event.target.id, function(error, result) {
			if (error) {
				console.log(error);
				template.$("#regErrorText").text(error);
          		template.$("#regError").show();
          		template.$("#autocomplete-input-Lang").value = "";
          		setTimeout(function() {
          			template.$("#regError").hide();
          		}, 3000);
			}
		});
	}
});
