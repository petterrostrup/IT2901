

Template.languages.helpers({
	getUserLanguages: function() {
		var languages = Meteor.user().profile.languages;
        var langNames = [];
        for (var a in languages) {
            langNames.push(LanguageTags.findOne({_id: languages[a]}));
        }
        // console.log(langNames);
        return langNames;
	},
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
	"autocompleteselect input": function(event, template, doc) {
		// console.log(doc);
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
	"click .delete_button": function(event, template) {
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
