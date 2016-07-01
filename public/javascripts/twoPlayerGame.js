
'use strict'

$(document).ready(function() {
    $('select').material_select();
});

$(function() {
  var socket = io();
  var gameSocket;
  var theGame = {};
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
		  		var challengeInfo = {};
		  		challengeInfo.socketId = $(event.target).val();
		  		challengeInfo.category = $('#category').val() || 'world capitals';
				challengeInfo.numQuest = $('#num-of-questions').val() || 5;
		  		socket.emit('challenge', challengeInfo);

		  	})
		  	$('#player-box').append(newPlayButtonDiv);
		}
	}
  })

  socket.on('challenger', function(gameInfo) {
  	console.log('challenger', gameInfo);
  	theGame = gameInfo;
  	// var challengerName = "'#" + gameInfo + "'";
  	// console.log("working", challengerName);
  	// $('*[data="' + gameInfo + '"]').remove();
 	// console.log(challengerButton);
 	var challengeText = "You have been challenged by " + gameInfo.userOne;
 	var challenger = $('<p>').addClass('valign').html(challengeText);
 	var challengerDiv = $('<div>').addClass('col m8 valign-wrapper');
 	challengerDiv.append(challenger);
 	$('#accept-challenge').append(challengerDiv);
 	var acceptButton = $('<a>').html("ACCEPT");
 	acceptButton.attr({class:"btn waves-effect waves-light red", type:"submit", name:"action"});
 	acceptButton.on('click', function(event) {
 		event.preventDefault();
 		console.log('accept', theGame);
 		gameSocket = io(theGame.gameRoomId);
 		socket.emit('accept-challenge', theGame);
 		socket.disconnect();
 	})
 	var acceptButtonDiv = $('<div>').addClass('valign');
 	var valignDiv = $('<div>').addClass('col m4 valign-wrapper');
 	acceptButtonDiv.append(acceptButton);
 	valignDiv.append(acceptButtonDiv);
 	$('#accept-challenge').append(valignDiv);
  })

  socket.on('game-start', function(path) {
 
  })
});