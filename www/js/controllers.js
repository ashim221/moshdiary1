angular.module('starter.controllers', [])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, $q, UserService, $ionicLoading, AuthService, $state, $cookies, $rootScope, $location,$http) {
	
  $scope.login = function(user){
  	alert('load');
    $ionicLoading.show({
      template: 'Logging in ...'
    }),

    AuthService.doLogin(user)
    .then(function(user){
      // success
	 window.localStorage.setItem('count', 1);
      $state.go('home',{}, {reload:true});
		
	  
      $ionicLoading.hide();
    },function(err){
      // error
	  console.log(err);
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  
  
  $scope.logout = function(){
    $ionicLoading.show({
      template: 'Logging out ...'
    }),
	tok = window.localStorage.getItem('token');
	tok = $rootScope.me['0'].token;
	console.log(tok);
	//alert('c');
    AuthService.doLogout(tok);
	   
	    $ionicLoading.hide();
       window.localStorage.user = {};
      $state.go('login',{}, {reload:true});
    };
  
  $scope.signup = function(user){
    $ionicLoading.show({
      template: 'Signing up ...'
    });

    AuthService.doSignup(user)
    .then(function(user){
      // success
		window.localStorage.setItem('count', 1);
      $state.go('home');
      $ionicLoading.hide();
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  
})
// Home controller
.controller('HomeCtrl', function($scope, $state, UserService, AuthService, $ionicActionSheet, $ionicLoading, $http, $ionicScrollDelegate, $timeout, $rootScope, $cordovaFacebook) {
	$scope.calendar = {};
        
	
		$scope.getEvents =function()
	{
			$rootScope.me =  JSON.parse(window.localStorage.user || '{}');
			//console.log($rootScope.me);
		var token = $rootScope.me['0'].token;
		console.log(token);
			console.log("http://moshfitness.london/diary/getuserevent.php?token="+token);
		$http.get("http://moshfitness.london/diary/getuserevent.php?token="+token)
    .then(function (response) {
			$scope.event = response.data.event;
			for (var ki=0;ki<$scope.event.length;ki++)
				{
					console.log($scope.event[ki]);
					$scope.d = new Date($scope.event[ki].startTime);
			$scope.event[ki].startTime = new Date($scope.d.getTime() - ($scope.d.getTimezoneOffset() * 60000));
					$scope.e = new Date($scope.event[ki].endTime);
			$scope.event[ki].endTime = new Date($scope.e.getTime() - ($scope.e.getTimezoneOffset() * 60000));
				}
			$scope.calendar.eventSource = $scope.event; 
			console.log($scope.calendar.eventSource);
		});
	};
	
	$scope.chosen = new Date();
	$scope.calendar.eventSource = $scope.getEvents();
$scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
        };
	$scope.loadEvents = function () {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function (event) {
			console.log(event);
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
			console.log(title);
        };

        $scope.today = function () {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function () {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function (selectedTime, events, disabled) {
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0) + ', disabled: ' + disabled);
			$scope.chosen = selectedTime;
        };
	$scope.addevent = function(selectedTime){
		console.log(selectedTime);
		if(!selectedTime)
			{
				selectedTime = new Date($scope.calendar.currentDate);
			}
		$state.go('addevent', {obj:selectedTime});
	};
	 function createRandomEvents() {
            var events = [];
            for (var i = 0; i < 50; i += 1) {
                var date = new Date();
                var eventType = Math.floor(Math.random() * 2);
                var startDay = Math.floor(Math.random() * 90) - 45;
                var endDay = Math.floor(Math.random() * 2) + startDay;
                var startTime;
                var endTime;
                if (eventType === 0) {
                    startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                    if (endDay === startDay) {
                        endDay += 1;
                    }
                    endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                    events.push({
                        title: 'All Day - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: true
                    });
                } else {
                    var startMinute = Math.floor(Math.random() * 24 * 60);
                    var endMinute = Math.floor(Math.random() * 180) + startMinute;
                    startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                    endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                    events.push({
                        title: 'Event - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false
                    });
                }
            }
		 console.log(events);
            return events;
        }
	
})


.controller('AddEventCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, AuthService, $state) {
	console.log($stateParams.obj);
	console.log($rootScope.me);
	$scope.data=[];
	$scope.data.token = $rootScope.me['0'].token;
	$scope.data.userId = $rootScope.me['0'].userId;
	console.log($scope.tok);
	console.log($scope.userID);
	$scope.error = false;
	$scope.event = '';
	$scope.data.chosendate = new Date($stateParams.obj);
	
	$scope.addtask= function(data)
	{
		console.log(data);
		if ($scope.data.chosendate.getMonth()<10)
					{
						$scope.month = '0'+ ($scope.data.chosendate.getMonth()+1);
					}
				else
					{
						$scope.month = ($scope.data.chosendate.getMonth()+1);
					}
				if ($scope.data.chosendate.getDate()<10)
					{
						$scope.date = '0'+$scope.data.chosendate.getDate();
					}
				else
					
					{
						$scope.date = $scope.data.chosendate.getDate();
					}
		if (!data.all)
			{
				
				
				if ($scope.data.starttime.getHours()<10)
					{
						$scope.starthour = '0'+ $scope.data.starttime.getHours();
					}
				else
					{
						$scope.starthour = $scope.data.starttime.getHours();
					}
				if ($scope.data.starttime.getMinutes()<10)
					{
						$scope.startmin = '0'+$scope.data.starttime.getMinutes();
					}
				else
					
					{
						$scope.startmin = $scope.data.starttime.getMinutes();
					}
				
				if ($scope.data.endtime.getHours()<10)
					{
						$scope.endhour = '0'+ $scope.data.endtime.getHours();
					}
				else
					{
						$scope.endhour = $scope.data.endtime.getHours();
					}
				if ($scope.data.endtime.getMinutes()<10)
					{
						$scope.endmin = '0'+$scope.data.endtime.getMinutes();
					}
				else
					
					{
						$scope.endmin = $scope.data.endtime.getMinutes();
					}
					
				$scope.startDate1 = $scope.data.chosendate.getFullYear()+'-'+($scope.month)+'-'+$scope.date;
				console.log($scope.startDate1);
				$scope.startTime1 =   $scope.starthour+":"+$scope.startmin;
				$scope.endTime1 =   $scope.endhour+":"+$scope.endmin;
				$scope.startTime = $scope.startDate1+'T'+$scope.startTime1;
				console.log($scope.startTime);
		        $scope.endTime = $scope.startDate1+'T'+$scope.endTime1;
				console.log($scope.endTime);
				$scope.data.endTime = new Date($scope.endTime);
				$scope.data.startTime = new Date($scope.startTime);
			
			}
		else
			{
				$scope.startDate1 = $scope.data.chosendate.getFullYear()+'-'+($scope.month)+'-'+$scope.date;
				$scope.startTime1 =   "01:00:00";
				$scope.dat = new Date($scope.startDate1+'T'+$scope.startTime1);
				var nextDay = new Date($scope.dat);
				nextDay.setDate($scope.dat.getDate()+1);
				console.log(nextDay);
				$scope.endDate = nextDay;
				$scope.data.endTime = new Date($scope.endDate);
				$scope.data.startTime = new Date($scope.dat);
			}
		if ($scope.data.chosendate< new Date())
			{
				$scope.error = true;
				setTimeout(function(){
       $ionicLoading.show({
      template: 'Date cannot be in past'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },1500);
				console.log();
			}
		if ($scope.data.startTime> $scope.data.endTime)
			{
				$scope.error = true;
				setTimeout(function(){
       $ionicLoading.show({
      template: 'Time allocation is not correct'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },1500);
			
			}
		if ($scope.error===false)
			{
				 AuthService.addEventUser(data)
    .then(function(data){
					
					
    },function(err){
      // error
	  //console.log(err);
      //$scope.errors = err;
      //$ionicLoading.hide();
    });
  }
			};
})

// UserCtrl controller
.controller('UserCtrl', function($scope, $stateParams, $http, $state, AuthService, UserService, $rootScope) {
  // get contact from Contacts service
  // set the userId here
	
  $scope.myProfile = false;
  $scope.userId = $stateParams.userId;
  if($scope.userId === $rootScope.me['0'].userId)
  {
	  $scope.myProfile = true;
  }
  console.log($scope.myProfile);
 $scope.linkw = "http://moshfitness.london/diary/user_profile.php?userId="+$scope.userId;
  console.log($scope.linkw);
 $scope.editDesc =false;
	$scope.editName =false;
$http.get($scope.linkw).then(function (response) {
	  $scope.userCeleb = response.data.record;
	  console.log($scope.userCeleb);
	 // $scope.twitterId = response.data.record['0'].twitterId;
	  });
	$scope.editDescription= function()
	{
		$scope.editDesc = true;
	};
	$scope.editNamer= function()
	{
		$scope.editName = true;
	};
	$scope.cancel= function()
	{
		$scope.editDesc = false;
		$scope.editName = false;
	};
	$scope.update= function(data)
	{
		data.userId = $scope.userId;
		console.log(data);
		UserService.update(data).then(function(response){
			console.log(response);
			$scope.editDesc = false;
			$scope.editName = false;
			$scope.userCeleb = response.record;
			console.log(response);
		});
	};
		AuthService.findUser($stateParams.userId).then(function(response){
			
    });

        $scope.innapBrowser = function (value) {
            window.open(value, '_blank');
        };

  
});




