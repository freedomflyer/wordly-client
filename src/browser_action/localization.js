// This script will inject the appropriate localization messages into HTML elements 
// that otherwise weren't accessible by inline JavaScript
$(document).ready(function() {
	$("#loc-log-in").text(chrome.i18n.getMessage("login"));
});