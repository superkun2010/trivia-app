

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
		  	var newPlayButton = $('<a>').html("PLAY");
		  	newPlayButton.attr({class:"btn waves-effect waves-light blue", type:"submit", name:"action"});
		  	var newPlayButtonDiv = $('<div>').addClass('input-field col m6 players');
		  	newPlayButtonDiv.append(newPlayButton);
		  	$('#player-box').append(newPlayButtonDiv);
		}
	}
  })

});