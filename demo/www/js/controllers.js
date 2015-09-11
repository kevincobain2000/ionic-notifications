angular.module('starter.controllers', ['ionic-notification'])

.controller('DashCtrl', function($scope, ionicNotification) {

  $scope.show = show;

  function show(){
    var lorem = "http://lorempixel.com/100/100/"
    var message = "Wonder if you had time to Check out that report..."
    var params = {
                    title: "Johny Doe",
                    subtitle: "Are you Busy?",
                    message: message.substring(0, 30) +'...',
                    closeIcon: true,
                    media: '<img width="44" height="44" style="border-radius:100%;object-fit:cover" src="'+ lorem+'">',
                  }
    ionicNotification.show(params);
  }

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
