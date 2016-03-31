# IT2901
Bachelor

# Simple structure
Meteor will distinguish between server and client directories. Code that is only supposed to be reached by the server will be laid here.
Code that is supposed to run on the client, will be laid in the client directory.

# Adding a settings.json file

First create a settings.json file in the server directory.
```json
{
	"DEBUG": true,
	"defaultUser": {
		"username": "...",
		"password": "...",
		"email": "..."
	}
}
```
To run the meteor app, you type the following in the terminal:
`meteor --settings server/settings.json`

We will use this when we git:
 - http://nvie.com/posts/a-successful-git-branching-model/

## Packages that are used in the project

### [summernote:summernote](https://atmospherejs.com/summernote/summernote)

summernote (official): jQuery+Bootstrap WYSIWYG editor with embedded images support

### [mrt:jquery-hotkeys](https://atmospherejs.com/mrt/jquery-hotkeys)

jQuery Hotkeys lets you watch for keyboard events anywhere in your code supporting almost any key combination.

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

### [ongoworks:security](https://atmospherejs.com/ongoworks/security)

### [mizzao:autocomplete](https://atmospherejs.com/mizzao/autocomplete)
This is for multiple search selection for createContent

Simple framework for adding constraints on adding, deleting and reading the mongdo database. Based on alanning:roles.

## How-to-git (simple)

*Never* push directly to the master branch and the developer branch. You can check witch branch you are on by typing "git branch". 
When you will start a new branch, be certan that you branch from *develop*.



### How to start on a new issue

1. Check if the issue already exists.
..* If yes: switch to that branch by typing "git checkout <*branch name*>" and start coding.
2. Check that you are on the branch *develop* by typing "git branch" in your project folder.
3. When you want to start working on a new issue, create a new branch: "git checkout -b <*your-branch-name*>".
4. Now type "git push origin <*your-branch-name*>" so that the branch also pops up in github, not just on your local machine.
5. Now everything is set to go, just start writing code!

### How to push to <*your-branch*>

1. Be on the correct issue/branch.
2. Do all adding and commiting.
3. Type: "git push origin <*your-branch*>" and it will be pushed to your branch.

### How to push things to the develop branch

*Do not merge directly with the develop branch.*

1. Go to the projects github page and press the button "New pull request".
2. Set the base to *develop* and compare to <*your-branch*>
3. Write a little comment and create the pull request.
