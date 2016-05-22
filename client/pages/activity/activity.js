Template.activity.helpers({
    //getContents returns all the contents that the current user has created. 
    getContents: function() {
        // you need fetch() to get the real data. without it, it just a reference to database.
        var contents = Content.find({createdById: Meteor.userId()}).fetch();
        var contentTitle = [];
        for (content in contents) {
            var text = ContentText.findOne({
                metacontent: contents[content]._id
            });
            contentTitle.push({title: text.title, id: contents[content]._id});
        }
        return contentTitle;
    }
});
