angular.module('starter.controllers', ['ionic-notification'])

.controller('DashCtrl', function($scope, ionicNotification) {

  $scope.show = show;
  $scope.hideAll = hideAll;
  $scope.show({closeIcon:true,closeOnClick:true})
  function show(args){
    
    var title = "Johny Doe"
    var message = "Close icon - " + args.closeIcon
    var subtitle =  "Close On Click - " + args.closeOnClick
    var closeIcon = args.closeIcon
    var closeOnClick = args.closeOnClick
    var media = '<img width="44" height="44" style="border-radius:100%;object-fit:cover" src="http://lorempixel.com/100/100/">'
    

    var params = {
                    title: title,
                    subtitle:subtitle,
                    message: message,
                    closeIcon: closeIcon,
                    closeOnClick: closeOnClick,
                    media: media,
                  }
    ionicNotification.show(params);
  }

  function hideAll(){
    ionicNotification.hideAll(); 
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
