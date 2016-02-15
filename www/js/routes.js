angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('blueTest', {
      url: '/page1',
      templateUrl: 'templates/blueTest.html',
      controller: 'blueTestCtrl'
    })

    .state('blueConnect', {
      url: '/page2:address',
      templateUrl: 'templates/blueConnect.html',
      controller: 'blueConnectCtrl'
    })

    .state('blueService', {
      url: '/page3:address/page3:service',
      templateUrl: 'templates/blueService.html',
      controller: 'blueServiceCtrl'
    })

    .state('blueCharact', {
      url: '/page4:address/page4:service/page4:characteristic',
      templateUrl: 'templates/blueCharact.html',
      controller: 'blueCharactCtrl'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page1');

});
