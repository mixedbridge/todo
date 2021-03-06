// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })  
            .state('todo', {
                url: '/todo',
                templateUrl: 'templates/todo.html',
                controller: 'TodoCtrl'
            }); 
        $urlRouterProvider.otherwise('/todo');
})

.factory('Projects', function() { 
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
			return {
        title: projectTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  }
})

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $location, $ionicSideMenuDelegate, $ionicViewService) { 

	window.localStorage.clear();
	if(window.localStorage.getItem("password") === "undefined" || window.localStorage.getItem("password") === null) {
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/login");
    }


	//	Create new project with given title
	var createProject = function(projectTitle) {
		var newProject = Projects.newProject(projectTitle);
		$scope.projects.push(newProject);
		Projects.save($scope.projects);
		$scope.selectProject(newProject, $scope.projects.length-1);
	}

	// Initialize projects
	$scope.projects = Projects.all();

	//	Select last active projectt
	$scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

	//	Create new project
	$scope.newProject = function() {
		var projectTitle = prompt('Project name');
		if(projectTitle) {
			createProject(projectTitle);
		}
	};

	//	Called to select the given project
	$scope.selectProject = function(project, index) {
		$scope.activeProject = project;
		Projects.setLastActiveIndex(index);
		$ionicSideMenuDelegate.toggleLeft(false);
	};

	// Create and load the Modal
	$ionicModal.fromTemplateUrl('new-task.html', function(modal) {
  	$scope.taskModal = modal;
  }, {
		scope: $scope,
    animation: 'slide-in-up'
	});

	//Called when form is submitted
	$scope.createTask = function(task) {
		if(!$scope.activeProject || !task) {
			return;
		}
		$scope.activeProject.tasks.push({
			title: task.title
		});
		$scope.taskModal.hide();

		//Apparently inefficient, to save all projects
		Projects.save($scope.projects);

		task.title = "";
	};

	//Open the new task modal
	$scope.newTask = function() {
		$scope.taskModal.show();
  };

	//Close the new task modal
	$scope.closeNewTask = function() {
		$scope.taskModal.hide();
	};

	$scope.toggleProjects = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	// Try to create the first project, using
	// $timeout to initialize everything properly
//	$timeout(function() {
//		if($scope.projects.length == 0) {
//			while(true) {
//				var projectTitle = prompt('Your first project title:');
//				if(projectTitle) {
//					createProject(projectTitle);
//					 break;
//				}
//			}
//		}
//	});

})

.controller('LoginController', function($scope, $location, $ionicViewService) {
    $scope.login = function(password) {
        window.localStorage.setItem("password", password);
        $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        $location.path("/todo");
    }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
