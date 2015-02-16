msg = new Mongo.Collection('msg');

if (Meteor.isClient) {
  Meteor.subscribe('msgs');

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.body.events({
    'change .system':function(event) {
      event.preventDefault();
      Session.set('system', $('input:radio[name=system]:checked').val());
    },

    'submit .new-msg': function(event){
      event.preventDefault();

      var text = event.target.msg.value,
          system = event.target.system.value;

      Meteor.call('addMsg', text, system);
      event.target.msg.value = '';
    }
  });

  Template.body.helpers({
    msgs: function() {
      if(Session.get('system') != undefined && Session.get('system') != 'all') {
        return msg.find({system: Session.get('system')}, {sort:{createDate: -1}});
      } else {
        return msg.find({}, {sort:{createDate: -1}});
      }
      
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('msgs', function(){
      return msg.find({});
    });
  });
}

Meteor.methods({
  addMsg:function(text, system) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    msg.insert({
      text: text,
      createDate: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      system: system
    });
  }
});
