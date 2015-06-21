// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $ionicModal) {
	$scope.tasks = [];

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
		$scope.activeProjevt.tasks.push({
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
	$timeout(function() {
		if($scope.projects.length == 0) {
			while(true) {
				var projectTitle = prompt('Your first project title:');
				if(projectTitle) {
					createProject(projectTitle);
					 break;
				}
			}
		}
	});

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
