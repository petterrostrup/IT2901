
// Only creators can insert and update the Content database.
Content.permit(["insert", "update"]).ifHasRole("creator").apply();

// Only current user can update his own information in the database
// Meteor.users.permit(['update']).ifIsCurrentUser().onlyProps(['services.password', 'profile']);
