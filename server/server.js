    // Search
SearchSource.defineSource('categorySearch', function(searchText, options) {
    options = options || {};
    var options = {sort: {isoScore: -1}, limit: 20};
    var arr = [];
    var language = "English";
    if (Meteor.userId()) {
        language = Meteor.user().profile.preferred_language;
    }

    // If there is a search text, it will search through the categories
    if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {$or: [
          {name: regExp},
          {description: regExp},
        ]};

    // try using lookup from mongodb
    
        var result = CategoryText.find(selector, { options,
            transform: function(doc) {
                doc.categoryObj = Category.find({
                    categories: { $in: [doc._id]}
                }).fetch();
            return doc
            }
        }).fetch();
    // end of try lookup
    
        return result
    } 
    // If there are no searchText, it will only return the top categories
    else {
        var list = [];
        var categories = Category.find({}).fetch();
        for (var a in categories) {
            var cat = categories[a];
            if (cat.parent_id)
                continue;
            var texts = CategoryText.find({
                metacategory: cat._id
            }).fetch();
            var found = false;
            for (var t in texts) {
                if (texts[t].language === language) {
                    found = true;
                    texts[t].categoryObj = [cat];
                    list.push(texts[t]);
                    break;
                }
            }
            if (!found) {
                var chosen = texts[0];
                chosen.categoryObj = [cat];
                list.push(chosen);
            }
        }
        return list;
    }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

// content search
SearchSource.defineSource('contentSearch', function(searchText, options) {
    options = options || {};
    var options = {sort: {isoScore: -1}, limit: 20};
    // console.log("SEARHC: " + searchText);
    if(searchText) {
        var regExp = buildRegExp(searchText);
        var selector = {$or: [
          {title: regExp},
          {description: regExp},
        ]};
        var selectorCatText = {$or: [
          {name: regExp},
        ]};
        //concat two returned collections
        // category
        var catText = CategoryText.find(selectorCatText, { options,
            transform: function(doc) {
                doc.categoryObj = Category.find({
                    categories: { $in: [doc._id]}
                }).fetch();
            return doc
            }
        }).fetch();
        var con_id = []
        for (var i in catText) {
            for (var j in catText[i].categoryObj){
                for (var k in catText[i].categoryObj[j].content_ids){
                    con_id.push(catText[i].categoryObj[j].content_ids[k]);
                }
            }
        }
        // got content_ids then use it to get content
        var searchByCatResult = []
        var resultContent = []
        for (var i in con_id) {
            var resultContent = ContentText.find({metacontent:con_id[i]}, { options,
                transform: function(doc) {
                    doc.contentObj = Content.find({
                        contents: { $in: [doc._id]}
                    }).fetch();
                    var category = CategoryText.find({
                        metacategory: doc.contentObj[0].category_id
                    }).fetch()
                    doc.categoryName = category[0].name
                return doc
                }
                }).fetch()
            searchByCatResult.push(resultContent[0])
        }
        // end of category
        // group
        var groupText = Groups.find(selectorCatText, options).fetch()
        var con_id_group = []
        for (var i in groupText) {
            for (var j in groupText[i].content_ids){
                
                con_id_group.push(groupText[i].content_ids[j])
                
            }
        }
        // got content_ids then use it to get content
        var searchByGroupResult = []
        var resultContentGroup = []
        for (var i in con_id_group) {
            var resultContentGroup = ContentText.find({metacontent:con_id_group[i]}, { options,
                transform: function(doc) {
                    doc.contentObj = Content.find({
                        contents: { $in: [doc._id]}
                    }).fetch();
                    var category = CategoryText.find({
                        metacategory: doc.contentObj[0].category_id
                    }).fetch()
                return doc
                }
                }).fetch()
            searchByGroupResult.push(resultContentGroup[0])
        }
        // end of group
        var result = ContentText.find(selector, { options,
        transform: function(doc) {
            doc.contentObj = Content.find({
                contents: { $in: [doc._id]}
            }).fetch();
            var category = CategoryText.find({
                metacategory: doc.contentObj[0].category_id
            }).fetch()
            doc.categoryName = category[0].name
        return doc;
        }
        }).fetch()

        // result - array of contents by name, searchByCatResult - array of contents by category
        var finalResult = searchByCatResult.concat(searchByGroupResult.concat(result))
        return finalResult;
    } else {
        // If there are no search text, no content will be shown
        return [];
    var result = ContentText.find({}, {
        transform: function(doc) {
            doc.contentObj = Content.find({
                contents: { $in: [doc._id]}
            }).fetch();
            return doc
        }
    }).fetch()
    return result;
  }
});

    function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}


// End of Search
// Publishes your personal information for use in the profile page
Meteor.publish("personalInfo", function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        });
    }
});


// Publishes all user info to administrators. If the user are not admin, the user cannot access all user information
Meteor.publish("allUsers", function(user) {
    if (this.userId && Roles.userIsInRole(user, ["admin"]) && this.userId === user._id) {
        return Meteor.users.find({});
    }
});

// All these publish methods are methods for giving the database out to the users

Meteor.publish("content", function(){
	return Content.find({});
});

Meteor.publish("contentText", function() {
    return ContentText.find({});
});

Meteor.publish("categoryText", function() {
    return CategoryText.find({});
});

Meteor.publish("tags", function(tag_string) {
    return Tag.find({
        name: {$regex: tag_string}
    });
    // return Tag.find({});
});

Meteor.publish("categories", function() {
   // return Category.find({});
   return Category.find({});
});

Meteor.publish("LanguageTags", function() {
    return LanguageTags.find({});
});

Meteor.publish("groups", function() {
    return Groups.find({});
});

// Local method for creating a new category
var add_category = function(icon, catText) {
    var mainCat = {
        children_id: [],
        content_ids: [],
        categories: [],
        icon: icon
    }
    var mainId = Category.insert(mainCat);
    catText.metacategory = mainId
    var childId = CategoryText.insert(catText);
    Category.update({_id: mainId}, {
        $push: {categories: childId}
    });
}


Meteor.startup(function(){
    
    // If no category is found, it will create all the standard categories
    if (!Category.findOne()){
        console.log("Default category created.");
        add_category("community2", {
            name: "Samfunn",
            description: "Informasjon anngående samfunnet",
            language: "Norsk"
        });
        add_category("economy2", {
            name: "Økonomi",
            description: "Informasjon anngående økonomi",
            language: "Norsk"
        });
        add_category("education2", {
            name: "Utdanning",
            description: "Informasjon anngående utdanning og skolering",
            language: "Norsk"
        });
        add_category("food2", {
            name: "Mat",
            description: "Informasjon anngående skaffing av mat, forberedelse, oppskrifter etc.",
            language: "Norsk"
        });
        add_category("health2", {
            name: "Helse",
            description: "Informasjon anngående helse og hvor man kan få hjelp",
            language: "Norsk"
        });
        add_category("help2", {
            name: "Hjelp",
            description: "Hvor hjelp er å finne og hvem man kan be om hjelp",
            language: "Norsk"
        });
        add_category("housing2", {
            name: "Bolig",
            description: "Hvordan å få tak i bolig og annet relevant informasjon",
            language: "Norsk"
        });
        add_category("jobs2", {
            name: "Jobb",
            description: "Jobbrelatert informasjon. Hvordan å skaffe jobb etc.",
            language: "Norsk"
        });
        add_category("language2", {
            name: "Språk",
            description: "Informasjon anngående språk. Hvordan å lære nye språk etc.",
            language: "Norsk"
        });
        add_category("legal2", {
            name: "Rettshjelp",
            description: "Rettshjelp, lover etc.",
            language: "Norsk"
        });
        add_category("transport2", {
            name: "Transport",
            description: "Informasjon anngående transport",
            language: "Norsk"
        });
        add_category("city2", {
            name: "By",
            description: "Informasjon anngående byen",
            language: "Norsk"
        });
    }
    

    var languageIds = [];
    // add something in database for language test
    if (!LanguageTags.findOne()){
        console.log("Default LanguageTags created.");
        languageIds.push(LanguageTags.insert({
            name: "Norsk",
            english_name: "Norwegian",
            short_form: "no"
        })); 
        languageIds.push(LanguageTags.insert({
            name: "English",
            english_name: "English",
            short_form: "en"
        }));
        languageIds.push(LanguageTags.insert({
            name: "Español",
            "english_name": "Spanish",
            short_form: "es"
        }));
    }

    // add something in database for community test

    if (!Groups.findOne()){
        console.log("Default Group made.")
        Groups.insert({
            name: "StudentInTrondheim",
            // description: "party party party",
            members: [],
            content_ids: []
        });
    }

    if(!Meteor.users.findOne()){
        console.log("Create default user");

        var defUser = Meteor.settings.defaultUser;
        var proflie = {
            first_name: "Ping",
            last_name: "Pong",
            organization: "CC AS",
            languages: languageIds,
            preferred_language: "en",
            groups: []
        }
        userid = Meteor.users.insert({
            username: defUser.username,
            email: defUser.email,
            profile:proflie,
            roles: ["admin"],
            createdContents: []
        });
        Accounts.setPassword(userid, defUser.password);
    }

});
