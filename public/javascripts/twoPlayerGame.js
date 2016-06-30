

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
		  	newPlayer.addClass('col m6 players');
		  	$('#player-box').append(newPlayer);
		}
	}
  })

});