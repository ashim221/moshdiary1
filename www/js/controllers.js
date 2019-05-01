angular.module('starter.controllers', [])

// Authentication controller
// Put your login, register functions here
.controller('AuthCtrl', function($scope, $ionicHistory, $ionicSideMenuDelegate, $q, UserService, $ionicLoading, AuthService, $state, $cookies, $rootScope, $location,$http) {
	
	

  $scope.login = function(user){
  	//alert('load');
    $ionicLoading.show({
      template: 'Logging in ...'
    }),

    AuthService.doLogin(user)
    .then(function(user){
      // success
	 window.localStorage.setItem('count', 1);
	$rootScope.me =  JSON.parse(window.localStorage.user);
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
	
      $ionicLoading.hide();
      setTimeout(function(){
       $ionicLoading.show({
      template: 'You have registered successfully. Once you are approved, you will be emailed.'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
	 $state.go('login');
  },1500);
      
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  
})
// Home controller
.controller('HomeCtrl', function($scope, $state, UserService, AuthService, $ionicActionSheet,$filter, $ionicPopup, $ionicLoading, $http, $ionicScrollDelegate, $timeout, $rootScope) {
	$scope.calendar = {};
	$scope.display ="month";
	$scope.chosen = new Date();

	    $scope.getEvents =function()
	{
		$rootScope.backbutton=false;
			console.log(window.localStorage.user);
		$rootScope.me =  JSON.parse(window.localStorage.user);
			console.log($rootScope.me);
		var token = $rootScope.me['0'].token;
		console.log(token);
		AuthService.getUser(token).then(function (response) {});
			console.log("http://moshfitness.london/diary/getuserevent.php?token="+token);
		$http.get("http://moshfitness.london/diary/getuserevent.php?token="+token)
    .then(function (response) {
			$scope.event = response.data.event;
			for (var ki=0;ki<$scope.event.length;ki++)
				{
					//console.log($scope.event[ki]);
					$scope.d = new Date($scope.event[ki].startTime);
			$scope.event[ki].startTime = new Date($scope.d.getTime());
					$scope.e = new Date($scope.event[ki].endTime);
			$scope.event[ki].endTime = new Date($scope.e.getTime());
				}
			$scope.calendar.eventSource = $scope.event; 
			console.log($scope.calendar.eventSource);

		});
	};

	$scope.calendar.eventSource = $scope.getEvents();
$scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
	console.log(mode);
        };
	$scope.loadEvents = function () {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function (event) {
			console.log(event);
			var start = $filter('date')(event.startTime, "hh:mm a");
	var end = $filter('date')(event.endTime, "hh:mm a");
	var date1 = $filter('date')(event.startTime, "dd MMMM yyyy");
	console.log(event.startTime);
	console.log(date1);
	if (!event.allDay)
	{
	var temp = 'Date:'+date1+ '<br>'+'Time:'+ start   + '-' + end   + '<br> ' +event.description;
	}
	else
	{
		var temp = 'Date:'+date1+ '<br>'+'Time: All Day'+ '<br> ' +event.description;
	}
var confirmPopup = $ionicPopup.confirm({
	
         title: event.title,
         template: temp,
         cancelText: 'Edit'
      });
confirmPopup.then(function(res) {
         if(res) {
            
           

         } else {
            $state.go('editevent', {obj:event});
         }
      });

         
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
			//console.log(title);
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
.controller('NotificationCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, NotificationService, $state, $ionicPopup) {


if ($rootScope.me['0'].userType==='admin')
{
	console.log($rootScope.me);
NotificationService.getNotifications($rootScope.me['0'].token)
    .then(function(data){
				$scope.notifications = data.data;
				console.log($scope.notifications.length);	
					
    },function(err){
      // error
	  //console.log(err);
      //$scope.errors = err;
      //$ionicLoading.hide();
    });
}
$scope.accept= function (userId)
{
	NotificationService.acceptUser(userId, $rootScope.me['0'].token)
    .then(function(data){
				$scope.notifications = data.data;
				setTimeout(function(){
       $ionicLoading.show({
      template: 'User is accepted'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },3000);	
 NotificationService.getNotifications($rootScope.me['0'].token)
    .then(function(data){
				$scope.notifications = data.data;
				console.log($scope.notifications.length);	
					
    });
					
    },function(err){
      // error
	  //console.log(err);
      //$scope.errors = err;
      //$ionicLoading.hide();
    });
}

$scope.decline= function(user) {
	
      var confirmPopup = $ionicPopup.confirm({
         title: 'Decline '+user.userFullName,
         template: 'Are you sure?'
      });

      confirmPopup.then(function(res) {
         if(res) {
            
           NotificationService.declineUser(user.userId, $rootScope.me['0'].token)
    .then(function(data){
				$scope.notifications = data.data;
				setTimeout(function(){
       $ionicLoading.show({
      template: 'User is declined'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },1500);	
 NotificationService.getNotifications($rootScope.me['0'].token)
    .then(function(data){
				$scope.notifications = data.data;
				console.log($scope.notifications.length);	
					
    });
					
    },function(err){
      // error
	  //console.log(err);
      //$scope.errors = err;
      //$ionicLoading.hide();
    }); 

         } else {
            console.log('Not sure!');
         }
      });
		
   };

})


.controller('AdminCtrl', function($scope, $rootScope, $http, $ionicLoading, AuthService, NotificationService,$state, $ionicPopup) {
  
 $scope.adduser = function(user){
    $ionicLoading.show({
      template: 'Adding User ...'
    });

    AuthService.doAddUser(user, $rootScope.me['0'].token)
    .then(function(user){
      // success
	
      $ionicLoading.hide();
      setTimeout(function(){
       $ionicLoading.show({
      template: 'You have registered successfully.'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
	 $state.go('home');
  },2000);
      
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  $rootScope.me =  JSON.parse(window.localStorage.user);
			console.log($rootScope.me);
		var token = $rootScope.me['0'].token;
  console.log("http://moshfitness.london/diary/admingetusers.php?token="+$rootScope.me['0'].token);
  $http.get("http://moshfitness.london/diary/admingetusers.php?token="+$rootScope.me['0'].token)
    .then(function (response) {
			$scope.users = response.data.data;
			console.log($scope.users);


		});
    $scope.refresh = function()
      {
        $rootScope.me =  JSON.parse(window.localStorage.user);
      console.log('refreshing');
    var token = $rootScope.me['0'].token;
  console.log("http://moshfitness.london/diary/admingetusers.php?token="+$rootScope.me['0'].token);
  $http.get("http://moshfitness.london/diary/admingetusers.php?token="+$rootScope.me['0'].token)
    .then(function (response) {
      $scope.users = response.data.data;
      console.log($scope.users);
      });
      }
  
$scope.seecalendar = function(user)
{
	$state.go('usercalendar', {obj:user});
}





})

.controller('UserCalendarCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, AuthService, $state, $filter, $ionicPopup) {
console.log($stateParams.obj);
$scope.userId = $stateParams.obj.userId;
$scope.userName = $stateParams.obj.userFullName;
$scope.userPic = $stateParams.obj.userPic;
$scope.calendar = {};
$scope.event = '';
$scope.user = $stateParams.obj;

	$scope.display ="month";
	$scope.chosen = new Date();
$scope.getEvents =function()
	{
		var token = $rootScope.me['0'].token;
		console.log(token);
			console.log("http://moshfitness.london/diary/getadminuserevents.php?token="+token+"&userId="+$scope.userId);
		$http.get("http://moshfitness.london/diary/getadminuserevents.php?token="+token+"&userId="+$scope.userId)
    .then(function (response) {
			$scope.event = response.data.event;
			for (var ki=0;ki<$scope.event.length;ki++)
				{
					console.log($scope.event[ki]);
					$scope.d = new Date($scope.event[ki].startTime);
			$scope.event[ki].startTime = new Date($scope.d.getTime());
					$scope.e = new Date($scope.event[ki].endTime);
			$scope.event[ki].endTime = new Date($scope.e.getTime());
				}
			$scope.calendar.eventSource = $scope.event; 
			console.log($scope.calendar.eventSource);

		});
	};
	$scope.calendar.eventSource = $scope.getEvents();
$scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
	console.log(mode);
        };
	$scope.loadEvents = function () {
            $scope.calendar.eventSource = createRandomEvents();
        };

        $scope.onEventSelected = function (event) {
			console.log(event);
			var start = $filter('date')(event.startTime, "hh:mm a");
	var end = $filter('date')(event.endTime, "hh:mm a");
	var date1 = $filter('date')(event.startTime, "dd MMMM yyyy");
	event.other=true;
	event.user = $scope.user;
	console.log(event.startTime);
	console.log(date1);
	if (!event.allDay)
	{
	var temp = 'Date:'+date1+ '<br>'+'Time:'+ start   + '-' + end   + '<br> ' +event.description;
	}
	else
	{
		var temp = 'Date:'+date1+ '<br>'+'Time: All Day'+ '<br> ' +event.description;
	}
var confirmPopup = $ionicPopup.confirm({
	
         title: event.title,
         template: temp,
         cancelText: 'Edit'
      });
confirmPopup.then(function(res) {
         if(res) {
            
           

         } else {
            $state.go('editadminevent', {obj:event});
         }
      });

         
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
			//console.log(title);
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



$scope.addevent = function(selectedTime, user){
		console.log(selectedTime);
		if(!selectedTime)
			{
				selectedTime = new Date($scope.calendar.currentDate);
			}
		$state.go('addeventadmin', {obj2:selectedTime, obj1:user});
	};



	})

.controller('AddAdminEventCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, AuthService, $state, $filter) {
console.log($stateParams.obj2);
console.log($stateParams.obj1);
$scope.data=[];
 $scope.data.chosendate = new Date($stateParams.obj2);

$scope.data.user1 = $stateParams.obj1;



$scope.difference = new Date().getTimezoneOffset();
	
	$scope.difference = $scope.difference/60;
	console.log($scope.difference);
	$scope.addtask= function(data)
	{
		$scope.data.userId = $stateParams.obj1.userId;
		$scope.data.token = $rootScope.me['0'].token;
		$scope.error = false;
		console.log(data);
		if ($scope.data.chosendate.getMonth()<9)
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
				console.log($scope.data);
				$scope.hourss = $scope.data.starttime.getUTCHours()+$scope.difference;
				console.log($scope.hourss);
				if ($scope.hourss<10)
					{
						$scope.starthour = '0'+ $scope.hourss;
					}
				else
					{
						$scope.starthour = $scope.hourss;
					}
				if ($scope.data.starttime.getUTCMinutes()<10)
					{
						$scope.startmin = '0'+$scope.data.starttime.getUTCMinutes();
					}
				else
					
					{
						$scope.startmin = $scope.data.starttime.getUTCMinutes();
					}
					$scope.endhourss = $scope.data.endtime.getUTCHours()+$scope.difference;
				
				if ($scope.endhourss<10)
					{
						$scope.endhour = '0'+ $scope.endhourss;
					}
				else
					{
						$scope.endhour = $scope.endhourss;
					}
				if ($scope.data.endtime.getUTCMinutes()<10)
					{
						$scope.endmin = '0'+$scope.data.endtime.getUTCMinutes();
					}
				else
					
					{
						$scope.endmin = $scope.data.endtime.getUTCMinutes();
					}
					
				$scope.startDate1 = $scope.data.chosendate.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
				console.log($scope.starthour);
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
				$scope.startDate1 = $scope.data.chosendate.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
				$scope.startTime1 =   "11:00:00";
				$scope.endTime1 =   "22:00:00";
				$scope.dat = new Date($scope.startDate1+'T'+$scope.startTime1);
				$scope.dat1 = new Date($scope.startDate1+'T'+$scope.endTime1);

				$scope.data.endTime = new Date($scope.dat1);
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
				console.log(data);
				 AuthService.addAdminEventUser($scope.data)
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




.controller('EditEventCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, AuthService, $state, $filter) {
	console.log($stateParams.obj);
	$scope.data = [];
	//$scope.eventdetail = $stateParams.obj;
	$scope.data.eventname = $stateParams.obj.title;
	$scope.data.chosendate1 = new Date($stateParams.obj.startTime);
	$scope.data.starttime = new Date($stateParams.obj.startTime);
	$scope.data.endtime = new Date($stateParams.obj.endTime);
	$scope.data.all = $stateParams.obj.allDay;
	$scope.data.eventdescription = $stateParams.obj.description;
	$scope.data.eventId = $stateParams.obj.eventId;
	$scope.data.user = $stateParams.obj.user;
	$scope.data.other = $stateParams.obj.other;
	$scope.data.token = $rootScope.me['0'].token;
$scope.barcolour = function()
{
	if($scope.data.other)
	{
		return 'bar-balanced';
	}
	else
	{

	}
}
$scope.edittask= function(data)
	{
		console.log(data);
		$scope.error = false;
		if ($scope.data.chosendate1.getMonth()<9)
					{
						$scope.month = '0'+ ($scope.data.chosendate1.getMonth()+1);
					}
				else
					{
						$scope.month = ($scope.data.chosendate1.getMonth()+1);
					}
				if ($scope.data.chosendate1.getDate()<10)
					{
						$scope.date = '0'+$scope.data.chosendate1.getDate();
					}
				else
					
					{
						$scope.date = $scope.data.chosendate1.getDate();
					}
		if (!data.all)
			{
				
				console.log('12');
				if ($scope.data.starttime.getUTCHours()<10)
					{
						$scope.starthour = '0'+ $scope.data.starttime.getUTCHours();
					}
				else
					{
						$scope.starthour = $scope.data.starttime.getUTCHours();
					}
				if ($scope.data.starttime.getUTCMinutes()<10)
					{
						$scope.startmin = '0'+$scope.data.starttime.getUTCMinutes();
					}
				else
					
					{
						$scope.startmin = $scope.data.starttime.getUTCMinutes();
					}
				
				if ($scope.data.endtime.getUTCHours()<10)
					{
						$scope.endhour = '0'+ $scope.data.endtime.getUTCHours();
					}
				else
					{
						$scope.endhour = $scope.data.endtime.getUTCHours();
					}
				if ($scope.data.endtime.getUTCMinutes()<10)
					{
						$scope.endmin = '0'+$scope.data.endtime.getUTCMinutes();
					}
				else
					
					{
						$scope.endmin = $scope.data.endtime.getUTCMinutes();
					}
					
				$scope.startDate1 = $scope.data.chosendate1.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
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
				$scope.startDate1 = $scope.data.chosendate1.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
				$scope.startTime1 =   "11:00:00";
				$scope.endTime1 =   "22:00:00";
				$scope.dat = new Date($scope.startDate1+'T'+$scope.startTime1);
				$scope.dat1 = new Date($scope.startDate1+'T'+$scope.endTime1);

				$scope.data.endTime = new Date($scope.dat1);
				$scope.data.startTime = new Date($scope.dat);
			}
		if ($scope.data.chosendate1< new Date())
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
				console.log($scope.data);

				 AuthService.editEventUser($scope.data)
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

.controller('AddEventCtrl', function($scope, $rootScope, $http, $stateParams,$ionicLoading, AuthService, $state) {
	console.log($stateParams.obj);
	console.log($rootScope.me);
	$scope.data=[];
	$scope.data.token = $rootScope.me['0'].token;
	$scope.data.userId = $rootScope.me['0'].userId;
	console.log($scope.tok);
	console.log($scope.userID);
	
	$scope.event = '';
	$scope.data.chosendate = new Date($stateParams.obj);
	
	$scope.difference = new Date().getTimezoneOffset();
	
	$scope.difference = $scope.difference/60;
	console.log($scope.difference);
	$scope.addtask= function(data)
	{
		$scope.error = false;
		console.log(data);
		if ($scope.data.chosendate.getMonth()<9)
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
				console.log($scope.data);
				$scope.hourss = $scope.data.starttime.getUTCHours()+$scope.difference;
				console.log($scope.hourss);
				if ($scope.hourss<10)
					{
						$scope.starthour = '0'+ $scope.hourss;
					}
				else
					{
						$scope.starthour = $scope.hourss;
					}
				if ($scope.data.starttime.getUTCMinutes()<10)
					{
						$scope.startmin = '0'+$scope.data.starttime.getUTCMinutes();
					}
				else
					
					{
						$scope.startmin = $scope.data.starttime.getUTCMinutes();
					}
					$scope.endhourss = $scope.data.endtime.getUTCHours()+$scope.difference;
				
				if ($scope.endhourss<10)
					{
						$scope.endhour = '0'+ $scope.endhourss;
					}
				else
					{
						$scope.endhour = $scope.endhourss;
					}
				if ($scope.data.endtime.getUTCMinutes()<10)
					{
						$scope.endmin = '0'+$scope.data.endtime.getUTCMinutes();
					}
				else
					
					{
						$scope.endmin = $scope.data.endtime.getUTCMinutes();
					}
					
				$scope.startDate1 = $scope.data.chosendate.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
				console.log($scope.starthour);
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
				$scope.startDate1 = $scope.data.chosendate.getUTCFullYear()+'-'+($scope.month)+'-'+$scope.date;
				$scope.startTime1 =   "11:00:00";
				$scope.endTime1 =   "22:00:00";
				$scope.dat = new Date($scope.startDate1+'T'+$scope.startTime1);
				$scope.dat1 = new Date($scope.startDate1+'T'+$scope.endTime1);

				$scope.data.endTime = new Date($scope.dat1);
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
				console.log(data);
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

$scope.changepic = function()
{
	navigator.camera.getPicture(uploadPhoto, function(message) {
 alert('get picture failed');
 }, {
 quality: 100,
 destinationType: navigator.camera.DestinationType.FILE_URI,
 sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
 });
}

function uploadPhoto(imageURI) {
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
 options.mimeType = "image/jpeg";
 console.log(options.fileName);
 var params = new Object();
 params.value1 = "test";
 params.value2 = "param";
 options.params = params;
 options.chunkedMode = false;

var ft = new FileTransfer();
 ft.upload(imageURI, "http://moshfitness.london/diary/imageupload.php", function(result){
 console.log(JSON.stringify(result));
$scope.linke ="http://moshfitness.london/diary/uploaduserpicture.php?userPic="+result.data.image+"&token="+$rootScope.me['0'].token;
$http.get($scope.linke).then(function (response) {
	  
	 setTimeout(function(){
       $ionicLoading.show({
      template: 'Profile Picture is changed'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },3000);	
	  });


 }, function(error){
 console.log(JSON.stringify(error));
 }, options);
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




