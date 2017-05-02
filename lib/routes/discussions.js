Router.route('/discussions', {
	name: 'discussions',

	waitOn() {


		return [Meteor.subscribe('tagsType'),
			//Meteor.subscribe('questionsBasicInfo'),
			Meteor.subscribe('usersBasic'), Meteor.subscribe('answersDiscussions')
		];

		//return [Meteor.subscribe('tags'), Meteor.subscribe('questions'), Meteor.subscribe('users'), Meteor.subscribe('answers')];

	},

	action() {
		Session.set('title', 'Discussions');
		this.render('discussions');
	},

});

Router.route('/discussions/:slug', {
	name: 'question.page',

	waitOn() {
		return [Meteor.subscribe('questionData', this.params.slug), Meteor.subscribe('usersBasic')];
	},

	action() {
		var question = Questions.findOne({
			slug: this.params.slug
		});

		if(!question) {
			Router.go('discussions');
		} else {
			Session.set('title', `${question.title}`);
			this.render('questionPage');
		}
	},

	data() {
		return Questions.findOne({
			slug: this.params.slug
		});
	},

});
