// Make sure jQuery is loaded
(function($) {
	// Disable console.log on non-supporting browsers
	if (typeof console == "undefined") {
		window.console = {
			log: function () {}
		};
	}

	// Set the webapp URL as a variable
	var appURL = 'https://www.dev.plymouth.edu/webapp/psu-mobile/?phonegap&client-app-version=0.4.1';

	// Set the animation speed
	var animationSpeed = 700; // milliseconds

	// Function to handle when a user is offline
	function userOffline(detectedStyle) {
		// Set a default value
		detectedStyle = detectedStyle || 'hard';

		// Set message variables
		if (detectedStyle == 'soft') {
			var messageTitle = 'Connection Error';
			var messageText = 'Unable to connect to Plymouth\'s servers';
		}
		else {
			var messageTitle = 'Connection Error';
			var messageText = 'There is no internet connection at this time';
		}

		// Hide the loading message and show the error
		$('h1#loading-message').fadeOut(animationSpeed);
		$('h2#loading-error').text(messageText).fadeIn(animationSpeed);
	}

	// Function to check connection by making an AJAX request to the webapp and checking for a response
	function checkConnection() {
		// Hide the error and show the loading message
		$('h2#loading-error').fadeOut(animationSpeed);
		$('h1#loading-message').fadeIn(animationSpeed);

		// Create an AJAX request
		var testRequest = $.ajax({
			url:		appURL,
			type:	'HEAD',
			timeout:	3000, // Give it a reasonable amount of time to check the connection
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
	document.addEventListener('deviceready', function () { // Don't use a jQuery event listener here. PhoneGap will shit itself.
		console.log('DEVICEREADY event fired. PhoneGap has been initialized');

		// Get the network's state
		// Use a try, in case we're testing on a desktop browser that this object doesn't exist on. Or in case the feature hasn't been implemented in the client browser.
		try {
			var networkState = navigator.network.connection.type;
			var html5Check	= (navigator.hasOwnProperty('onLine') && navigator.onLine);
			var phonegapCheck = (networkState != Connection.UNKNOWN && networkState != Connection.NONE && networkState !== null); // Sometimes returns null when disconnected

			console.log(networkState);
			console.log(navigator.onLine);
			
			console.log('HTML5 OnLine: ' + html5Check);
			console.log('PhoneGap OnLine: ' + phonegapCheck);
		}
		catch (e) {
			console.log(e);
		}

		// If the user is offline
		if (!html5Check || !phonegapCheck) {
			console.log('User is offline');
			userOffline();
		}
		else {
			// Before we load the webapp, let's make SURE the user is online and can access the page.
			// We want the user to have a clean error if they can't access the webapp
			checkConnection();
		}

		// Let's listen for when the device has lost connection
		document.addEventListener('offline', function () {
			console.log('OFFLINE event fired. User is offline');
			userOffline();
		}, false);

		// Let's listen for when the device has come online
		document.addEventListener('online', function () {
			console.log('ONLINE event fired. User is online');
			checkConnection();
		}, false);

		// Let's listen for when the app has been resumed/focused
		document.addEventListener('resume', function () {
			console.log('RESUME event fired. App has been resumed');
			checkConnection();
		}, false);
	});

	// Show the loading message quickly
	$('h1#loading-message').fadeIn(animationSpeed);
})(jQuery);
