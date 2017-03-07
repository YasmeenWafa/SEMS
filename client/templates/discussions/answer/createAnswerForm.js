Template.createAnswerForm.events({
  'submit #create-answer-form': function(event, template) {
    event.preventDefault();

    var description = event.target.answer.value;

    // Get the question Id from questionPage template
    var questionId = Template.parentData(1)._id;
    let question = Questions.findOne({_id: questionId})
    let qownerId = question.ownerId;
    console.log(qownerId);
    let qowner = Meteor.users.findOne({_id: qownerId});
    let email = null;
    if(qowner.emails == undefined){
   email = Meteor.settings.adminEmail
   }
    else {

          email = qowner.emails[0].address
     }
  

    var answer = { description, questionId };

    Meteor.call('createAnswer', answer,email ,function(err) {
      if (err)
        sAlert.error(err.reason);
      else
        event.target.answer.value = "";

    });

  },

});
