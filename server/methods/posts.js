Meteor.methods({

	createPost(Post) {

		var {
			title,
			description,
			ownerId,
			groupId,

		} = Post;



		if(title == "") {
			throw new Meteor.Error(400, "The Post must have a title");
		}
		if(description == "") {
			throw new Meteor.Error(400, "The post must have a description");
		}


		postId = Posts.insert({
			"title": title,
			"description": description,
			"ownerId": Meteor.userId(),
			"createdAt": Date.now()
		});
		Teams.update({
			_id: groupId
		}, {
			$push: {
				posts: postId
			}
		});
		let group = Teams.findOne({
			_id: groupId
		});
		if(group.isForStaff == true) {
			let members = group.members;
			let icon = "<i class=\"hand peace icon\"></i>";
			let content = "A new post on your group";
			let link = `/staff-groups/${group.slug}/posts`;
			for(var i = 0; i < members.length; i++) {
				if(members[i] != Meteor.userId()) {
					Notifications.insert({
						ownerId: members[i],
						content: `${icon} ${content}`,
						link: link,
						read: false,
						createdAt: Date.now()
					});
				}
			}
		} else {
			let members = group.members;
			let icon = "<i class=\"hand peace icon\"></i>";
			let content = "A new post on your team";
			let link = `/teams/${group.slug}/posts`;
			for(var i = 0; i < members.length; i++) {
				if(members[i] != Meteor.userId()) {
					Notifications.insert({
						ownerId: members[i],
						content: `${icon} ${content}`,
						link: link,
						read: false,
						createdAt: Date.now()
					});
				}
			}
		}

	},

	deletePost(postId) {


		let post = Posts.findOne({
			_id: postId
		});
		let userId = Meteor.userId();


		if(!post)
			throw new Meteor.Error(404, 'The post you are trying to delete is not found');

		if(userId == post.ownerId) {
			Teams.update({
				posts: postId
			}, {
				$pull: {
					posts: postId
				}
			});

			Posts.remove(postId);
		} else {
			throw new Meteor.Error(401, 'You are not authorized to delete this post !');
		}
	},
	updatePost(Post) {

		var {
			postId,
			title,
			description,
			ownerId,
			groupId

		} = Post;

		if(title == "") {
			throw new Meteor.Error(401, "You should specify a post title");
		}
		if(description == "") {
			throw new Meteor.Error(401, "You should specify a post description");
		}
		if(ownerId == Meteor.userId()) {

			Posts.update({
				_id: postId
			}, {
				$set: {
					title: title,
					description: description
				}
			});

			let group = Teams.findOne({
				_id: groupId
			});
			if(group.isForStaff == true) {
				let members = group.members;
				let icon = "<i class=\"hand peace icon\"></i>";
				let content = "The post ( " + title + " ) on your group has been updated";
				let link = `/staff-groups/${group.slug}/posts`;
				for(var i = 0; i < members.length; i++) {
					if(members[i] != Meteor.userId()) {
						Notifications.insert({
							ownerId: members[i],
							content: `${icon} ${content}`,
							link: link,
							read: false,
							createdAt: Date.now()
						});
					}
				}
			} else {
				let members = group.members;
				let icon = "<i class=\"hand peace icon\"></i>";
				let content = "The post ( " + title + " ) on your team has been updated";
				let link = `/teams/${group.slug}/posts`;
				for(var i = 0; i < members.length; i++) {
					if(members[i] != Meteor.userId()) {
						Notifications.insert({
							ownerId: members[i],
							content: `${icon} ${content}`,
							link: link,
							read: false,
							createdAt: Date.now()
						});
					}
				}
			}
		} else {
			throw new Meteor.Error(401, "You're not authorized to update this post")
		}
	},



})
