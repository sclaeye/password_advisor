var current = "#mainMenu";
var previous = "#mainMenu";
var targetPassStrength;
const veryWeakPassword = Math.pow(26, 6);
const weakPassword = Math.pow(36, 8);
const strongPassword = Math.pow(62, 10);
const veryStrongPassword = Math.pow(95, 12);

//Navigation bar listeners

//because of security can't interact with addon from page script
if (window.addon == undefined) {	//use as check to see if we're in the sidebar or in a tab
	$("#fullButton").hide();
	$("#minButton").hide();
}

//tab navigation
if (window.addon != undefined) {	//use as check to see if we're in the sidebar or in a tab
	addon.port.on("tabClosed", function() {
		$("#minButton").hide();
		$("#fullButton").show();
		});
}

//Allows navigation back to the home page
$("#homeButton").click(function() {
	$(current).hide();
	$("#mainMenu").show();
	previous = current;
	current = "#mainMenu";
	
	//reset password field and clear the password meter
	$("#inputPassword").val("");
	updateProgress(0);
});

//Allows the user to step back by 1 in the navigation order
$("#previousButton").click(function() {
	$(current).hide();
	$(previous).show();
	var temp = previous
	previous = current;
	current = temp;
});

//Allows the user to open the html page in a new tab
$("#fullButton").click(function() {
	if (window.addon !== undefined)
		window.addon.port.emit("goFull");
	
	$("#fullButton").hide();
	$("#minButton").show();
	
});

$("#minButton").click(function() {
	if (addon !== undefined)
		addon.port.emit("goMin");

	$("#fullButton").show();
	$("#minButton").hide();
	
});

//Main menu listeners

//main menu button listener to the create password screen
$("#createButton").click(function() {
	$("#mainMenu").hide();
	$("#questions").show();
	$("#improveTable").hide();
	previous = current;
	current = "#questions";
});

//main menu button listener to load existing password screen.
$("#existAdviceButton").click(function() {
	$("#mainMenu").hide();
	$("#improvePass").show();
	$("#advice").hide();
	$("#improveTable").show();
	previous = current;
	current = "#improvePass";
});

//Shows the dynamically generated advice based on the user's questions
$("#questionsButton").click(function() {
	generateAdvice();
	$(current).hide();
	$("#improvePass").show();
	$("#advice").show();
	previous = current;
	current = "#improvePass";
});


//Detects a keypress from the password field
$( "#inputPassword" ).on('input', function() {
	var targetKeySpace;
	
	switch(targetPassStrength) {
		case 1:
			targetKeySpace = veryStrongPassword;
			break;
		case 2:
			targetKeySpace = strongPassword;
			break;
		case 3:
			targetKeySpace = weakPassword;
			break;
		case 4:
			targetKeySpace = veryWeakPassword;
			break;
	}
	
	//avoid continuing the calculation once the target has been reached		
	updateProgress(calculateStrength());
});

function updateProgress(calculated)
{
	var labelValue = 'Very Weak';
	if ((calculated/veryWeakPassword) <= 1)		//is the password very weak?
	{
		$("#progress-bar-danger").attr("style","width: "+Math.ceil((((calculated/veryWeakPassword)*100)/4))+"%");
		labelValue='Very Weak';
	} else if ((calculated/veryWeakPassword)  > 1){
		$("#progress-bar-danger").attr("style","width: "+25+"%");
	}  
	if ((calculated/weakPassword) <= 1 && (calculated/veryWeakPassword) > 1)		//is the password weak?
	{
		$("#progress-bar-warning").attr("style","width: "+Math.ceil((((calculated/weakPassword)*100)/4))+"%");
		labelValue='Weak';
	} else if ((calculated/weakPassword)  > 1){
		$("#progress-bar-warning").attr("style","width: "+25+"%");
	} else {
		$("#progress-bar-warning").attr("style","width: "+0+"%");
	}
	if ((calculated/strongPassword) <= 1 && (calculated/weakPassword) > 1)		//is the password strong?
	{
		$("#progress-bar-success").attr("style","width: "+Math.ceil((((calculated/strongPassword)*100)/4))+"%");
		labelValue='Strong';
	} else if ((calculated/strongPassword) > 1){
		$("#progress-bar-success").attr("style","width: "+25+"%");
	} else {
		$("#progress-bar-success").attr("style","width: "+0+"%");
	}
	if ((calculated/veryStrongPassword) <= 1 && (calculated/strongPassword) > 1)		//is the password very strong?
	{
		$("#progress-bar-great-success").attr("style","width: "+Math.ceil((((calculated/veryStrongPassword)*100)/4))+"%");
		labelValue='Very Strong';
	} else if ((calculated/veryStrongPassword) > 1){
		$("#progress-bar-great-success").attr("style","width: "+25+"%");
		labelValue='Very Strong';
	} else {
		$("#progress-bar-great-success").attr("style","width: "+0+"%");
	}
	$("#progress-label").html('The password is: '+labelValue);
}

function calculateStrength()
{
	var chr;
	var hasLetter = 0;
	var letterCount =0;
	var hasNumber = 0;
	var numberCount =0;
	var hasSymbol = 0;
	var symbolCount =0;
	var hasUpper = 0;
	var upperCount=0;
	for (var i=0; i<$( "#inputPassword" ).val().length; i++)
	{
		chr = $( "#inputPassword" ).val().charAt(i);
		if (isUpperCase(chr)) {
			hasUpper = 1;
			upperCount++;
		} else if (isLetter(chr)) {
			hasLetter = 1;
			letterCount++;
		} else if (isNumber(chr)) {
			hasNumber = 1;
			numberCount++;
		} else if (isSymbol(chr)) {
			hasSymbol = 1;
			symbolCount++;
		}
	}
	
	if ($( "#advice" ).attr('style') != 'display: none;')
		updateAdvice($( "#inputPassword" ).val().length, hasNumber, hasLetter, hasUpper, hasSymbol);
	if ($( "#improveTable" ).attr('style') != 'display: none;')
		updateTable($( "#inputPassword" ).val().length, numberCount, letterCount, upperCount, symbolCount);
	
	return Math.pow((hasLetter * 26) + (hasUpper * 26) + (hasNumber * 10) + (hasSymbol * 33),$( "#inputPassword" ).val().length);
}

//Color codes the dynamically generated advice based on what attributes the new password incorporates
function updateAdvice(passLength, hasNumber, hasLetter, hasUpper, hasSymbol) {
	var is8char=0;
	if (passLength>=8)
		is8char=1;

	var adviceArray = $( "#strengthList" ).children();
	if (is8char==1)
		$(adviceArray[0]).attr('class', 'text-success');
	else
		$(adviceArray[0]).attr('class', '');
		
	if (hasLetter==1 && adviceArray.length>=2)
		$(adviceArray[1]).attr('class', 'text-success');
	else
		$(adviceArray[1]).attr('class', '');
		
	if (hasNumber==1 && adviceArray.length>=3)
		$(adviceArray[2]).attr('class', 'text-success');
	else
		$(adviceArray[2]).attr('class', '');
		
	if (hasUpper==1 && adviceArray.length>=4)
		$(adviceArray[3]).attr('class', 'text-success');
	else
		$(adviceArray[3]).attr('class', '');
		
	if (hasSymbol==1 && adviceArray.length>=5)
		$(adviceArray[4]).attr('class', 'text-success');
	else
		$(adviceArray[4]).attr('class', '');
}

function updateTable(passLength, numberCount, letterCount, upperCount, symbolCount){	
	//Password strength properties
	//Values
	$("#table-hasLength").empty();
	$("#table-hasLength").append(passLength);
	
	$("#table-hasNum").empty();
	$("#table-hasNum").append(numberCount);

	$("#table-hasLetter").empty();
	$("#table-hasLetter").append(letterCount);
	
	$("#table-hasUpper").empty();
	$("#table-hasUpper").append(upperCount);
	
	$("#table-hasSpec").empty();
	$("#table-hasSpec").append(symbolCount);
	
	//Comments
	updateComments(passLength, numberCount, letterCount, upperCount, symbolCount)
	
	//Password Choice properties
	
	updateTableTimeToCrack(passLength, numberCount, letterCount, upperCount, symbolCount);
}

function updateComments(passLength, numberCount, letterCount, upperCount, symbolCount){
	if (passLength<8) {
		$("#table-lengthComments").empty();
		$("#table-lengthComments").append("Aim for a password that is at least 8 characters long!");
		$("#table-lengthComments").attr('class', 'text-danger');
	} else {
		$("#table-lengthComments").empty();
		$("#table-lengthComments").append("More than 8 characters long.");
		$("#table-lengthComments").attr('class', 'text-success');
	}
	
	if (numberCount>0) {
		$("#table-numComment").empty();
		$("#table-numComment").append("Contains at least 1 digit");
		$("#table-numComment").attr('class', 'text-success');
	} else {
		$("#table-numComment").empty();
		$("#table-numComment").append("Should contain at least 1 digit!");
		$("#table-numComment").attr('class', 'text-danger');
	}
	
	if (letterCount>0) {
		$("#table-letterComment").empty();
		$("#table-letterComment").append("Contains at least 1 lower case letter");
		$("#table-letterComment").attr('class', 'text-success');
	} else {
		$("#table-letterComment").empty();
		$("#table-letterComment").append("Should contain at least 1 lower case letter!");
		$("#table-letterComment").attr('class', 'text-danger');
	}
	
	if (upperCount>0) {
		$("#table-upperComment").empty();
		$("#table-upperComment").append("Contains at least 1 upper case letter");
		$("#table-upperComment").attr('class', 'text-success');
	} else {
		$("#table-upperComment").empty();
		$("#table-upperComment").append("Should contain at least 1 upper case letter!");
		$("#table-upperComment").attr('class', 'text-danger');
	}

	if (symbolCount>0) {
		$("#table-specComment").empty();
		$("#table-specComment").append("Contains at least 1 special case letter");
		$("#table-specComment").attr('class', 'text-success');
	} else {
		$("#table-specComment").empty();
		$("#table-specComment").append("Should contain at least 1 special case letter!");
		$("#table-specComment").attr('class', 'text-danger');
	}
}

function updateTableTimeToCrack(passLength, numberCount, letterCount, upperCount, symbolCount) {
	//Time Taken to Crack Using Brute Force
	var hasNumber = 0;
	var hasLetter = 0;
	var hasUpper = 0;
	var hasSymbol = 0;
	
	if (numberCount>0)
		hasNumber = 1;
	if (letterCount>0)
		hasLetter =1;
	if (upperCount>0)
		hasUpper =1;
	if (symbolCount>0)
		hasSymbol=1;
	
	var passKeySpace = Math.pow(((hasLetter * 26) + (hasUpper * 26) + (hasNumber * 10) + (hasSymbol * 33)), passLength);
	
	//calculated as instructions per second
	//standard 2.0GHz, 1 core
	//fast 3.7Ghz, 4 cores
	
	var standardPc = passKeySpace/2000000000; //time needed in seconds
	var fastPc = passKeySpace/(4*(3700000000));
	
	$("#table-bruteStandard").empty();
	$("#table-bruteStandard").append(getTimeLong(standardPc));
	
	$("#table-bruteFast").empty();
	$("#table-bruteFast").append(getTimeLong(fastPc));
}

function getTimeLong(timeInSecs)
{
	var mins = timeInSecs/60;
	var hours = mins/60;
	var days = hours/24;
	var years = days/365;
	
	//Math.floor
	mins = Math.floor(mins);
	hours = Math.floor(hours);
	days = Math.floor(days);
	years = Math.floor(years);
	
	var time="";
	if (years>0)
		time = years.toFixed(0)+" years, ";
	if (days>0)
		time += (days%365).toFixed(0) + " days, ";
	if (hours>0)
		time += (hours%24).toFixed(0) + " hours, ";
	if (mins>0)
		time += (mins%60).toFixed(0) + " minutes, ";
	if ((timeInSecs%60)<1)
		time += " <1 second ";
	else
		time += (timeInSecs%60).toFixed(2) + " seconds";
	
	return time;
}

function isLetter(chr){
	if(chr.match(/\D+/) && !isSymbol(chr))
		return true;
	else
		return false;
}

function isNumber(chr){
	if(chr.match(/\d+/))
		return true;
	else
		return false;
}

function isUpperCase(chr){
	if (chr == chr.toUpperCase() && !isSymbol(chr) && !isNumber(chr))
		return true;
	else
		return false;
}

function isSymbol(chr){
	if(chr.match(/\W+/))
		return true;
	else
		return false;
}

//A function to determine what advice to display
function generateAdvice(){
	var strengthAdvice = createStrengthAdvice();
	var memAdvice = createMemorabilityAdvice();
	var adviceMatrix = createAdviceMatrix();
	
	var dataVal = $('input[name="optionsRadios1"]:checked').val();
	var freqVal = $('input[name="optionsRadios2"]:checked').val();
	
	targetPassStrength = adviceMatrix[freqVal][dataVal];
	
	$('#adviceStrength').empty();
	$('#adviceStrength').append("<ul id='strengthList'></ul>");
    for (var i = 0; i < strengthAdvice.length-(targetPassStrength-1); i++) {
          $("#strengthList").append('<li>'+strengthAdvice[i]+'</li>');
    }
	
	$('#adviceMemorability').empty();
	$('#adviceMemorability').append("<ul id='memList'></ul>");
    for (var i = 0; i < memAdvice.length; i++) {
          $("#memList").append('<li>'+memAdvice[i]+'</li>');
    }
	
	//set what password strength we should aim for
	$("#aimFor").empty();
	switch(targetPassStrength) {
		case 1:	//Very strong
			$("#aimFor").append("Password strength to aim for: Very Strong");
			break;
		case 2:	//Strong
			$("#aimFor").append("Password strength to aim for: Strong");
			break;
		case 3:	//Weak
			$("#aimFor").append("Password strength to aim for: Very Weak");
			break;
		case 4:	//Very Weak
			$("#aimFor").append("Password strength to aim for: Weak");
			break;
	}
}

//A helper function which creates an array with all of the password advice related to
//password strength
function createStrengthAdvice(){
	var passwordAdvice = new Array();
	//Strength advice
	passwordAdvice.push("Be at least 8 characters long");
	passwordAdvice.push("Contain lower case letters");
	passwordAdvice.push("Contain numbers");
	passwordAdvice.push("Contain upper case letters");
	passwordAdvice.push("Contain symbols");
	return passwordAdvice;
}

//A helper function which creates an array with all of the password advice related to
//password memorability
function createMemorabilityAdvice(){
	var passwordAdvice = new Array();
	passwordAdvice.push("Use a phrase as the password's source");
	passwordAdvice.push("Write down a cryptic clue that will allow you to remember the password");
	passwordAdvice.push("Use a password similar to one of your existing passwords");
	passwordAdvice.push("Use a shorter password but use a full mixture of characters (upper and lower case letters, numbers, symbols.");
	return passwordAdvice;
}

//A helper function which creates an array of arrays which holds the advice matrix (see documentation)
function createAdviceMatrix(){
	var adviceMatrix = new Array();
	adviceMatrix.push(new Array());
	adviceMatrix.push(new Array());
	adviceMatrix.push(new Array());
	//very strong = 1, very weak =4;
	adviceMatrix[0][0]= 1;
 	adviceMatrix[0][1]= 1;
 	adviceMatrix[0][2]= 2;
	adviceMatrix[1][0]= 1;
 	adviceMatrix[1][1]= 2;
 	adviceMatrix[1][2]= 3;
	adviceMatrix[2][0]= 2;
 	adviceMatrix[2][1]= 3;
 	adviceMatrix[2][2]= 4;
	return adviceMatrix;
}