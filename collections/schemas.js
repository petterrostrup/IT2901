
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
		optional: true
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
		type: String,
		allowedValues: ["norm", "creator", "official"],
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
	}
});

Schema.Tag = new SimpleSchema({
	name: {
		type: String,
		unique: true
	}
});
/*
TODO: add support for subcategory

Schema.ContentCategory = new SimpleSchema({
	category: {
		type: String,
		optional: false
	}
});
*/
Schema.Content = new SimpleSchema({
	createdById: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional:false
	},
	title: {
		type: String,
		optional: false,
		max: 50
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
  	description: {
  		type: String,
  		optional: false,
  		max: 140
  	}
});

Schema.Category = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
		optional: false,
		max: 60
	},
	url_name: {
		type: String,
		optional: false
	},
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
	description: {
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
});

Meteor.users.attachSchema(Schema.User);
Content.attachSchema(Schema.Content);
Tag.attachSchema(Schema.Tag);
Category.attachSchema(Schema.Category);
