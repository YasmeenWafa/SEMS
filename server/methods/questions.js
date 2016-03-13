Meteor.methods({
  deleteQuestion(questionId) {
    let question = Questions.findOne({ _id: questionId });
    let userId = Meteor.userId();


    if (!question)
      throw new Meteor.Error(404, "The question you are trying to delete is not found");

    if (userId === question.ownerId || Roles.userIsInRole(userId, [ADMIN, LECTURER, TA])) {

      // Remove all answers related to this question
      Answers.remove({ _id: { $in: question.answers } });

      // Delete self
      Questions.remove({ _id: questionId });

    } else
      throw new Meteor.Error(401, "You are not authorized to delete this question !");


  },


});
