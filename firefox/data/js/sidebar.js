var current = "#mainMenu";
var previous = "#mainMenu";
var targetPassStrength;
const veryWeakPassword = Math.pow(10, 8);
const weakPassword = Math.pow(36, 8);
const strongPassword = Math.pow(62, 8);
const veryStrongPassword = Math.pow(96, 8);

//Allows navigation to the create password screen
$("#createButton").click(function() {
	$("#mainMenu").hide();
	$("#questions").show();
	previous = current;
	current = "#questions";
});

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

//Shows the dynamically generated advice based on the user's questions
$("#questionsButton").click(function() {
	generateAdvice();
	$(current).hide();
	$("#advice").show();
	previous = current;
	current = "#advice";
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
	var calculated = calculateStrength();
		
	updateProgress((calculated/targetKeySpace) * 100);
});

function updateProgress(percent)
{
	if (percent>100)
		$("#progress-bar").attr("style","width: "+100+"%");
	else
		$("#progress-bar").attr("style","width: "+percent+"%");
	if (percent<25)
		$("#progress-bar").attr("class","progress-bar progress-bar-danger");
	else if (percent<50)
		$("#progress-bar").attr("class","progress-bar progress-bar-warning");
	else if (percent<75)
		$("#progress-bar").attr("class","progress-bar progress-bar-success");
	else
		$("#progress-bar").attr("class","progress-bar progress-bar-great-success");
}

function calculateStrength()
{
	var chr;
	var hasLetter = 0;
	var hasNumber = 0;
	var hasSymbol = 0;
	var hasUpper = 0;
	for (var i=0; i<$( "#inputPassword" ).val().length; i++)
	{
		chr = $( "#inputPassword" ).val().charAt(i);
		if (isUpperCase(chr))
			hasUpper = 1;
		else if (isLetter(chr))
			hasLetter = 1;
		else if (isNumber(chr))
			hasNumber = 1;
		else if (isSymbol(chr))
			hasSymbol = 1;
	}
	updateAdvice($( "#inputPassword" ).val().length, hasNumber, hasLetter, hasUpper, hasSymbol);
	return Math.pow((hasLetter * 26) + (hasUpper * 26) + (hasNumber * 10) + (hasSymbol * 34),$( "#inputPassword" ).val().length);
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
		$(adviceArray[1]).attr('class', 'text-success');
	else
		$(adviceArray[1]).attr('class', '');
	if (hasUpper==1 && adviceArray.length>=4)
		$(adviceArray[1]).attr('class', 'text-success');
	else
		$(adviceArray[1]).attr('class', '');
	if (hasSymbol==1 && adviceArray.length>=5)
		$(adviceArray[1]).attr('class', 'text-success');
	else
		$(adviceArray[1]).attr('class', '');
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
	passwordAdvice.push("Use a phrase as the passwords source");
	passwordAdvice.push("Write down a cryptic clue that will allow you to remember the password");
	passwordAdvice.push("Use a password similar to one of your existing passwords");
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