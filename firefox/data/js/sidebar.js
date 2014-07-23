var current = "#mainMenu";
var previous = "#mainMenu";
var targetPassStrength;
const veryWeakPassword = Math.pow(10, 6);
const weakPassword = Math.pow(36, 8);
const strongPassword = Math.pow(62, 10);
const veryStrongPassword = Math.pow(95, 12);

//Navigation bar listeners

//Allows navigation back to the home page
$("#homeButton").click(function() {
	$(current).hide();
	$("#mainMenu").show();
	previous = current;
	current = "#mainMenu";
});

//Allows the user to step back by 1 in the navigation order
$("#previousButton").click(function() {
	$(current).hide();
	$(previous).show();
	var temp = previous
	previous = current;
	current = temp;
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


//Allows the password text to be toggled between hidden and clear text
$("#showPasswordButton").click(function() {
	$(document).ready(function() {
		if ($('#inputPassword').attr('type')=='password')
			$('#inputPassword').attr('type', 'text');
		else
			$('#inputPassword').attr('type', 'password');
	});
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
	
	if ($( "#advice" ).attr('style') != 'display:none;')
		updateAdvice($( "#inputPassword" ).val().length, hasNumber, hasLetter, hasUpper, hasSymbol);
	if ($( "#improveTable" ).attr('style') != 'display:none;')
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
		
	if (hasNumber==1 && adviceArray.length>=2)
		$(adviceArray[1]).attr('class', 'text-success');
	else
		$(adviceArray[1]).attr('class', '');
		
	if (hasLetter==1 && adviceArray.length>=3)
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
	//TODO
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
}

//A helper function which creates an array with all of the password advice related to
//password strength
function createStrengthAdvice(){
	var passwordAdvice = new Array();
	//Strength advice
	passwordAdvice.push("Be at least 8 characters long");
	passwordAdvice.push("Contain numbers");
	passwordAdvice.push("Contain lower case letters");
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
	passwordAdvice.push("Use a shorter password with a full mixture of characters (upper and lower case letters, numbers, symbols");
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