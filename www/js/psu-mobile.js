// Make sure jQuery is loaded
(function($) {
	// Disable console.log on non-supporting browsers
	if (typeof console == "undefined") {
		window.console = {
			log: function () {}
		};
	}

	// Set the webapp URL as a variable
	var appURL = 'https://www.dev.plymouth.edu/webapp/psu-mobile/';

	// Function to handle when a user is offline
	function userOffline(detectedStyle) {
		// Set a default value
		detectedStyle = detectedStyle || 'hard';

		// The user is offline, so let's redirect them to the offline page
		window.location.href = 'offline.html';
	}

	// Function to check connection by making an AJAX request to the webapp and checking for a response
	function checkConnection() {
		// Create an AJAX request
		var testRequest = $.ajax({
			url: appURL,
			cache: false
		});

		// If successful
		testRequest.done(function () {
			// If the connection checked out, let's load up the webapp
			window.location.href = appURL;
			console.log('success');
		});

		// If it fails
		testRequest.fail(function () {
			// If the connection failed, the user is (or might as well be) offline
			userOffline('soft');
		});

		// Regardless
		testRequest.always(function (jqXHR, textStatus) {
			console.log('Connection Check: ' + textStatus);
		});
	}

	// Let's listen for when PhoneGap has correctly loaded
	// THEN we'll run our PhoneGap dependent code
	document.addEventListener('deviceready', function () {
		// Get the network's state
		var networkState = navigator.network.connection.type;

		// If the user is offline
		if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
			userOffline();
		}
		else {
			// Before we load the webapp, let's make SURE the user is online and can access the page.
			// We want the user to have a clean error if they can't access the webapp
			checkConnection();
		}
	});

	// Show the loading message
	$('h1#loading-message').fadeIn(700);
})(jQuery);
