Template.activity.helpers({
    getContents: function() {
        // you need fetch() to get the real data. without it, it just a reference to database.
        var contents = Content.find({createdById: Meteor.userId()}).fetch();
        var contentTitle = [];
        var contentId = [];
        for (content in contents) {
            var text = ContentText.findOne({
                metacontent: contents[content]._id
            });
            contentTitle.push({title: text.title, id: contents[content]._id});
        }
        return contentTitle;
    }
});
