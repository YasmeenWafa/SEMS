Template.createPost.onRendered(function() {
	$('#preview').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});

	$('#text').click(function() {
		$('.active').removeClass('active');
		$(this).addClass('active');
	});
})
Template.createPost.helpers({

	description() {
		return Session.get('description')
	}

})
Template.teamPosts.helpers({
	getPosts() {
		var postsIds = this.posts;
		var posts = Posts.find({
			_id: {
				$in: postsIds
			}
		}, {
			sort: {
				createdAt: -1
			}
		}).fetch()

		return posts;
	},
	getOwnerName(ownerId) {
		var owner = Meteor.users.findOne({
			_id: ownerId
		})
		return owner.fullName()
	},
	canEdit(postOwnerId) {
		if(postOwnerId === Meteor.userId()) {
			return true;
		} else {
			return false;
		}
	},


})

Template.teamPosts.events({
	'click #add-button': function(event) {
		event.preventDefault()
		$('#post-create-modal').modal('show');
	},
	'click #edit-icon': function(event) {
		event.preventDefault();
		Session.set('postId', this._id);

		$('#post-edit-modal').modal('show');

	},
	'click #delete-icon': function(event) {
		event.preventDefault();
		let postId = this._id;
		Meteor.call('deletePost', postId, function(err) {
			if(err) {
				sAlert.error(err.reason)
			}
		})
	},
	'click #help-icon': function(event, template) {

		$('#post-help-modal').modal('show');
	},

})

Template.createPost.events({
	'submit #create': function(event) {
		event.preventDefault();
		let title = event.target.title.value;
		let description = event.target.description.value;
		var groupId = Template.parentData(1)._id;
		let ownerId = Meteor.userId();

		let Post = {
			title,
			description,
			ownerId,
			groupId,
		}


		Meteor.call('createPost', Post, function(err) {
			if(err) {
				sAlert.error(err.reason)
			} else {
				event.target.description.value = '';
				event.target.title.value = '';
				$('#post-create-modal').modal('hide');
				//there is a problem with modal hiding
				sAlert.success("Your post was added successfully")
				Router.go(Router.current().route.getName())
			}
		})


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
})
Template.EditPost.events({
	'submit #editForm': function(event) {
		event.preventDefault();
		let title = event.target.title.value;
		let description = event.target.description.value;
		let ownerId = Meteor.userId();
		let postId = Session.get('postId')
		var groupId = Template.parentData(1)._id;

		let Post = {
			postId,
			title,
			description,
			ownerId,
			groupId
		}


		Meteor.call('updatePost', Post, function(err) {
			if(err) {
				sAlert.error(err.reason)
			} else {
				event.target.description.value = '';
				event.target.title.value = '';
				$('#post-edit-modal').modal('hide');
				//there is a problem with modal hiding

				sAlert.success("Your post was edited successfully")
				Router.go(Router.current().route.getName())
			}
		})


	},

})
