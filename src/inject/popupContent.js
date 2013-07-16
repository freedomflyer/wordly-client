popupContent = '<div ng-controller="PopupCtrl">';
	popupContent += '<div ng-view></div>';
	popupContent += '<popup></popup>';
    // Top Content
    popupContent += '<div id="top-content">';
    	// Word header + add word button + exit button
		popupContent += '<h1 id="word-header" style="float: left;">{{word}}</h1><div id="exit-button" style="float:right;" ng-click="removePopup()">✖</div><div style="clear: both;"></div>';
		// Syllable display
		popupContent += '<div id="syllable-main">';
			popupContent += '<span ng-repeat="syllable in syllables" class="syllable-element">';
				popupContent += '{{syllable.text}}';
			popupContent += '</span>';
		popupContent += '<div>';
		// Context sentence
		popupContent += '<p id="context-sentence" ng-show="contextSentence">{{contextSentence}}</p>';
    popupContent += '</div>';

    
    // Middle content
    popupContent += '<div id="middle-content">';
    		// List of definitions
    		popupContent += '<ol id="definitions">';
				popupContent += '<li class="pos-section" ng-repeat="posblock in sortedDefinitions">';
					popupContent += '<h2 class="definition-header">{{posblock.pos}}</h2>';
					popupContent += '<div class="definition" hoverColor ng-repeat="subdefinition in posblock.definitions">';
							popupContent += '<label class="def-label" for="{{$index}}-{{posblock.pos}}">';
								popupContent += '<input class="def-box" ng-change="setCheckedDefs()" ng-model="subdefinition.checked" type="checkbox" id="{{$index}}-{{posblock.pos}}" />';
								popupContent += '{{subdefinition.text}}';
							popupContent += '</label>';
						popupContent += '</div>';
				popupContent += '</li>';
			popupContent += '</ol>';
    popupContent += '</div>';

    
    // Bottom Content

    popupContent += '<select ng-show="!loggedIn" ng-model="selected" ng-options="stream.name for stream in wordStreams"></select>'
    popupContent += '<addbtn ng-show="!loggedIn"></addbtn>';
    popupContent += '<span ng-show="!loggedIn">Log In To Add Words </span><login ng-show="!loggedIn"></login>';

    popupContent += '<testTemplate></testTemplate>';
popupContent += '</div>';