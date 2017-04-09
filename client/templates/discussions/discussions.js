Session.setDefault('pageSize', 15);
Session.setDefault('page', 0);
//Session.setDefault('loading', true);
Session.setDefault('tag', 'All');
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



	$('#text').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});
	$('#preview').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	$('#previewText').hide()
	Session.set('description', "nothing to preview")

	//clear current question search on rendered
	QuestionsIndex.getComponentMethods().search('');

	$('.ui.dropdown').dropdown({
		allowAdditions: true,
		direction: 'downward'
	});
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


		Session.set('tag', event.target.text);

	},
	'submit .form-register': function(event) {
		event.preventDefault();
		var user = Meteor.users.findOne({
			_id: Meteor.userId()
		});
		var userSubs = user.subscriptions;
		var subs = event.target.tag.value.split(",");
		var subscriptions = [];

		if(userSubs != null) {
			subscriptions = userSubs.concat(subs);

		} else {
			subscriptions = subs;
		}
		var userId = Meteor.userId();

		let userSubscriptions = {
			subscriptions,
			userId
		}

		Meteor.call('updateSubscriptions', userSubscriptions, function(err) {
			if(err) {
				sAlert.error(err.reason);
			}
		})
		$('.ui.multiple.selection.dropdown').dropdown('clear');
		sAlert.success('Your subscriptions are updated successfully');



	},
	'click #preview ': function(event) {


		var description = $('#description').val();
		console.log(description);
		$('#previewText').show()
		$('#description').hide()
		Session.set('description', description)



	},
	'click #text ': function(event) {

		$('#description').show()
		$('#previewText').hide()
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
	description() {
		return Session.get('description')
	}

});


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

	}, 200)
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
