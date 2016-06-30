$(document).ready(function() {
    $('select').material_select();
});

$('#questionType').on('change', function(event) {
    if (this.selectedIndex === 0) {
        $('#bool-form').hide();
        $('#mult-form').hide();
    }
    if (this.selectedIndex === 1) {
        $('#bool-form').show();
        $('#mult-form').hide();
    }
    if (this.selectedIndex === 2) {
        $('#mult-form').show();
        $('#bool-form').hide();
    }
    event.preventDefault();
});
