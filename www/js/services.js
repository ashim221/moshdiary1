angular.module('starter.services', [])


.service('UserService', function($http, $httpParamSerializerJQLike, $q) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
   this.update = function(info){
	  console.log(info)
	  var deferred = $q.defer();
	$http({
    method: 'POST',
    url: 'http://moshfitness.london/diary/updateprofile.php',
    data: $httpParamSerializerJQLike({
	  "description":info.description,
      "fullname":info.fullname,
		"userId":info.userId
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		console.log(response);
		deferred.resolve(response);
		
	}
});
    return deferred.promise;
       };
  
  })
.service('NotificationService', function($q, $http, $httpParamSerializerJQLike, $cookies, $rootScope, $cookieStore, $cordovaFacebook, $ionicLoading, $state){

this.getNotifications = function(tok){
	console.log(tok);
	  var deferred = $q.defer();
	$http({
    method: 'POST',
    url: 'http://moshfitness.london/diary/getnotifications.php',
    data: $httpParamSerializerJQLike({
	  "token":tok
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		console.log(response);
		deferred.resolve(response);
		
	}
	else
	{
		console.log(response);
	}
});
    return deferred.promise;
       };



      

 this.declineUser = function(uid, tok){
	console.log(tok);
	console.log(uid);
	  var deferred = $q.defer();
	$http({
    method: 'POST',
    url: 'http://moshfitness.london/diary/declineuser.php',
    data: $httpParamSerializerJQLike({
	  "token":tok,
	  "userId":uid
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		window.localStorage.user = JSON.stringify(response.data);
		$rootScope.me =  JSON.parse(window.localStorage.user);
		console.log($rootScope.me);
		deferred.resolve(response);
		
	}
	else
	{
		console.log(response);
	}
});
    return deferred.promise;
       };


       this.acceptUser = function(uid, tok){
	console.log(tok);
	console.log(uid);
	  var deferred = $q.defer();
	$http({
    method: 'POST',
    url: 'http://moshfitness.london/diary/acceptuser.php',
    data: $httpParamSerializerJQLike({
	  "token":tok,
	  "userId":uid
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		window.localStorage.user = JSON.stringify(response.data);
		$rootScope.me =  JSON.parse(window.localStorage.user);
		console.log($rootScope.me);
		deferred.resolve(response);
		
	}
	else
	{
		console.log(response);
	}
});
    return deferred.promise;
       };




})

  
  
.service('AuthService', function($q, $http, $httpParamSerializerJQLike, $cookies, $rootScope, $cookieStore, $cordovaFacebook, $ionicLoading, $state){
	
	var auth={
		data:{
			username:null,
			password:null,
			token:null,
			header:{},
			accessObj:{},
			user:{}
		}
	};
	
	  
  this.getUser1=function(){
    return JSON.parse(window.localStorage.user1 || '{}');
  };
  
 

  this.doSignup = function(user){
    var deferred = $q.defer();
    console.log(user);
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/register_users.php',
  data: $httpParamSerializerJQLike({
	  "name":user.name,
      "email":user.email,
      "password":user.password,
      "location":user.location
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
  
   
this.doAddUser = function(user, token){
    var deferred = $q.defer();
    console.log(user);
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/adminregister_users.php',
  data: $httpParamSerializerJQLike({
	  "name":user.name,
      "email":user.email,
      "password":user.password,
      "location":user.location,
      "token":token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };


  this.findUser= function(result){
    var deferred = $q.defer();
	var tok = window.localStorage.getItem('token');
	$http({
  method: 'GET',
  url: 'http://moshfitness.london/diary/user_profile.php?userId='+result,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		window.localStorage.user2_twitter=JSON.stringify(response.record['0'].twitterId);
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
  
  
  this.userIsLoggedIn = function(){
	  
    var deferred = $q.defer(),
        authService = this,
		tok = window.localStorage.getItem('token');
	  console.log(tok);
		if (!tok)
		{
			isLoggedIn = false;
			console.log('false');
		}
		else
		{
        isLoggedIn = (authService.getUser(tok) !== null);
		}
    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };
this.getUser = function(token){
    var deferred = $q.defer();
	console.log(token);
	if (token===null)
	{
	}
	else
	{
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/auth.php',
  data: $httpParamSerializerJQLike({
	  "token":token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		auth.data.user = response.data;
		window.localStorage.user = JSON.stringify(auth.data.user);
		$rootScope.me =  JSON.parse(window.localStorage.user);
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
	}
  };
    
this.doLogin = function(user){
	console.log(user);
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/authorise_users.php',
  data: $httpParamSerializerJQLike({
      "email":user.email,
      "password":user.password
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		console.log(response);
	if (!response.errors)
	{
		auth.data.header = {headers: {'token': response.data.token}};
		$cookies.put("token", response.data.token, 365);
		auth.data.user = response.data;
		window.localStorage.setItem('token', response.data.token);
		window.localStorage.user = JSON.stringify(auth.data.user);
		$rootScope.me =  JSON.parse(window.localStorage.user);
		console.log (auth.data.user);
		deferred.resolve(response.data);
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
	
	
this.addEventUser = function(data){
	console.log(data);
	var q = data;
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/addeventsuser.php',
  data: $httpParamSerializerJQLike({
      "token":q.token,
      "chosendate":q.chosendate,
	  "starttime":q.startTime,
	  "endtime":q.endTime,
	  "eventname":q.eventname,
	  "eventdescription":q.eventdescription,
	  "allDay":q.all
	  
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		console.log(response);
	if (!response.errors)
	{
		setTimeout(function(){
       $ionicLoading.show({
      template: 'Task Added successfully'
    });
  },1000);
 setTimeout(function(){
	 $ionicLoading.hide();
  },5000);
		$state.go('home',{}, {reload:true});
      // success
	// window.localStorage.setItem('count', 1);
    
      
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };


this.addAdminEventUser = function(data){
	console.log(data.token);
	var q = data;
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/addadmineventsuser.php',
  data: $httpParamSerializerJQLike({
      "token":q.token,
      "chosendate":q.chosendate,
	  "starttime":q.startTime,
	  "endtime":q.endTime,
	  "eventname":q.eventname,
	  "eventdescription":q.eventdescription,
	  "allDay":q.all,
	  "userId":q.userId
	  
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		console.log(response);
	if (!response.errors)
	{
		setTimeout(function(){
       $ionicLoading.show({
      template: 'Task Added successfully'
    });
  },1000);
 setTimeout(function(){
	 $ionicLoading.hide();
  },5000);
		$state.go('usercalendar', {obj:q.user1});
      // success
	// window.localStorage.setItem('count', 1);
    
      
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };




this.editEventUser = function(data){
	console.log(data.user);
	var q = data;
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/editeventsuser.php',
  data: $httpParamSerializerJQLike({
      "token":q.token,
      "chosendate":q.chosendate1,
	  "starttime":q.startTime,
	  "endtime":q.endTime,
	  "eventname":q.eventname,
	  "eventdescription":q.eventdescription,
	  "eventId":q.eventId,
	  "allDay":q.all
	  
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		console.log(response);
	if (!response.errors)
	{
		setTimeout(function(){
       $ionicLoading.show({
      template: 'Task Edited successfully'
    });
  },100);
 setTimeout(function(){
	 $ionicLoading.hide();
  },3000);
 if (q.other===true)
 {
 	$state.go('usercalendar',{obj:q.user});
 }
 else
 {
		$state.go('home',{}, {reload:true});
		}
      // success
	// window.localStorage.setItem('count', 1);
    
      
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };

this.deleteEventUser = function(data){
	console.log(data.user);
	var q = data;
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/deleteeventsuser.php',
  data: $httpParamSerializerJQLike({
      "token":q.token,
	  "eventId":q.eventId
	  
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		console.log(response);
	if (!response.errors)
	{
		setTimeout(function(){
       $ionicLoading.show({
      template: 'Task Deleted successfully'
    });
  },50);
 setTimeout(function(){
	 $ionicLoading.hide();
  },3500);
 if (q.other===true)
 {
 	$state.go('usercalendar',{obj:q.user});
 }
 else
 {
		$state.go('home',{}, {reload:true});
		}
      // success
	// window.localStorage.setItem('count', 1);
    
      
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };

	

this.getEvents = function(token){
	console.log(token);
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/getuserevent.php',
  data: $httpParamSerializerJQLike({
      "token":token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
		
	if (!response.errors)
	{
		console.log(response.data);
		return response.data;
	}
	else
	{
		console.log(response);
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };	
	
	
   
	this.doLogout = function(token){
    var deferred = $q.defer();
	$http({
  method: 'POST',
  url: 'http://moshfitness.london/diary/logout.php',
  data: $httpParamSerializerJQLike({
      "token": token
  }),
  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
}).success(function (response) {
	if (!response.errors)
	{
		window.localStorage.clear();
		//window.localStorage.user = JSON.stringify();
		deferred.resolve(response.data);
	}
	else
	{
		var errors_list = [],
            error = {
              code: response.errors['0'].code,
              msg: response.errors['0'].message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
	}
});
    return deferred.promise;
  };
})
