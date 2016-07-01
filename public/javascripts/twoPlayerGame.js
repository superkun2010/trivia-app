

$(document).ready(function() {
    $('select').material_select();
});

$(function() {
  var socket = io();
  
  socket.emit('enter-room');

  socket.on('attendance', function(players) {
  	console.log(players);
  	console.log($('#theUser').html());
  	$('.players').remove();
  	for (var i = 0; i < players.length; i++) {
	  	if ($('#theUser').html() !== players[i].username) {
		  	var newPlayer = $('<h5>').html(players[i].username);
		  	var newPlayerDiv = $('<div>').addClass('col m6 players');
		  	newPlayerDiv.append(newPlayer);
		  	$('#player-box').append(newPlayerDiv);
		  	var newPlayButton = $('<button>').html("CHALLENGE");
		  	newPlayButton.val(players[i].socketId);
		  	newPlayButton.attr({class:"btn waves-effect waves-light blue", type:"submit", name:"action", data: players[i].username});
		  	var newPlayButtonDiv = $('<div>').addClass('input-field col m6 players');
		  	newPlayButtonDiv.append(newPlayButton);
		  	newPlayButtonDiv.on('click', function(event) {
		  		// console.log('check', $(event.target).val());
		  		event.preventDefault();
		  		var socketId = $(event.target).val()
		  		socket.emit('challenge', socketId);

		  	})
		  	$('#player-box').append(newPlayButtonDiv);
		}
	}
  })

  socket.on('challenger', function(challengerUserName) {
  	console.log('challenger', challengerUserName);
  	// var challengerName = "'#" + challengerUserName + "'";
  	// console.log("working", challengerName);
  	// $('*[data="' + challengerUserName + '"]').remove();
 	// console.log(challengerButton);
 	var challengeText = "You have been challenged by " + challengerUserName;
 	var challenger = $('<p>').addClass('valign').html(challengeText);
 	var challengerDiv = $('<div>').addClass('col m8 valign-wrapper');
 	challengerDiv.append(challenger);
 	$('#accept-challenge').append(challengerDiv);
 	var acceptButton = $('<a>').html("ACCEPT");
 	acceptButton.attr({class:"btn waves-effect waves-light red", type:"submit", name:"action"});
 	acceptButton.on('click', function(event) {
 		event.preventDefault();
 		socket.emit('accept-challenge', 'ACCEPT');
 	})
 	var acceptButtonDiv = $('<div>').addClass('valign');
 	var valignDiv = $('<div>').addClass('col m4 valign-wrapper');
 	acceptButtonDiv.append(acceptButton);
 	valignDiv.append(acceptButtonDiv);
 	$('#accept-challenge').append(valignDiv);
  })

  socket.on('game-start', function(path) {
  	var hrefVal = path;
  })
});