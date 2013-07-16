//Runs in the background of the extension to do persistence, notifications, etc...
chrome.tabs.onActivated.addListener(function(info) {
	/*chrome.browserAction.setBadgeText({
		"text": info.tabId + ""
	});*/
/*
	$.ajax({url: "http://local.wordly.com:3000/user/words"}).done(function (response) {
		//alert	(response);
		var words = [];
		_.each(response, function(word) {
			words.push(word);
		});

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {
				'action': 'highlightText',
				'words': words
			},
			function(res) {
				chrome.browserAction.setBadgeText({
					"text": words.length + ""
				});
			});
		});

	});*/


});

 function onInstall() {
    console.log("Extension Installed");
    chrome.tabs.create({"url" : "http://local.wordly.com:3000/join?reference=extension", "selected" : true});
  }

  function onUpdate() {
    console.log("Extension Updated");
    alert("update");
  }

  function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
  }

  // Check if the version has changed.
  var currVersion = getVersion();
  var prevVersion = localStorage['version']
  if (currVersion != prevVersion) {
    // Check if we just installed this extension.
    if (typeof prevVersion == 'undefined') {
      onInstall();
    } else {
      onUpdate();
    }
    localStorage['version'] = currVersion;
  }

