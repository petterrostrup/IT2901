
Template.yourGroups.helpers({
    //returns all your own groups
    //Groups that you are a member of. 
    get_your_groups: function(){
        if(Meteor.user() !== undefined) {
            var groups = [];
            $.each((Meteor.user().profile.groups), function (index, value) {
                groups.push(Groups.findOne({_id: value}));
            });
            return groups;
        }
    },
    //returns all groups in the system. 
    get_all_groups: function(){
        var groupsQuery = Groups.find({}).fetch();
        var groups = [];
        $.each(groupsQuery, function(index, val){
            // console.log(val);
            groups.push(val);
        });
        // console.log(groups);
        return groups;

    }
});

Template.yourGroups.events({
    //redirects you to a grouppage.
    "click .clickAble": function(event){
        // event.preventDefault();
        Router.go("group_page", {_id: event.target.parentElement.className.split(" ")[1]});

    }
});