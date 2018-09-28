var accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2I5NjU1ZjMxMzQyMGZkMWQ0MmU1MTgzZGRjZjQ0OTVmLTE1MzgwOTk3NzkiLCJpc3MiOiJTS2I5NjU1ZjMxMzQyMGZkMWQ0MmU1MTgzZGRjZjQ0OTVmIiwic3ViIjoiQUNhZjhhMzQ4MjU3NGMyYWY2OGYwODkyNmExNDBjZjg0YiIsImV4cCI6MTUzODEwMzM3OSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoibG9jYWxTYW0iLCJ2aWRlbyI6e319fQ.Qhrn6G2Me_L8HKIhP9UK00upHi7MTAcNI3PVm33f3B0';
var accessManager = Twilio.AccessManager(accessToken);
var client = Twilio.Conversations.Client(accessManager);

// Begin listening for invites to Twilio Video conversations.
client.listen().then(function() {
  client.on('invite', function(invite) {
    invite.accept().then(onInviteAccepted);
  });
});
