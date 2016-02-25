Template.createTeam.events({
  "submit .form": function(event) {
    event.preventDefault();

    var name = event.target.teamName.value;
    var githubRepo = event.target.repoLink.value;

    var team = {
      name: name,
      repo: githubRepo,
      members: [Meteor.userId()],
      createdAt: new Date()
    };

    Meteor.call("createTeam", team, function(err, teamId) {
      if (err) {
        $('.ui.form').form('add errors', {
          error: err.reason
        });
      } else {
        sAlert.success("Your team is created successfully !")
        Router.go("team", {
          _id: teamId
        });
      }
    });

  },
});


Template.createTeam.onRendered(function() {
  $(document)
    .ready(function() {
      $('.ui.form')
        .form({
          fields: {
            name: {
              identifier: 'teamName',
              rules: [{
                type: 'minLength[6]',
                prompt: 'Team name must be at least 6 characters '
              }]
            },
            repoLink: {
              identifier: 'repoLink',
              rules: [{
                  type: 'empty',
                  prompt: 'Please enter your repo Link'
                }] //TODO : Add github regexp
            },

          }
        });
    });
});
