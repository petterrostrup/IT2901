

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
	          template: Template.clientCollectionPill
	        }
	      ]
	    }
	}
});


Template.languages.events({
	"autocompleteselect textarea": function(e, t, doc) {
		console.log(e);
		console.log(t);
		console.log(doc);
	},
	"click .delete_button": function(event, template) {
		console.log(event.target.id);
		Meteor.call("remove_language_profile", event.target.id, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	}
});
