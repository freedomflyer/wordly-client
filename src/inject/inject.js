$(document).ready(function() {
	
	//Inject Fonts
	var styleNode           = document.createElement ("style");
	styleNode.type          = "font/ttf";
	styleNode.textContent   = "@font-face { font-family: Roboto; src: url('"
	                        + chrome.extension.getURL ("../../fonts/Roboto/Roboto-Light.ttf")
	                        + "'); }"
	                        ;
	document.head.appendChild (styleNode);
	

	// Listener to handle messages passed from the extension to the content script
	function ListeningMethod(request, sender, callback)
	{
		if (request.action == 'highlightText') {
			highlightText(request.words);
		} else if(request.action == 'unHighlightText') {
			unHighlightText();
		}
		else {
			console.log("No action defined for listening method");
		}

		
		callback("Test Callback Value");
	}
	
	chrome.extension.onRequest.addListener(ListeningMethod);
	
	// Highlights all matched words on the current page from 
	// http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	var highlightText = function(words) {
		_.each(words, function(word){
			$('body').highlight(' ' + word + ' ');	
		})
	}

	// Credit: http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
	var unHighlightText = function() {
		$('body').removeHighlight();
	}

	// Clean up selected word a bit (remove spaces, check to see if it's valid)
	preDisplayPopup = function(event){
		var word = getSelectionText();
		word = word.replace(/^\s+/, '').replace(/\s+$/, '');

		if(!word || word === '') {
			console.log("no text to display");
			return null;
		} else {
			word = word.split(" ")[0];
			displayPopup(event, word);
		}	
	}


	function getPopupPlacement(event, popup) {
		console.log("height: " + $(popup).outerHeight(false) + " and width: " + $(popup).outerWidth(false));
		
		var placement = {};

		var winWidth = $(window).width();
		var winHeight = $(window).height();

		var popupWidth =  $(popup).outerWidth(false);
		var popupHeight = $(popup).outerHeight(false);

		var rightOfYAxis = event.x > (winWidth/2);
		var topOfXAxis = event.y < (winHeight/2);

		if(rightOfYAxis && topOfXAxis) {
			console.log("top right");
			console.log("inside func", $(document).scrollTop());
			placement.x = event.x - popupWidth;
			placement.y = event.y + $(document).scrollTop();
			placement.bottom = false;

			console.log("Quadrant 1");
		} else if(rightOfYAxis && !topOfXAxis) {

			placement.x = event.x - popupWidth;
			placement.y = event.y + $(document).scrollTop() - popupHeight;
			placement.bottom = true;

			console.log("Quadrant 4");
		} else if(!rightOfYAxis && topOfXAxis) {

			placement.x = event.x;
			placement.y = event.y + $(document).scrollTop();
			placement.bottom = false;

			console.log("Quadrant 2");
		} else {

			placement.x = event.x;
			placement.y = event.y + $(document).scrollTop() - popupHeight;

			placement.bottom = true;

			console.log("Quadrant 3");
		}
		return placement;
	}

	// Function to display popup, which is called when a word is double clicked.
	currentSentence = null;
	displayPopup = function(event, word) {
		

		// Create and position popup
		var popup = document.createElement('div');
		popup.id = "wordly-popup";
		popup.setAttribute("ng-app", "wordlyClientApp");
		popup.innerHTML = '<div ng-controller="PopupCtrl"><div ng-view></div></div>';

		
	
		// Bootstrap the popup with myApp. Applies Angular functionality
		angular.bootstrap(popup, ['wordlyClientApp']);

		// Get the popup's scope. Give it word + sentence, then update popup
		var popupCtrlElement = popup.firstChild;
		var $scope = angular.element(popupCtrlElement).scope();

		$scope.$apply(function() {
			$scope.word = word;

			if(currentSentence) {
				$scope.contextSentence = currentSentence.innerHTML;
			} else {
				$scope.contextSentence = null;
			}

			//$scope.getWordData();
		});

		// Add popup to page
		$("body").append(popup);

		var popupPlacement = getPopupPlacement(event, popup);

		popup.style.top = popupPlacement.y + "px";
		popup.style.left = popupPlacement.x + "px";
		

		// Animate the popup upon creation.
		/*if(popupPlacement.bottom === true) {
			$("#wordly-popup").hide().slideDown(200);
		}
		else {
			$("#wordly-popup").hide().slideDown(200);
		}*/

	};

	// Remove popup if user clicks anywhere besides its box
	function removePopup(event) {
		var $popup = $('#wordly-popup');

	    if ($popup.length){
	       if (event.target.id == "wordly-popup" || $(event.target).parents("#wordly-popup").size()) { 
           		//console.log("Inside div");
	        } else { 
				$popup.slideUp(200, function(){
					$(this).remove();
				});
	        }
	    }
	};

	// Helper method to get clean text selections
	function getSelectionText() {
		var text = "";
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	};


	document.body.addEventListener('dblclick', preDisplayPopup);
	document.body.addEventListener('click', removePopup);
});