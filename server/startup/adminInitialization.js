Meteor.startup(function() {
	if(Meteor.users.find().count() === 0) {
		// Creating a random password
		var pass = Random.id(20);

		// Creating the great admin
		var userId = Accounts.createUser({
			email: Meteor.settings.adminEmail,
			password: pass,
			profile: {
				firstName: 'System',
				lastName: 'Admin',
				GUCId: '00-00000',
				tutorialGroup: 'Adminstration',
			}
		});


		if(userId) {
			// Make em an admin !
			Roles.addUsersToRoles(userId, ADMIN);

			// He is a verified user for sure !
			Meteor.users.update(userId, {
				$set: {
					'emails.0.verified': true
				}
			});

			Email.send({
				to: Meteor.settings.adminEmail,
				from: Meteor.settings.systemEmail,
				subject: "[SEMS] Welcome Adminstrator",
				text: `Hello Admin, your account is created with the following password: ${pass}\nPlease Change your password after logging in`
			});

		}

	}

});
