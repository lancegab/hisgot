
function showDropdown() {
		document.getElementById("categoryDropdown").classList.toggle("show");
}

function showMessageField() {
		document.getElementById("messageField").classList.toggle("write");
}

var ol = $('ol[id="replyContainer"]');

function addMessage(message) {
	ol.append('<li class="comment"><h4>'
						+ message.content + '</h4><br><br>' + message.sender + '-' + message.createdAt
						+ '<form action="#" method = "get" id = "viewReplies">'
							+ '<input id = "parentMessage" type="hidden" name="message_id" value="' + message.id + '">'
							+ '<button>View replies</button>'
						+ '</form>'
						+ '<ol id="replyContainer"></ol>'
						+ '<button onclick="showMessageField()">Reply</button>'
						+ '<div class="write" id="messageField"><div class = "form">'
							+ '<form action="/reply" method = "post">'
							+ '<input type="hidden" name="message_id" value="' + message.id + '">'
							+ '<input type="text" name="content" placeholder="Write message" autofocus>'
							+ '<button type = "submit">Send</button>'
							+ '</form>'
						+ '</div></div>'
						+'</li>');
}

$('form[id="viewReplies"]').on('click', function(e) {
	e.preventDefault();
  var message_id = $('input[id="parentMessage"]').val();

	var data = {
		id : message_id
	};

	$.get('/currentMessage', data);

	showReplies(message_id);

});

function showReplies(message_id) {

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

		document.getElementById("replyContainer");
}

// function filterFunction() {
// 		var input, filter, ul, li, a, i;
//
// 		filter = input.value.toUpperCase();
// 		div = document.getElementById("categoryDropdown");
// 		button = div.getElementsByTagName("button");
// 		for (i = 0; i < button.length; i++) {
// 				if (button[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
// 						button[i].style.display = "";
// 				} else {
// 						button[i].style.display = "none";
// 				}
// 		}
// }
