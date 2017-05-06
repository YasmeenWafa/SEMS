Session.setDefault('pageSize', 15);
Session.setDefault('page', 0);
//Session.setDefault('loading', true);
Session.setDefault('tag', 'All');
Session.setDefault('limit', 10);

Template.questionForm.onCreated(function() {
	var template = this;
	template.input = new ReactiveVar('')
	template.output = new ReactiveVar('')
	template.autorun(() => {
		var input = template.input.get()
		template.output.set(input);
	})

})
Template.questionsSearchBox.onCreated(function() {
	Session.setDefault('difference', -1)
	Session.setDefault('currentCount', -1)
	var subscription = Meteor.subscribe('questionsBasicInfo', (Session.get('limit')))
	if(Template.instance().subscriptionsReady()) {
		Session.set('currentCount', Questions.find({}).count())
	}

})
Template.discussions.onRendered(function() {
	$('.ui.accordion').accordion();
	$('.ui.form').form({
		inline: true,
		fields: {

			title: {
				identifier: 'title',
				rules: [{
					type: 'empty',
					prompt: 'Questions should have a title'
				}, {
					type: 'length[4]',
					prompt: 'Title should be longer than 4 characters'
				}]
			},

			description: {
				identifier: 'description',
				rules: [{
					type: 'empty',
					prompt: 'You should have some description about your question'
				}, {
					type: 'length[25]',
					prompt: 'You should provide a better discription of your question. min length is 25 characters '
				}]
			},

			tag: {
				identifier: 'tag',
				rules: [{
					type: 'minCount[1]',
					prompt: 'You need at least one tag for your question'
				}]
			}
		}
	});

	$('.ui.dropdown').dropdown({
		allowAdditions: true,
		direction: 'downward'
	});

	//clear current question search on rendered
	QuestionsIndex.getComponentMethods().search('');


});

Template.discussions.events({
	'submit .new-question': function(event) {
		// Prevent default browser form submit
		event.preventDefault();

		// Get value from form element
		var title = event.target.title.value;

		var tags = event.target.tag.value.split(",");
		var description = event.target.description.value;

		var question = {
			title,
			description,
			tags
		};

		Meteor.call('createQuestion', question, function(err) {
			if(err)
				sAlert.error(err.reason);
			else {

				// Clear form
				event.target.title.value = "";
				event.target.description.value = "";

				// clear selected values
				$('.ui.dropdown').dropdown('clear');

			}
		});

		animateForm();
	},

	'click #toggle-question-form-button': function(event, template) {
		animateForm();
	},
	'click #help-icon': function(event, template) {

		$('#question-help-modal').modal('show');
	},
	'click #filterLabel': function(event, template) {

		/////////////// Analytics ///////////////
		analytics.track('Clicked on filter tag', {
			tagName: event.target.text
		});
		/////////////// Analytics ///////////////
		Session.set('tag', event.target.text);

	},
	'submit .form-register': function(event) {
		event.preventDefault();
		var user = Meteor.users.findOne({
			_id: Meteor.userId()
		});
		var userSubs = user.subscriptions;
		var newSubs;
		if(event.target.tag.value) {
			newSubs = event.target.tag.value.split(",");
		}

		var subscriptions = [];

		if(userSubs != null) {
			subscriptions = userSubs.concat(newSubs);

		} else {
			subscriptions = newSubs;
		}
		var userId = Meteor.userId();
		let userSubscriptions = {
			subscriptions,
			newSubs,
			userId
		}

		/////////////// Analytics ///////////////
		analytics.track('Clicked Subscribe', {
			newSubscriptions: newSubs
		});
		/////////////// Analytics ///////////////

		Meteor.call('addSubscriptions', userSubscriptions, function(err) {
			if(err) {
				sAlert.error(err.reason);
			} else {
				sAlert.success('Your subscriptions are updated successfully');
			}
		})
		$('.ui.multiple.selection.dropdown').dropdown('clear');




	}


});

Template.discussions.helpers({

	countAllOpenedQuestions() {
		var openedQuestionsCounter = 0;
		var questions = Questions.find({}).fetch();
		for(var i = 0; i < questions.length; i++) {

			if(questions[i].isClosed() == false) {
				openedQuestionsCounter++;
			}
		}
		return openedQuestionsCounter;
	},

	questions() {
		return Questions.find({})
	},

	lectureTags() {
		return Tags.find({
			type: "lecture"
		});

	},
	projectTags() {
		return Tags.find({
			type: "project"
		});

	},
	labTags() {
		return Tags.find({
			type: "lab"
		});

	},
	topicTags() {
		return Tags.find({
			type: "topic"
		});

	},
	subTags() {

		var user = Meteor.users.findOne({
			_id: Meteor.userId()
		});
		if(user.subscriptions) {
			return Tags.find({
				name: {
					$nin: user.subscriptions
				}
			});
		}
	},


});

Template.questionForm.helpers({
	'allTags': function() {
		return Tags.find({});

	},

});
Template.questionForm.events({
	'keyup textarea': function(event, template) {
		var input = template.$(event.currentTarget).val();
		template.input.set(input);
	}
})


function animateForm() {
	// Animating Question form on toggle
	$('#add-question-form').transition({
		duration: 500,
		animation: 'slide down'
	});
}

Template.questionsSearchBox.helpers({

	questionsTags() {
		var tagName = Session.get('tag').replace(/(\r\n|\n|\r)/gm, "<br />").split("<br />")
		if(tagName[0] === "All") {
			return Questions.find({}, {
				sort: {
					createdAt: -1
				}
			});
		} else {

			return Questions.find({
				'tags': tagName[0]
			}, {
				sort: {
					createdAt: -1
				}
			}).fetch();
		}
	},

	moreThanTenQuestions() {
		return Questions.find({}).count() > 10
	},
	questionsNotEmpty() {
		return Questions.find({}).count > 0
	},

	questionsIndex() {

		return QuestionsIndex;
	},
	questionsSuggestionsIndex() {
		return QuestionsSuggestionsIndex;
	},
	questionBoxAttributes() {
		var attributes = {
			'placeholder': 'Search in questions',
			'id': 'search-box',
			'class': 'prompt'
		};
		return attributes;
	}
});


Template.questionsSearchBox.events({
	'keyup #search-box': _.throttle(function(e) {
		var query = $(e.target).val().trim();
		if(query) {
			$('.ui.question.search').search('show results');
		} else {
			$('.ui.question.search').search('hide results');
		}

	}, 200),
	'click #load': function(event, template) {

		var currentLimit = Session.get('limit');
		var nextLimit = currentLimit + 10;
		Session.set('limit', nextLimit)
		var subscription = Meteor.subscribe('questionsBasicInfo', (nextLimit))

		if(template.subscriptionsReady()) {
			var newCount = Questions.find({}).count();
			Session.set('difference', newCount - Session.get('currentCount'))
			Session.set('currentCount', newCount)
			if(Session.get('difference') == 0) {
				$('#load').addClass('disabled');
				sAlert.error('No more questions');
			}
		}

	}
});

Template.filterTag.helpers({
	'allTags': function() {
		return Tags.find({});
	},
	countOpenedQuestionsPerTag(tagName) {

		var openedQuestionsCounter = 0;
		var questions = Questions.find({
			tags: tagName
		}).fetch();
		questions.forEach(function(question) {
			if(question.isClosed() != true) {
				openedQuestionsCounter++;
			}
		})
		return openedQuestionsCounter;
	},

})
