Template.registerHelper('last',
    function(list, elem) {
        return _.last(list) === elem;
    }
);

Template.group.helpers({
	//Finds the current group based on the url. 
	data: function() {
		var data = Groups.findOne({_id: Router.current().params._id});
		return data;
	},
	//Finds all the content that is under this group. 
	//Only finds content that is based on your language. 
	get_content: function() {
		var list = [];
		var default_language = TAPi18next.lng();
		var db_language = LanguageTags.findOne({
			short_form: default_language
		});
		var current = Groups.findOne({_id: Router.current().params._id});
		var user_languages = [];
		if (Meteor.user()) {
			var user_languages = Meteor.user().profile.languages;
			for (var usr_lang in user_languages) {
				user_languages[usr_lang] = LanguageTags.findOne({
					_id: user_languages[usr_lang]
				});
			}
		}
		var hide_other_lang = Session.get("hide_other_languages");
		var all_contents = [];
		// console.log("Hide: " + hide_other_lang);
		for (var c in current.content_ids) {
			var content = Content.findOne({
				_id: current.content_ids[c]
			});
			// console.log(content);
			if (content) {
				var cont_lang = ContentText.find({metacontent: content._id}).fetch();
				if (!cont_lang){
					// console.log("Found no contenttext for content.");
					continue;
				}
				var found = false;
				for (var a in cont_lang) {
					if (cont_lang[a].language === db_language.name){
						all_contents.push({
							_id: content._id,
							title: cont_lang[a].title,
							description: cont_lang[a].description,
							createdBy: content.createdByUsername,
							time: content.timestamp,
							rating: cont_lang[a].upVote.length - cont_lang[a].downVote.length,
							seals: cont_lang[a].seals.length
						});
						found = true;
						break;
					}
				}
				if (found) {
					// console.log("Found content for default language.");
					continue;
				}
				for (var a in cont_lang) {
					for (var langs in user_languages) {
						if (cont_lang[a].language === user_languages[langs].name){
							all_contents.push({
								_id: content._id,
								title: cont_lang[a].title,
								description: cont_lang[a].description,
								createdBy: content.createdByUsername,
								time: content.timestamp,
								rating: cont_lang[a].upVote.length - cont_lang[a].downVote.length,
								seals: cont_lang[a].seals.length
							});
							found = true;
							// console.log("Content found for user languages.");
							break;
						}
					}
					if (found)
						break;
				}
				if (found || !cont_lang.length)
					continue;
				else if (!hide_other_lang) {
					all_contents.push({
						_id: content._id,
						title: cont_lang[0].title,
						description: cont_lang[0].description,
						createdBy: content.createdByUsername,
						time: content.timestamp,
						rating: cont_lang[0].upVote.length - cont_lang[0].downVote.length,
						seals: cont_lang[0].seals.length
					});
					// console.log("Content not supported found.");
				}
				else{
					// console.log("Skipped hided content.");
				}
			}
		}
		// console.log(all_contents);
		return all_contents;
	},
	//Returns all the members of the group
	get_members: function(id){
		var data = Groups.findOne({_id: Router.current().params._id});
		return data.members;
	},

	loadIsMember: function() {
		var data = Groups.findOne({_id: Router.current().params._id});
		var user = Meteor.user();
		Session.set("isMember", data.members.indexOf(user.username) > -1);
	},

	userIsMember: function(){
		return Session.get("isMember");
	}
});


Template.group.events({
	"click #toggleGroup": function(event, template) {
		var obj = {
			join: Meteor.user().profile.groups.indexOf(Router.current().params._id) < 0,
			group_id: Router.current().params._id
		}
		Meteor.call("toggle_group", obj, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				// console.log("LOSLSLSLS");
				// console.log(obj.join);
				// Session.set("isMember", obj.join);
				// console.log(Session.get("isMember"));
			}
		});
	},
	"click .clickAble": function(event){
		// event.preventDefault();
		Router.go("show_content", {_id: event.target.parentElement.className.split(" ")[1]});

	}
});
