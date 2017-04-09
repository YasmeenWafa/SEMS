Template.editAnnouncement.helpers({
	availableTeams() {
		return Teams.find({
			isForStaff: false
		});
	},
	description() {
		return Session.get('description')
	},
	staffGroups() {
		return Teams.find({
			isForStaff: true
		});
	},

	currentAnnouncementDropdownFormatted(teams) {
		var formattedTeams = teams.join(',');
		return formattedTeams;
	},

	currentAnnouncement() {
		if(!!Session.get('selectedAnnouncementId'))
			return Announcements.findOne({
				_id: Session.get('selectedAnnouncementId')
			});
	},

	globalChecked() {
		return Announcements.findOne({
			_id: Session.get('selectedAnnouncementId')
		}).global ? 'checked' : '';
	},

	milestoneChecked() {
		return Announcements.findOne({
			_id: Session.get('selectedAnnouncementId')
		}).milestone ? 'checked' : '';
	}

});

Template.editAnnouncement.onCreated(function() {

	$('#preview').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	$('#text').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});



})
Template.editAnnouncement.onRendered(function() {
	$(document)
		.ready(function() {
			$('.ui.form')
				.form({
					inline: true,
					fields: {
						name: {
							identifier: 'title',
							rules: [{
								type: 'minLength[6]',
								prompt: 'Title must be at least 6 characters '
							}]
						},

						description: {
							identifier: 'description',
							rules: [{
								type: 'empty',
								prompt: 'Please add a description'
							}]
						},
					}
				});
		});

	$('#preview').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	$('#text').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});




	$('.ui.dropdown').dropdown();
	$('.ui.checkbox').checkbox();
});

Template.editAnnouncement.events({
	'submit .form': function(event) {
		event.preventDefault();

		var title = event.target.title.value;
		var description = event.target.description.value;
		var companies = event.target.companies.value.split(',').filter(function(company) {
			return company.length > 0;
		});
		var globalToggle = $('#global').prop('checked');
		var milestone = $('#milestone').prop('checked');

		var data = {
			title: title,
			description: description,
			global: globalToggle,
			milestone: milestone,
			teams: companies,
		};

		var id = Session.get('selectedAnnouncementId');

		Meteor.call('updateAnnouncement', id, data, function(err) {
			if(err) {
				$('.ui.form').form('add errors', {
					error: err.reason
				});
			} else {
				sAlert.success('Your Announcement is edited successfully !');
				$('.ui.form').form('reset');
				$('.selection.dropdown').removeClass('disabled');
				setTimeout(function() {
					$('#announcement-edit-modal').modal('hide');
				}, 50);
				//there is a problem with modal hiding

				Router.go(Router.current().route.getName())
			}
		});

	},

	'change #global': function(event) {
		if(event.currentTarget.checked) {
			$('.selection.dropdown').dropdown('clear');
			$('.selection.dropdown').addClass('disabled');
		} else
			$('.selection.dropdown').removeClass('disabled');

	},

	'click #preview ': function(event) {


		$('.active').removeClass('active');
		$('#preview').addClass('active');

		var description = $('#description').val();
		console.log(description);
		$('#previewText').show()
		$('#description').hide()
		Session.set('description', description)

	},
	'click #text ': function(event) {




		$('.active').removeClass('active');
		$('#text').addClass('active');

		$('#description').show()
		$('#previewText').hide()
	}

})
