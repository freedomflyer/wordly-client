var wordlyDropdown = angular.module("wordlyDropdown", []);

wordlyDropdown.controller("DropdownCtrl", function($scope, $http) {
	$scope.showWords = true;

	$scope.highlightControl = function() {
		if($scope.showWords) {
			// Get all words
			$http.get('http://local.wordly.com:3000/user/words').then(function(response) {

				// Send the words to the content script
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendRequest(tab.id, {
						'action': 'highlightText',
						'words':  _.without(response.data, "", " ")
					},
					function(res) {
						chrome.browserAction.setBadgeText({
							"text": "hihi"
						});
					});
				});
			});
		} else {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {
					'action': 'unHighlightText'
				},
				function(res) {
					console.log("Response from action in browser_action: " + res);
				});
			});
		}

		$scope.showWords = !($scope.showWords);
	}
});

wordlyDropdown.directive('wordviewer', function() {

  var link = function(scope, element, attrs) {
    scope.$watch("showWords", function(newValue, oldValue) {
    	if(scope.showWords)
			element.html("<button class='main-button'>" + chrome.i18n.getMessage("showWords") + "</button>");
		else
			element.html("<button class='main-button'>" + chrome.i18n.getMessage("hideWords") + "</button>");
    });
  };

  return {
    restrict : 'E',
    link : link
  }
});



