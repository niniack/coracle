var maxNodes = 20;
var maxTermination = 100000;
$(document).ready(function () {
  $("#lossSlider").slider({
  });
    $('#runSim').click(function () {
		//clear all validationErrors and results
		$('.validationError').remove();
		$('#SimResults').html('');
		if (validateSettings()){
			var oldButtonText = $('#runSim').html();
			$('#runSim').html('Running...');
			$('#runSim').attr("disabled", true)
			$.post( '/runSim',
			{
			nodes: parseInt($('#numNodes').val()),
			loss: parseFloat($("#lossSlider").val()),
			termination: parseInt($('#termination').val())
			}, 
			function(response){
				var result;
				if (response.error != null){
					console.log(response);
					result = "Failed: " + response.stderr;
				}
				else{
					result = createTable(JSON.parse(response.stdout));
				}
				$('#SimResults').html(result);
				$('#runSim').html(oldButtonText);
				$('#runSim').removeAttr("disabled");
			});
		}
    });
	
	function validationError(errorText){
		return "<label class='validationError'><font color='red'>" + 
			errorText +"</font></label>";
	}
	
	function validateSettings(){
		var valid = true;
		if (!checkBounds(parseInt($('#numNodes').val()),2,maxNodes)){
			$('#numNodes').after(validationError("Must be an integer between 2 and " + maxNodes));
			valid = false;
		}
		
		if (!checkBounds(parseFloat($("#lossSlider").val()),0,1)){
			$('#loss').after(validationError("Must be a number between 0 and 100"));
			valid = false;
		}
		
		if (!checkBounds(parseInt($('#termination').val()),1,maxTermination)){
			$('#loss').after(validationError("Must be an integer between 1 and " + maxTermination));
			valid = false;
		}
		return valid;
	}
	
	function checkBounds(value, min, max){
		return (!isNaN(value) && value >= min && value <=max);
	}
	
	function createTable(jsonObject){
		//start of html for the table
		var table = "<table id='results' border='1'>\
			<tr>";
		//add in the headers from the JSON variables
		for (var key in jsonObject){
			table += "<th>" + key + "</th>";
		}
		table += "</tr><tr>";
		
		//now add in the values, assumes no list values
		for (var key in jsonObject){
			table += "<td>" + jsonObject[key] + "</td>";
		}
		table += "</tr></table>";
		
		return table;
	}
});