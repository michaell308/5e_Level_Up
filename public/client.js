console.log('Client-side code running');

$('.classButton').click(function(e) {
	//update hidden class input when any class button is clicked 
	document.getElementById('classInput').value = this.value;
});

$('#client-form').on('submit', function (event) {
    event.preventDefault(); //prevent form from refreshing page
    var classInput = document.getElementById('classInput').value;
    var levelInput = document.getElementById('levelInput').value;
    document.getElementById("output").textContent = "Level:" + levelInput + " Class:" + classInput;
    
    var data = {};
	data.level = levelInput;
	data.class = classInput;
	
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