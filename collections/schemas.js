
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

Schema.Content = new SimpleSchema({
	id: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: false,
		unique: true
	},
	createdById: {
		type: String,
		regEx: SimpleSchema.RegEx.Id,
		optional: false
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
  	//todo catagory not static plz
  	catagory: {
  		type: String,
  		allowedValues: ["Job", "Tips and tricks", "Food", "IT support"],
  		optional: false,
  	},
  	tags: {
  		type: [String],
  		optional: false
  	},
  	description: {
  		type: String,
  		optional: false,
  		max: 140
  	}
});

Meteor.users.attachSchema(Schema.User);
Content.attachSchema(Schema.Content);
