Router.configure({
	layoutTemplate: 'mainLayout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'pageNotFound',

	waitOn() {
		Meteor.subscribe('notifications');
	},

});

Router.route('/', {
	name: 'home',

	waitOn() {

		return [Meteor.subscribe('usersBasic'),
			//Meteor.subscribe('newsFeedSpecific', (Meteor.userId())),
			Meteor.subscribe('questionsNewsFeed'), Meteor.subscribe('tagsType'),
			Meteor.subscribe('announcementsFeed'), Meteor.subscribe('posts'), Meteor.subscribe('teamsSlug')
		];
	},

	action() {
		//if(UserUtils.isLoggedIn() && !TeamUtils.isInTeam(Meteor.userId()) && !Roles.userIsInRole(Meteor.userId(), [ADMIN, LECTURER, TA, JTA])) {
		// If the user is not in a team make him get into a team !
		//this.render('teamUnavailable');
		//}
		//else {
		if(!UserUtils.isLoggedIn()) {
			this.render('home');
		} else {
			if(UserUtils.isLoggedIn() && !TeamUtils.isInTeam(Meteor.userId()) && !Roles.userIsInRole(Meteor.userId(), [ADMIN, LECTURER, TA, JTA])) {
				this.render('teamUnavailable');
			} else {
				this.render('newsFeed');
			}
		}
		//}
	},

	data() {
		return Meteor.user();
	}

});

Router.route('/faq', {
	name: 'faq',

	action() {
		Session.set('title', 'FAQ');
		this.render('FAQ');
	},

});

Router.route('/contact', {
	name: 'contact',

	action() {
		Session.set('title', 'SEMS | Contact Us');
		this.render('contactUs');
	},

});
