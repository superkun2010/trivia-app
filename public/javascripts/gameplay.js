


$('#play-button').on('click', function (event) {
	var category = $('#category').val();
	var numOfQuestions = $('#num-of-questions').val();
	console.log(numOfQuestions);
	event.preventDefault();
	$.ajax({
		url: '/api/questionset/' + category + '/' + numOfQuestions,
		method: 'GET',
		success: function (data) {
			// $.ajax({
			// 	url:'/game/play',
			// 	method: 'GET',
			// })
		},
		error: function (error) {
			console.log(error);
		}
	}).then(function(data) {
		console.log('two', data);
	})
})