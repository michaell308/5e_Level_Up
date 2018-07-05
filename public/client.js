console.log('Client-side code running');

$('.classButton').click(function(e) {
	//update hidden class input when any class button is clicked 
	document.getElementById('classInput').value = this.value;
});

$('#client-form').on('submit', function (event) {
    event.preventDefault(); //prevent form from refreshing page
    document.getElementById("output").textContent = "Class:" + document.getElementById('classInput').value;
    
    var data = {};
	data.title = "title";
	data.message = "message";
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/',						
        success: function(data) { //on successful post, data contains anything sent back from server
            console.log('success');
            console.log(JSON.stringify(data));
        }
    });
});