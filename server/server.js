    // Search
SearchSource.defineSource('categorySearch', function(searchText, options) {
    options = options || {};
    var options = {sort: {isoScore: -1}, limit: 20};
    var arr = [];
    var language = "English";
    if (Meteor.userId()) {
        language = Meteor.user().profile.preferred_language;
    }

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
    } else {
// another transform
//     , {
//     transform: function(doc) {
//         doc.categoryTextObj = CategoryText.find({
//             _id: { $in: doc.categories}
//         });
//         return doc
//     }
// }

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

        // var result = CategoryText.find({}, {
        //     transform: function(doc) {
        //         var hei = Category.findOne({
        //             parent_id: {$exists:false},
        //             _id: doc.metacategory
        //             // categories: { $in: [doc._id]}
        //         });
        //         if (!hei)
        //             return {};
        //         doc.categoryObj = Category.find({
        //             categories: { $in: [doc._id]}
        //         }).fetch();
        //         return doc
        //     }
        // }).fetch();
        // // console.log(result);
        // return result;
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
          // {title: regExp}
          // {community_id: regExp}
        ]};
        var selectorCatText = {$or: [
          {name: regExp},
        ]};
    // search by commu and lang
    // var selectorTag = {$or: [
    //   {name: regExp},
    // ]};
    // var result_community_id = CommunityTags.find(selectorTag, options).fetch()
    // var com_id = result_community_id[0].name
    // var regExpCom = buildRegExp(com_id)
    // console.log(com_id)
    // console.log(regExpCom)
    // var selector = {$or: [
    //   {name: regExp},
    //   {description: regExp},
    //   {community_id: regExpCom}
    // ]};

    // test lookup
//    console.log(ContentText.aggregate([
//     {
//       $lookup:
//         {
//           from: "Content",
//           localField: "metacontent",
//           foreignField: "_id",
//           as: "content_info"
//         }
//    }
// ]))
    // end of test lookup

    // test join collections
    // var result = []
    // var cate = Category.find(selector, options).fetch();
    // for (var index in cate){
    //     result.concat(Content.find({_id: cate[index]._id}).fetch())
    // }
    // console.log(result)
    // end of test join collections
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
                return doc
                }
                }).fetch()

            searchByCatResult.push(resultContent[0])
        }

        // end of category

        // group
        var groupText = GroupsText.find(selectorCatText, { options,
            transform: function(doc) {
                doc.groupObj = Groups.find({
                    groupsText: { $in: [doc._id]}
                }).fetch();
            return doc
            }
        }).fetch()
        var con_id_group = []
        for (var i in groupText) {
            for (var j in groupText[i].groupObj){
                for (var k in groupText[i].groupObj[j].content_ids){
                    con_id_group.push(groupText[i].groupObj[j].content_ids[k])
                }
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
        return doc;
        }
        }).fetch()

        // result - array of contents by name, searchByCatResult - array of contents by category
        var finalResult = searchByCatResult.concat(searchByGroupResult.concat(result))

        return finalResult;
    // return finalResult
//   } else {
// =======
//             transform: function(doc) {
//                 doc.contentObj = Content.find({
//                     contents: { $in: [doc._id]}
//                 }).fetch();
//                 return doc;
//             }
//         }).fetch();
//             // console.log("content")
//             // console.log(result.concat(searchByCatResult))
//         var finalResult = result.concat(searchByCatResult);
//         // console.log("concat")
//         // console.log(finalResult)

//         var finalFinal = [];
//         for (var i in finalResult) {
//             for (var j in finalResult[i]){
//                 finalFinal.push(finalResult[i][j])
//             }
//         }   
//         // console.log("finalfinal")
//         // console.log(finalFinal);
        // return finalFinal
    } else {
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


// Meteor.publish("usernames_category", function(cat_id) {
//     check(cat_id, String);
//     var user_ids = [];
//     var content = Content.find({category_id: cat_id}).fetch();
//     for (var a in content) {
//         user_ids.push(content[a].createdById);
//     }
//     var users = Meteor.users.find({
//         _id: {$in: user_ids}
//     },{
//         username: 1,
//         _id: 0,
//         profile: 0
//     });
//     console.log(users.fetch());
//     return users;
// });


// Publishes all user info to administrators. If the user are not admin, the user cannot access all user information
Meteor.publish("allUsers", function(user) {
    if (this.userId && Roles.userIsInRole(user, ["admin"]) && this.userId === user._id) {
        return Meteor.users.find({});
    }
});

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
    console.log(tag_string);
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

Meteor.publish("groupsText", function() {
    return GroupsText.find({});
});

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

    if (!Groups.findOne() && Meteor.settings.DEBUG){
        console.log("Default Group totally made")
        var id = Groups.insert({
            membersOfGroup: [],
            children_id: [],
            content_ids: [],
            groupsText: []
        });
        var group = {
            name: "NewStudent",
            description: "Informasjon om ny student",
            language: "Norsk",
            metagroups: id
        }
        var content_text_id = GroupsText.insert(group);

        Groups.update({
            _id: id
        }, {
            $push: {groupsText: content_text_id}
        });

        id = Groups.insert({
            membersOfGroup: [],
            children_id: [],
            content_ids: [],
            groupsText: []
        });
        group = {
            name: "Refugee",
            description: "Informasjon om Refugee",
            language: "Norsk",
            metagroups: id
        }
        var content_text_id = GroupsText.insert(group);

        Groups.update({
            _id: id
        }, {
            $push: {groupsText: content_text_id}
        });
    }

    if(!Meteor.users.findOne() && Meteor.settings.DEBUG){
        console.log("Create default user");

        var defUser = Meteor.settings.defaultUser;
        var proflie = {
            first_name: "Ping",
            last_name: "Pong",
            organization: "CC AS",
            languages: languageIds,
            home_adress: "Trondheim",
            preferred_language: "English"
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
