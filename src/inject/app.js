var wordlyClientApp = angular.module("wordlyClientApp", []).value('$anchorScroll', angular.noop);

wordlyClientApp.controller("PopupCtrl", function($scope, $http) {
	$scope.numCheckedDefs = 0;

	$scope.setCheckedDefs = function() {
		console.log($scope.selected);
		$scope.numCheckedDefs = _.where($scope.definitions, {checked: true}).length;
	}

	$scope.getSelectionText = function() {
		if (window.getSelection) {
			return window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			return document.selection.createRange().text;
		}
	};

	$scope.removePopup = function() {
		$("#wordly-popup").slideUp(200, function(){
			$(this).remove();
		});
	}

	$scope.word = $scope.getSelectionText();
	$scope.getWordData = function() {
		$scope.boxvals = [];

		if ($scope.word.length == 0) {
			$scope.definitions = null;
			$scope.partsOfSpeech = {};
		}

		// Get user's wordstreams
		var request = $http.get('http://local.wordly.com:3000/api/user/wordstream');
	    request.success(function(response) {
	      console.log(response);
	      $scope.wordStreams = response.wordStreams;
	      $scope.numWordstreams = $scope.wordStreams.length;

	      if ($scope.wordStreams.length) {
	        $scope.wordStream = $scope.wordStreams[0];
	      }
	    });

	    // Get words
		$http.get('http://localhost:3000/words/definitions/' + $scope.word).then(function(response) {

			$scope.definitions = response.data[0];
			$scope.syllables = response.data[1];
			
			$scope.partsOfSpeech = _.uniq(_.pluck(response.data[0], "partOfSpeech"));

			// Build sections of definitions divided by part of speech
			$scope.sortedDefinitions = [];
			_.each($scope.partsOfSpeech, function(pos) { 
			    var defs = _.where($scope.definitions, {partOfSpeech: pos});
			    $scope.sortedDefinitions.push({pos: pos, definitions: defs});
			});
		});

		$http.get('http://localhost:3000/user/loggedIn/').then(function(response) {

			console.log(response);
			$scope.loggedIn = response.loggedIn;

		});
	};

	// Send data from app to wordly server
	$scope.sendWordData = function() {
		
	}


});

wordlyClientApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, $routeParams) {

    $routeProvider.when('/',  {templateUrl: chrome.extension.getURL("/src/inject/testinject.html"), controller: 'PopupCtrl'});

    $locationProvider.html5Mode(false);

}]);


// Directive to change definition color on mouse hover
wordlyClientApp.directive("hovercolor", function() {
	return function(scope, element, attrs) {
		element.bind("mouseenter", function(data) {
			element.css("background-color", "#792067");
			element.css("color", "white");
			element.css("cursor", "pointer")
		});

		element.bind("mouseleave", function(data) {
			element.css("background-color", "transparent");
			element.css("color", "black");
		});
	};
});

wordlyClientApp.directive('popup', function() {
	
	var link = function() {
		console.log("link function in test template");
	}

	return {
		//templateUrl: chrome.extension.getURL("/src/inject/testinject.html"),
		restrict : 'E',
		link : link
	}
});

wordlyClientApp.directive('login', function($http) {
	
	var link = function(scope, element, attrs) {
		element.html("<a href='http://local.wordly.com:3000/login'><button class='main-button'>Login</button></a>");
	}

	return {
		restrict : 'E',
		link : link
	}
});

wordlyClientApp.directive('addbtn', function($http) {
  
  var link = function(scope, element, attrs) {
  	
  	element.bind('click', function(){
  		var checkedDefs = _.where(scope.definitions, {checked: true});

		var defArray = [];
		_.each(checkedDefs, function(def){
			defArray.push({"definition": def.text, "partOfSpeech": def.partOfSpeech});
		})

		var defsToSend = {
			"word": scope.word,
			"definitions": defArray,
			"urlSource": document.URL,
			"otherSource": "",
			"contextSentence": "testContextSentence"
		};

		// POST word data to sever
		$http({
	        url: 'http://local.wordly.com:3000/api/user/wordstream/' + scope.selected._id + '/words/add',
	        method: "POST",
	        data: defsToSend,
	        headers: {'Content-Type': 'application/json'}})
	        .success(function (data, status, headers, config) {
	            //alert("response received");
	            console.log(data);
	        }).error(function (data, status, headers, config) {
	            //alert("error! " + data);
	            console.log(data);
        });
  	});

    scope.$watch('numCheckedDefs', function(newValue, oldValue) {
      if(scope.numCheckedDefs >= 1) {
		element.html("<button class='main-button'>" + chrome.i18n.getMessage("addWord", scope.word) + " + " + scope.numCheckedDefs + " " + ((scope.numCheckedDefs == 1) ? chrome.i18n.getMessage("def") : chrome.i18n.getMessage("defs")) + "</button>");
      }
      else {
     	element.html("<button class='main-button'>" + chrome.i18n.getMessage("addWord", scope.word) + "</button>");	
      }
    });
};

  return {
    restrict : 'E',
    link : link
  }
});







