

$(document).ready(function() {
    $('select').material_select();
});

$(function() {
  var socket = io();
  
  socket.emit('enter-room');

  socket.on('entrance', function(user) {
  	console.log('THE TEST', user);
  	var newPlayer = $('<h5>').html(user);
  	$('#player-box').append(newPlayer);
  })

});