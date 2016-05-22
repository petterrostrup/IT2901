# IT2901 - Bachelor Project

## How to install the project locally on your machiene

First install MeteorJS

* For Linux/OSX:
	* Type this into a terminal: ```curl https://install.meteor.com/ | sh```
* For Windows:
	* Download this: https://install.meteor.com/windows
	* Follow the instructions

After you have installed Meteor on your computer, go to a directory where you want to save the project.

Clone this repository either by ssh ```git@github.com:petterrostrup/IT2901.git``` or https ```https://github.com/petterrostrup/IT2901.git```

Then created the settings.json file with these parameters: 
```json
{
	// All these fields are required for the application to run properly
	"DEBUG": Boolean,
	"defaultUser": {
		"username": String,
		"password": String,
		"email": String
	}
}
```

Then run the project with this command in a terminal:
```meteor --settings path/to/file/settings.json```

## How to deploy the project on a server

We used something called MUP (Meteor Up). The instructions for deploying can be found here: https://github.com/arunoda/meteor-up

_An important note is that we use node version 0.10.41._

## Packages that are used in the project

### [accounts-password](https://atmospherejs.com/meteor/accounts-password)

This package contains a simple and easy user login for the system.

### [aldeed:collection2](https://atmospherejs.com/aldeed/collection2)

A simple way of defining a database in MongoDB with schemas.

### [iron:router](https://atmospherejs.com/iron/router)

Easy to use routing for urls in Meteor.

### [twbs:bootstrap](https://atmospherejs.com/twbs/bootstrap)

Bootstrap.

### [alanning:roles](https://atmospherejs.com/alanning/roles)

Simple roles implementation for Meteor. 

### [meteor-comments-ui](https://github.com/ARKHAM-Enterprises/meteor-comments-ui)
Handles comments.

### [check](https://atmospherejs.com/meteor/check)

Simple check for elements that are not supposed to be database injections.

### [Chimp](https://chimp.readme.io/)

Testing framework

### [mizzao:autocomplete](https://atmospherejs.com/mizzao/autocomplete)

This is for multiple search selection for createContent

Simple framework for adding constraints on adding, deleting and reading the mongdo database. Based on alanning:roles.

### [accounts-ui](https://atmospherejs.com/meteor/accounts-ui)

Used for change password to a user account.
Can also be used for logging in with facebook etc.

### [meteorhacks:aggregate](https://atmospherejs.com/meteorhacks/aggregate)

Package for using aggregate on Mongo Collections

### [fortawesome:fontawesome](https://atmospherejs.com/fortawesome/fontawesome)

Font Awesome is a package for using icons directly in the html.

### [meteorhacks:search-source](https://atmospherejs.com/meteorhacks/search-source)

A package for using reactive search in Meteor.

### [simplemde](http://www.jsdelivr.com/projects/simplemde)

A nice and simple markdown editor for javascript. Uses a CDN for getting the code.
