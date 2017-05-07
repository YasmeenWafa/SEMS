//USERS

//----------------------------------------

Meteor.publish('currUser', function() {
	return Meteor.users.find({
		_id: this.userId
	});
});

Meteor.publish('fullUsers', function() {
	return Meteor.users.find({});
});
//users of each team
Meteor.publish('TeamUsers', function(teamSlug) {
	var TeamUsers = Teams.findOne({
		slug: teamSlug
	}).members
	return [Meteor.users.find({
		_id: {
			$in: TeamUsers
		}
	}), Images.find({})];
});

Meteor.publish('usersBasic', function() {
	return [Meteor.users.find({}, {
		fields: {
			profile: 1,
			roles: 1,
			subscriptions: 1,
			questionsFollowed: 1
		}
	}), Images.find({})]
})

//for editing staff groups
Meteor.publish('staffUsersBasic', function() {
	return [Meteor.users.find({
		roles: {
			$in: ['teaching-assistant', 'admin', 'junior-teaching-assistant', 'lecturer']
		}
	}, {
		fields: {
			profile: 1,
			roles: 1,
			subscriptions: 1,
			questionsFollowed: 1
		}
	}), Images.find({})]
})


//for user profile
Meteor.publish('usersSpecific', function(userId) {
	return [Meteor.users.find({
		_id: userId
	}), Images.find({})]
})
Meteor.publish('users', function(roles = ROLES) {

	// Checking that roles is an array of strings
	check(roles, [String]);

	var userId = this.userId;
	var user = Meteor.users.findOne(userId);


	var filter = {
		fields: {
			profile: 1,
			roles: 1,
			pendingSurvey: 1,
			subscriptions: 1,
			questionsFollowed: 1
		}
	};

	var selector = {};

	if(roles) {
		var filteredRoles = []
		_.each(roles, function(role) {
			if(_.contains(ROLES, role)) {
				filteredRoles.push(role);
			}
		});


		selector['roles'] = {
			$in: filteredRoles
		}

	}

	if(user) {
		// Admins can have full access to users
		if(Roles.userIsInRole(user, ADMIN)) {
			filter = {};
		}

		return [Meteor.users.find(selector, filter), Images.find({})];
	}
	// If user is not logged in return nothing to fire up ready()
	return [];
});
//--------------------------------------------

//QUESTIONS
//------------------------------------------

Meteor.publish('questions', function() {
	return Questions.find({});
});
Meteor.publish('questionsNewsFeed', function() {
	return Questions.find({}, {
		fields: {
			title: 1,
			tags: 1,
			answers: 1
		}
	});
});
Meteor.publish('questionsBasicInfo', function(limit) {

	return Questions.find({}, {
		fields: {
			slug: 1,
			ownerId: 1,
			title: 1,
			createdAt: 1,
			upvotes: 1,
			downvotes: 1,
			viewers: 1,
			tags: 1,
			answers: 1
		},
		sort: {
			createdAt: -1
		},
		limit: limit,
	});

});

Meteor.publish('questionsIds', function() {
	return Questions.find({}, {
		fields: {
			_id: 1
		}
	})
})

Meteor.publishComposite('questionData', function(questionSlug) {

	return {

		find() {
			return Questions.find({
				slug: questionSlug
			});

		},

		children: [

			{
				find(question) {
					let commentIds = question.comments || [];
					return Comments.find({
						_id: {
							$in: commentIds
						}
					});
				}
			},

			{

				find(question) {
					let answerIds = question.answers || [];
					return Answers.find({
						_id: {
							$in: answerIds
						}
					});
				},

				children: [

					{
						find(answer) {
							let commentIds = answer.comments || [];
							return Comments.find({
								_id: {
									$in: commentIds
								}
							});
						},

					}
				],

			}

		],

	}

});
//-------------------------------------------
//Teams
//--------------------------------------------
//for a specific team
Meteor.publish('teamSpecific', function(slug) {
	return Teams.find({
		slug: slug
	})
})
Meteor.publish('teamsSlug', function() {
	return Teams.find({}, {
		fields: {
			members: 1,
			company: 1,
			isForStaff: 1,
			slug: 1
		}
	})
})

Meteor.publish('teamBasicInfo', function() {
	return Teams.find({}, {
		fields: {
			_id: 1,
			name: 1,
			isForStaff: 1,
			company: 1,
			members: 1,
			siteUrl: 1,
			slug: 1
		}
	})
})
Meteor.publish('teams', function() {
	return Teams.find({});
});
//---------------------------------------------
//Tags
//-----------------------------------
Meteor.publish('tags', function() {
	return Tags.find({});
});
Meteor.publish('tagsInfo', function() {
	return Tags.find({}, {
		fields: {
			name: 1,
			createdAt: 1,
		}
	});
});

Meteor.publish('tagsType', function() {
	return Tags.find({}, {
		fields: {
			name: 1,
			type: 1,
		}
	});
});

//-------------------------------------------

//companies
//---------------------------------------

Meteor.publish('companies', function() {
	return Companies.find({});
});
//-----------------------------------------------
//answers
//-----------------------------------------------
Meteor.publish("answers", function() {
	return Answers.find({});
});
Meteor.publish("answersDiscussions", function() {
	return Answers.find({}, {
		fields: {
			_id: 1,
			bestAnswer: 1
		}
	});
});
Meteor.publish("answersProfileInfo", function() {
	return Answers.find({}, {
		fields: {
			_id: 1,
			ownerId: 1,
			bestAnswer: 1
		}
	});
});

//-----------------------------------------------

//announcements
//-----------------------------------------

Meteor.publish('announcements', function() {
	return Announcements.find({
		milestone: {
			$ne: true
		}
	});
});

Meteor.publish('milestones', function() {
	return Announcements.find({
		milestone: true
	});
});

Meteor.publish('allAnnouncements', function() {
	return Announcements.find();
});
Meteor.publish('announcementsFeed', function() {
	return Announcements.find({}, {
		fields: {
			_id: 1,
			title: 1,
			createdAt: 1,
			ownerId: 1,
			global: 1,
			milestone: 1
		}
	});
});

//Posts
//-------------------------------


Meteor.publish('posts', function() {
	return Posts.find({});
});


Meteor.publish('postsSpecific', function(teamSlug) {
	var teamPosts = Teams.findOne({
		slug: teamSlug
	}).posts
	return Posts.find({
		_id: {
			$in: teamPosts
		}
	});
});


//-------------------------------------------

//newsFeed

Meteor.publish('newsFeed', function() {
	return NewsFeed.find({});
})
Meteor.publish('newsFeedSpecific', function(userId, limit) {
	return NewsFeed.find({
		feedOwnerId: userId
	}, {
		sort: {
			createdAt: -1
		},
		limit: limit
	});
})
Meteor.publish('newsFeedBasic', function() {
	return NewsFeed.find({
		objectId: 1,
		_id: 1,
		feedOwnerId: 1
	})
})


//other
//---------------------------------------------

Meteor.publish('images', function() {
	return Images.find({});
});

Meteor.publish('survey', function() {
	return Survey.find({});
});

Meteor.publish('files', function() {
	return Files.find({});
});

Meteor.publish('materials', function() {
	return Materials.find({});
});


Meteor.publish('notifications', function() {
	return Notifications.find({
		ownerId: this.userId
	});

});
//-----------------------------------------------------
