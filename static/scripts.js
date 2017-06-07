var ol = $('ol');

function addMessage(message) {
	ol.append('<li>' + message + '</li>');
}

function sendMessage(message) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/viewReplies');
	xhr.send(message);
}

function fetchMessages() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === xhr.DONE) {
			var messages = JSON.parse(xhr.responseText);
			ol.empty();
			messages.forEach(addMessage);
		}
	};
	xhr.open('GET', '/viewReplies');
	xhr.send();
}

setInterval(fetchMessages, 1);
var input = $('input');

$('message_id').on('click', function(e) {
	e.preventDefault();
	if (input.val()) {
		addMessage(input.val());
		sendMessage(input.val());
		input.val('');
	}
});

// var section = $('section');
// section.fadeOut().fadeIn().slideUp().slideDown();



// // AJAX STARTING HERE
//
// // AJAX (Asynchronouse Javascript and XML) allows us to programatically send
// // HTTP requests to a backend server without reloading the page. We can perform
// // AJAX operations using the XMLHttpRequest API.
//
// // AJAX operations should be performed using an instance of the XMLHttpRequest
// // constructor (xhr in this case).
// var xhr = new XMLHttpRequest();
//
// // An XMLHttpRequest can be in different "ready states", which can be either
// // one of the following: UNSENT, OPENED, HEADERS_RECEIVED, LOADING, and DONE.
// // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
// // for an explanation on what each state means.
// //
// // Every time the xhr object changes from one ready state to another, it emits
// // the "readystatechange" event. We can listen to that event (using any of the
// // many ways of listening for events).
// xhr.onreadystatechange = function() {
//     // Most of the time we're only interested in the server's response to our
//     // AJAX request, so it's common to see the following if statement in the
//     // "readystatechange" event handler. It checks if the ready state is
//     // already DONE, which means that we've already received the response from
//     // the server.
// 	if (xhr.readyState === xhr.DONE) {
// 		// The server response can be obtained via "xhr.responseText", and from
//         // here we can use it however we want.
//         console.log(xhr.responseText);
// 	}
// };
//
// // .open() initializes an HTTP request to a given url. We give it the HTTP
// // method that will be used for the request, as well as the url that will be
// // requested. Note that this does not send the HTTP request yet. It just
// // prepares it for sending later.
// xhr.open('GET', 'http://localhost:3000/');
//
// // .send() is the one that actually sends the request to the server.
// xhr.send();






// $.get("/viewReplies", function(string) {
//     console.log(string);
// })

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
		document.getElementById("categoryDropdown").classList.toggle("show");
}

function filterFunction() {
		var input, filter, ul, li, a, i;

		filter = input.value.toUpperCase();
		div = document.getElementById("categoryDropdown");
		button = div.getElementsByTagName("button");
		for (i = 0; i < button.length; i++) {
				if (button[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
						button[i].style.display = "";
				} else {
						button[i].style.display = "none";
				}
		}
}
