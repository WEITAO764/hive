function conversationStarted(conversation) {
    //Write code to handle the conversation here
  }
  
  function onInviteAccepted(conversation) {
    conversation.localMedia.attach('#local');
  
    conversation.on('participantConnected', function(participant) {
      participant.media.attach('#remote');
  
      conversationStarted(conversation);
    });
  }