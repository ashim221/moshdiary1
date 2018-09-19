// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova' ,'starter.controllers', 'starter.services', 'nl2br', 'monospaced.elastic','ngStorage', 'ngCookies','ui.rCalendar'])
.run(function($ionicPlatform, AuthService, $state,$ionicLoading, $rootScope) {
  $ionicPlatform.ready(function() {
	 
	  
	  
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    AuthService.userIsLoggedIn().then(function(response)
    {
      if (response === true)
      {
      console.log(response);
          // success 
      $state.go('home',{}, {reload:true});
      $rootScope.backbutton = false; 
      $ionicLoading.hide();
      }
      else
      {
    $state.go('login');
      $ionicLoading.hide();  
      }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider, $ionicConfigProvider) {
	
	$ionicConfigProvider.tabs.position('bottom');
	 $compileProvider.directive('compile', function ($compile) {
        // directive factory creates a link function
        return function (scope, element, attrs) {
          scope.$watch(
              function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
          );
        };
      });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  
  $stateProvider

  // login screen
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl'
  })

.state('forgot', {
    url: '/forgot',
    templateUrl: 'templates/forgot.html',
    controller: 'AuthCtrl'
  })

  // register screen
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'AuthCtrl'
  })

  // Home screen
  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  })
  
  .state('addevent', {
    url: '/newevent',
    templateUrl: 'templates/addevent.html',
    controller: 'AddEventCtrl',
	  params: {
        obj: null
    }
  })

.state('addeventadmin', {
    url: '/neweventadmin',
    templateUrl: 'templates/addeventadmin.html',
    controller: 'AddAdminEventCtrl',
    params: {
        obj2: null,
        obj1:null
    }
  })


.state('editevent', {
    url: '/editevent',
    templateUrl: 'templates/editevent.html',
    controller: 'EditEventCtrl',
    params: {
        obj: null
    }
  })
.state('editadminevent', {
    url: '/editadminevent',
    templateUrl: 'templates/editadminevent.html',
    controller: 'EditEventCtrl',
    params: {
        obj: null
    }
  })
  
.state('usercalendar', {
    url: '/usercalendar',
    templateUrl: 'templates/usercalendar.html',
    controller: 'UserCalendarCtrl',
    params: {
        obj: null
    }
  })

  // User profile
  .state('user', {
    url: '/user/:userId',
    templateUrl: 'templates/user.html',
    controller: 'UserCtrl'
  })


  // Notifications
  // User profile

  .state('notifications', {
    url: '/notifications',
    templateUrl: 'templates/notifications.html',
    controller: 'NotificationCtrl'
  })

  .state('users', {
    url: '/users',
    templateUrl: 'templates/users.html',
    controller: 'AdminCtrl'
  })


  // Notifications
  .state('adduser', {
    url: '/adduser',
    templateUrl: 'templates/adduser.html',
    controller: 'AdminCtrl'
  })

    // if none of the above states are matched, use this as the fallback

    
  $urlRouterProvider.otherwise('/login');


});
