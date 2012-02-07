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

		// Set message variables
		if (detectedStyle == 'soft') {
			var messageTitle = 'Connection Error';
			var messageText = 'Unfortunately, we were unable to connect to Plymouth\'s servers';
		}
		else {
			var messageTitle = 'Connection Error';
			var messageText = 'There is no internet connection at this time';
		}

		// Notify the user that they're offline
		navigator.notification.confirm(
			messageText,	// Message text
			function (choiceIndex) {
				console.log(choiceIndex);
			},
			messageTitle,
			'Try Again,Exit'
		);
	}

	// Function to check connection by making an AJAX request to the webapp and checking for a response
	function checkConnection() {
		// Create an AJAX request
		var testRequest = $.ajax({
			url:		appURL,
			type:	'HEAD',
			timeout:	800,
			async:	true,
			cache:	false
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
	$(document).on('deviceready', function () {
		// Get the network's state
		try { // Use a try, in case we're testing on a desktop browser that this object doesn't exist on
			var networkState = navigator.network.connection.type;
		}
		catch (e) {
			console.log(e);
		}
		finally {
			// Let's set some testing variables
			var networkState = true;
		}

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
