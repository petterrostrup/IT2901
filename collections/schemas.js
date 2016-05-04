
var Schema = {}

Schema.UserProfile = new SimpleSchema({
	first_name: {
		type: String,
		label: "First Name",
		max: 30,
		optional: true
	},
	last_name: {
		type: String,
		label: "Last Name",
		max: 30,
		optional: true
	},
	organization: {
		type: String,
		optional: true,
		label: "Organization",
		//todo: hvis official da kan man legge til dette feltet.
	},
	languages: {
		type: [String],
		label: "Languages",
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},
    home_adress: {
        type: String,
        label: "Home Adress",
        optional: true
    },
    preferred_language: {
    	type: String,
    	label: "Preferred language",
    	optional: false
    }
});

Schema.User = new SimpleSchema({
	username: {
		type: String,
		label: "Username",
		max: 20,
		optional: false
		//todo: legg in regex for brukernavn
	},
	email: {
		type: String,
		label: "Email",
		regEx: SimpleSchema.RegEx.Email,
		optional: false
	},
	profile: {
		type: Schema.UserProfile,
		optional: false
	},
	roles: {
		type: [String],
		allowedValues: ["standard", "creator", "official", "admin"],
		optional: false,
		label: "Roles"
	},
	createdAt: {
		type: Date,
	    autoValue: function() {
	      if (this.isInsert) {
	        return new Date();
	      } else if (this.isUpsert) {
	        return {$setOnInsert: new Date()};
	      } else {
	        this.unset();  // Prevent user from supplying their own value
	      }
	    }
	},
	services: {
	    type: Object,
	    optional: true,
	    blackbox: true
	}, 
	createdContents: {
		type: [String],
		optional: false,
		regEx: SimpleSchema.RegEx.Id
	}
});

Schema.Content = new SimpleSchema({
	createdById: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional:false
	},
	createdByUsername: {
		type: String,
		optional: false
	},
	timestamp: {
	    type: Date,
	    autoValue: function() {
		    if (this.isInsert) {
		        return new Date();
		    } else if (this.isUpsert) {
		        return {$setOnInsert: new Date()};
		    } else {
		    	this.unset();  // Prevent user from supplying their own value
		    }
	    }
  	},
  	category_id: {
  		type: String,
  		regEx: SimpleSchema.RegEx.Id,
  		optional: false
  	},
  	community_id: {
  		type: String,
  		//check if the value is id
  		regEx: SimpleSchema.RegEx.Id,
  		optional: false
  	},
  	tags: {
  		type: [Schema.Tags],
  		optional: false
  	},
  	contents: {
  		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
  	}

});

Schema.Tag = new SimpleSchema({
	name: {
		type: String,
		optional: false,
		max: 20
	},
	taggedContent: {
		type:[String],
  		regEx: SimpleSchema.RegEx.Id,
  		optional: true
	}
});

Schema.Category = new SimpleSchema({

	parent_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},
	// parent: {
	// 	type: Schema.Category,
	// 	optional: true
	// },
	children_id: {
		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
	},
	// children: {
	// 	type: [Schema.Category],
	// 	optional: false
	// },
	// content: {
	// 	type: [Schema.Category],
	// 	optional: false
	// },
	content_ids: {
		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
	},
	icon: {
		type: String,
		optional: true
	},
	timestamp: {
	    type: Date,
	    autoValue: function() {
		    if (this.isInsert) {
		        return new Date();
		    } else if (this.isUpsert) {
		        return {$setOnInsert: new Date()};
		    } else {
		    	this.unset();  // Prevent user from supplying their own value
		    }
	    }
  	},
  	categories: {
  		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
  	}
});

Schema.CategoryText = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
		optional: false,
		max: 60
	}, 
	description: {
		type: String,
		optional: false
	},
	metacategory: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},	
	language: {
		type: String,
		optional: false,
		max: 20
	},
});

Schema.ContentText = new SimpleSchema({
	title: {
		type: String,
		optional: false,
		max: 50
	},
	description: {
		type: String,
		optional: false,
		max: 140
	},
	language: {
		type: String,
		optional: false,
		max: 20
	},
	text: {
		type: String,
		optional: false
	},
	metacontent: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},
	timestamp: {
	    type: Date,
	    autoValue: function() {
		    if (this.isInsert) {
		        return new Date();
		    } else if (this.isUpsert) {
		        return {$setOnInsert: new Date()};
		    } else {
		    	this.unset();  // Prevent user from supplying their own value
		    }
	    }
  	},
	upVote: {
		type: [String],
		optional: false
	},
	downVote: {
		type: [String],
		optional: false
	}
});

Schema.LanguageTags = new SimpleSchema({
	name: {
		type: String,
		optional: false
	},
	english_name: {
		type: String,
		optional: false
	},
	short_form: {
		type: String,
		optional: false
	}
});

Schema.Groups = new SimpleSchema({
	name: {
		type: String,
		optional: false
	},
	description: {
		type: String,
		optional: false
	},
	members: {
		type: [String],
		optional: false
	},
	parent_id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: true
	},
	children_id: {
		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
	},
	content_ids: {
		type: [String],
		regEx: SimpleSchema.RegEx.Id,
		optional: false
	},
	timestamp: {
	    type: Date,
	    autoValue: function() {
		    if (this.isInsert) {
		        return new Date();
		    } else if (this.isUpsert) {
		        return {$setOnInsert: new Date()};
		    } else {
		    	this.unset();  // Prevent user from supplying their own value
		    }
	    }
  	}
});



Meteor.users.attachSchema(Schema.User);
Content.attachSchema(Schema.Content);
Tag.attachSchema(Schema.Tag);
Category.attachSchema(Schema.Category);
ContentText.attachSchema(Schema.ContentText);
LanguageTags.attachSchema(Schema.LanguageTags);
CategoryText.attachSchema(Schema.CategoryText);
Groups.attachSchema(Schema.Groups);
