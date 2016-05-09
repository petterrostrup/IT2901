
Template.yourGroups.helpers({
    get_your_groups: function(){
        if(Meteor.user() !== undefined) {
            var groups = [];
            $.each((Meteor.user().profile.groups), function (index, value) {
                groups.push(Groups.findOne({_id: value}));
            });
            return groups;
        }
    },
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
    "click .clickAble": function(event){
        // event.preventDefault();
        Router.go("group_page", {_id: event.target.parentElement.className.split(" ")[1]});

    }
});