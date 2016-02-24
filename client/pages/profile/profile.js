Template.profile.events({
    /*
    "load":function(event, template){
            console.log(Meteor.user().email);
            var panels = $('.user-infos');
            var panelsButton = $('.dropdown-user');
            panels.hide();
            template.find("#mailtoLink").data('href', ('mailto:' + Meteor.user().email ) );
            //attr('href', ('mailto:' + Meteor.user().email ) );

            //Click dropdown
            panelsButton.click(function() {
                //get data-for attribute
                var dataFor = template.$(this).attr('data-for');
                var idFor = template.$(dataFor);

                //current button
                var currentButton = $(this);
                idFor.slideToggle(400, function() {
                    //Completed slidetoggle
                    if(idFor.is(':visible'))
                    {
                        currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
                    }
                    else
                    {
                        currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
                    }
                })
            });
    } */
});