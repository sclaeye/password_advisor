var current = "#mainMenu";
var previous = "#mainMenu";
var targetPassStrength;
const veryWeakPassword = Math.pow(26, 6);
const weakPassword = Math.pow(36, 8);
const strongPassword = Math.pow(95, 8);
const veryStrongPassword = Math.pow(95, 12);
var dictionaries = new Array();
var filesLoaded = false;

var commonDict;
var commonLoaded = false;
var johnDict;
var johnLoaded = false;
var cainDict;
var cainLoaded = false;
var rockyouDict;
var rockyouLoaded = false;

var contentChart;
var timeChart;
var timeFastChart;

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

if (!filesLoaded)	//load dictionary attack files if not already loaded
	loadFiles();

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
	$("#improve").hide();
	previous = current;
	current = "#questions";
});

//main menu button listener to load existing password screen.
$("#existAdviceButton").click(function() {
	$("#mainMenu").hide();
	$("#improvePass").show();
	$("#advice").hide();
	$("#improve").show();
	$("#improveGraphs").hide();
	previous = current;
	current = "#improvePass";
});

//Shows the dynamically generated advice based on the user's questions
$("#questionsButton").click(function() {
	generateAdvice();
	$(current).hide();
	$("#improvePass").show();
	$("#advice").show();
	$("#improveGraphs").hide();
	previous = current;
	current = "#improvePass";
});

//Shows the improvement tables
$("#tablesTab").click(function() {
	$("#tablesTab").attr('class', 'active');
	$("#graphsTab").attr('class', '');
	$("#improveGraphs").hide();
	$("#improveTables").show();
	calculateStrength();
});

//Shows the improvement graphs
$("#graphsTab").click(function() {
	$("#graphsTab").attr('class', 'active');
	$("#tablesTab").attr('class', '');
	$("#improveTables").hide();
	$("#improveGraphs").show();
	initGraphs();
});

//Tooltips
$(".computerSpeedNormal").tooltip({
        placement : 'top',
		container: 'body',
		title:"A standard computer with a single core (2Ghz) processor"});
	
$(".computerSpeedFast").tooltip({
        placement : 'top',
		container: 'body',
		title:"A fast computer with a quad core(3.7Ghz each) processor"});
	
$(".attackTypeBrute").tooltip({
        placement : 'top',
		container: 'body',
		title:"A brute force attack requires the computer to try all character combinations"});

$(".attackTypeDictTop").tooltip({
        placement : 'top',
		container: 'body',
		title:"A dictionary containing the 10'000 most frequently used passwords"});

$(".attackTypeDictJohn").tooltip({
        placement : 'top',
		container: 'body',
		title:"A dictionary commonly used by password cracking software"});
		
$(".attackTypeDictCain").tooltip({
        placement : 'top',
		container: 'body',
		title:"A larger dictionary commonly used by password cracking software"});
		
$(".attackTypeDictRock").tooltip({
        placement : 'top',
		container: 'body',
		title:"A dictionary of passwords that have been leaked or stolen"});		
		
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
	var pass = $( "#inputPassword" ).val();

	var chr;
	var hasLetter = 0;
	var letterCount =0;
	var hasNumber = 0;
	var numberCount =0;
	var hasSymbol = 0;
	var symbolCount =0;
	var hasUpper = 0;
	var upperCount=0;
	for (var i=0; i<pass.length; i++)
	{
		chr = pass.charAt(i);
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
	if ($( "#improveTables" ).attr('style') != 'display: none;')
		updateTable($( "#inputPassword" ).val(), numberCount, letterCount, upperCount, symbolCount);
	if ($( "#improveGraphs" ).attr('style') != 'display: none;')
		updateGraphs(numberCount, letterCount, upperCount, symbolCount);
		
	
	
	//check if the password is in a dictionary, if it is the strength is equal to the size of the dictionary
	//start with smallest dict and then go to larger
	if (inDictionary(pass, johnDict)) {
		if ($( "#advice" ).attr('style') != 'display: none;')
			inDictionarySetText(true); 
		//john the ripper has 3107 words in its dictionary
		return 3107;
	} else if(inDictionary(pass, commonDict)) {
		if ($( "#advice" ).attr('style') != 'display: none;')
			inDictionarySetText(true); 
		//top 10'000 has 10'0000 words in its dictionary
		return 10000;
	} else if (inDictionary(pass, cainDict)) {
		if ($( "#advice" ).attr('style') != 'display: none;')
			inDictionarySetText(true); 
		//cain & abel has 306706 words in its dictionary
		return 306706;
	} else if (inDictionary(pass, rockyouDict)) {
		if ($( "#advice" ).attr('style') != 'display: none;')
			inDictionarySetText(true);
		//rock you has 14344383 words in its dictionary
		return 14344383;
	} else {
		if ($( "#advice" ).attr('style') != 'display: none;')
			inDictionarySetText(false);
	}
	
	//will only be invoked if the word is not in a dictionary
	return Math.pow((hasLetter * 26) + (hasUpper * 26) + (hasNumber * 10) + (hasSymbol * 33),$( "#inputPassword" ).val().length);
}

//helper function to add appropriate text to the inDictionary field
function inDictionarySetText(bool) {
	if (bool) {
		$("#inDictionary").attr('class', 'text-danger');
		$("#inDictionary").empty();
		$("#inDictionary").append("This password is vulnerable to a dictionary attack.");
	} else {
		$("#inDictionary").attr('class', 'text-success');
		$("#inDictionary").empty();
		$("#inDictionary").append("This password is not vulnerable to a dictionary attack.");
	
	}
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

function updateTable(pass, numberCount, letterCount, upperCount, symbolCount){	
	//Password strength properties
	//Values
	$("#table-hasLength").empty();
	$("#table-hasLength").append(pass.length);
	
	$("#table-hasNum").empty();
	$("#table-hasNum").append(numberCount);

	$("#table-hasLetter").empty();
	$("#table-hasLetter").append(letterCount);
	
	$("#table-hasUpper").empty();
	$("#table-hasUpper").append(upperCount);
	
	$("#table-hasSpec").empty();
	$("#table-hasSpec").append(symbolCount);
	
	//Comments
	updateComments(pass.length, numberCount, letterCount, upperCount, symbolCount)
	
	//Attack table
	updateTableBruteTimeToCrack(pass.length, numberCount, letterCount, upperCount, symbolCount);
	updateTableDictionaryAttacks();
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

function updateTableBruteTimeToCrack(passLength, numberCount, letterCount, upperCount, symbolCount) {
	var passKeySpace = calcKeySpace(passLength, numberCount, letterCount, upperCount, symbolCount);
	
	//calculated as instructions per second
	//standard 2.0GHz, 1 core
	//fast 3.7Ghz, 4 cores
	
	var standardPc = passKeySpace/2000000000; //time needed in seconds
	var fastPc = passKeySpace/(4*(3700000000));
	
	$("#table-bruteNormal").empty();
	$("#table-bruteNormal").append(getTimeLong(standardPc));
	if (standardPc<1)
		$("#table-rockNormal").attr('class', 'text-danger');
	else
		$("#table-rockNormal").attr('class', '');
	
	$("#table-bruteFast").empty();
	$("#table-bruteFast").append(getTimeLong(fastPc));
	if (fastPc<1)
		$("#table-rockNormal").attr('class', 'text-danger');
	else
		$("#table-rockNormal").attr('class', '');
}

function calcKeySpace(passLength, numberCount, letterCount, upperCount, symbolCount){
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
	
	return Math.pow(((hasLetter * 26) + (hasUpper * 26) + (hasNumber * 10) + (hasSymbol * 33)), passLength);
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
			$("#aimFor").append("Password strength to aim for: Weak");
			break;
		case 4:	//Very Weak
			$("#aimFor").append("Password strength to aim for: Very Weak");
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
	passwordAdvice.push("Alternatively, use a longer password consisting of only letters.");
	return passwordAdvice;
}

//A helper function which creates an array of arrays which holds the advice matrix (see documentation)
function createAdviceMatrix(){
	var adviceMatrix = new Array();
	adviceMatrix.push(new Array());	//col 1
	adviceMatrix.push(new Array()); //col 2
	adviceMatrix.push(new Array()); //col 3
	adviceMatrix.push(new Array()); //col 4
	adviceMatrix.push(new Array()); //col 5
	//very strong = 1, very weak =4;
	//col 1
	adviceMatrix[0][0]= 1;
 	adviceMatrix[0][1]= 1;
 	adviceMatrix[0][2]= 1;
	adviceMatrix[0][3]= 1;
 	adviceMatrix[0][4]= 2;
 	adviceMatrix[0][5]= 2;
	//col 2
	adviceMatrix[1][0]= 1;
 	adviceMatrix[1][1]= 1;
 	adviceMatrix[1][2]= 2;
	adviceMatrix[1][3]= 2;
 	adviceMatrix[1][4]= 2;
 	adviceMatrix[1][5]= 2;
	//col 3
	adviceMatrix[2][0]= 1;
 	adviceMatrix[2][1]= 1;
 	adviceMatrix[2][2]= 2;
	adviceMatrix[2][3]= 2;
 	adviceMatrix[2][4]= 3;
 	adviceMatrix[2][5]= 3;
	//col 4
	adviceMatrix[3][0]= 1;
 	adviceMatrix[3][1]= 2;
 	adviceMatrix[3][2]= 2;
	adviceMatrix[3][3]= 3;
 	adviceMatrix[3][4]= 3;
 	adviceMatrix[3][5]= 4;
	//col 5
	adviceMatrix[4][0]= 2;
 	adviceMatrix[4][1]= 2;
 	adviceMatrix[4][2]= 3;
	adviceMatrix[4][3]= 3;
 	adviceMatrix[4][4]= 4;
 	adviceMatrix[4][5]= 4;
	return adviceMatrix;
}

function loadFiles() {
	$.ajax({
		url : 'media/most_common.txt',
		dataType: "text",
		success : function (data) {
			commonDict = fileDataToArray(data);
			commonLoaded = true;
		}
	});
	$.ajax({
		url : 'media/john.txt',
		dataType: "text",
		success : function (data) {
			johnDict = fileDataToArray(data);
			johnLoaded = true;
		}
	});
	$.ajax({
		url : 'media/cain.txt',
		dataType: "text",
		success : function (data) {
			cainDict = fileDataToArray(data);
			cainLoaded = true;
		}
	});
	$.ajax({
		url : 'media/rockyou.txt',
		dataType: "text",
		success : function (data) {
			rockyouDict = fileDataToArray(data);
			rockyouLoaded = true;
		}
	});
	filesLoaded = true;
}

//helper function that allows for a local text file to be read into a multi-dimensional array
function readFile(fileName){
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", fileName, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
			//check for 0 since no http status will be sent as the file is local
            if(rawFile.status === 200 || rawFile.status == 0)	
            {
				dictionaries.push(fileDataToArray(rawFile.responseText));
            }
        }
    }
	rawFile.send(null);
}

//Helper function that takes a loaded file and places the text into a multi-dimensional array
function fileDataToArray(fileData) {
	var data = fileData.split("\n");
	var textArray = new Array();
	var arrayLength = 0;
	var dataLength = 0;
	for (var i=0; i<data.length; i++)
	{
		arrayLength = textArray.length;
		dataLength= data[i].length-1;	//word still has the \n character at the end
		
		//create a new array such that all words of the same
		//length are in the same array and can be found at textArray[wordLength-1]
		if (arrayLength < dataLength)
		{
			for (var j=0; j< (dataLength - arrayLength ); j++)
			{
				textArray.push(new Array());
			}
			textArray[dataLength-1].push(data[i].substring(0,dataLength)); 
		}
		else if (dataLength>0)
			textArray[dataLength-1].push(data[i].substring(0,dataLength)); 
	}
	return textArray;
}

//function to determine if the word is in the dictionary
function inDictionary(word, dict){
	var wordLength = word.length;
	if (wordLength > 0 && wordLength <= dict.length) {
		var lengthArray = dict[wordLength-1];
		if (lengthArray.length > 1) {
			for (var i=0; i<lengthArray.length; i++) {
				if (lengthArray[i] == word) {
					return true;
				}
			}
		}
	}
	return false;
}

//function to update the table with the password attack information
function updateTableDictionaryAttacks() {
	var pass = $("#inputPassword" ).val();
	//Top 10'000
	if (commonLoaded) {
		if (inDictionary(pass, commonDict)) {
			var standardPc = 10000/2000000000;	//top 10'000 has 10'0000 words in its dictionary
			var fastPc = 10000/(4*(3700000000));
				
			$("#table-topNormal").empty();
			$("#table-topNormal").append(getTimeLong(standardPc));
			$("#table-topNormal").attr('class', 'text-danger');
				
			$("#table-topFast").empty();
			$("#table-topFast").append(getTimeLong(fastPc));
			$("#table-topFast").attr('class', 'text-danger');
		} else {
			$("#table-topNormal").empty();
			$("#table-topNormal").append("Not in the dictionary");
			$("#table-topNormal").attr('class', 'text-success');
				
			$("#table-topFast").empty();
			$("#table-topFast").append("Not in the dictionary");
			$("#table-topFast").attr('class', 'text-success');
		}
	} else {
			$("#table-topNormal").empty();
			$("#table-topNormal").append("Loading Dictionary");
			$("#table-topNormal").attr('class', 'text-primary');
				
			$("#table-topFast").empty();
			$("#table-topFast").append("Loading Dictionary");
			$("#table-topFast").attr('class', 'text-primary');
	}
	//John the Ripper
	if (johnLoaded) {
		if (inDictionary(pass, johnDict)) {
			var standardPc = 3107/2000000000;	//john the ripper has 3107 words in its dictionary
			var fastPc = 3107/(4*(3700000000));
				
			$("#table-johnNormal").empty();
			$("#table-johnNormal").append(getTimeLong(standardPc));
			$("#table-johnNormal").attr('class', 'text-danger');
				
			$("#table-johnFast").empty();
			$("#table-johnFast").append(getTimeLong(fastPc));
			$("#table-johnFast").attr('class', 'text-danger');
		} else {
			$("#table-johnNormal").empty();
			$("#table-johnNormal").append("Not in the dictionary");
			$("#table-johnNormal").attr('class', 'text-success');
				
			$("#table-johnFast").empty();
			$("#table-johnFast").append("Not in the dictionary");
			$("#table-johnFast").attr('class', 'text-success');
		}
	} else {
			$("#table-johnNormal").empty();
			$("#table-johnNormal").append("Loading Dictionary");
			$("#table-johnNormal").attr('class', 'text-primary');
				
			$("#table-johnFast").empty();
			$("#table-johnFast").append("Loading Dictionary");
			$("#table-johnFast").attr('class', 'text-primary');
	}
	//Cain and Abel
	if (cainLoaded) {
		if (inDictionary(pass, cainDict)) {
			var standardPc = 306706/2000000000;	//cain & abel has 306706 words in its dictionary
			var fastPc = 306706/(4*(3700000000));
				
			$("#table-cainNormal").empty();
			$("#table-cainNormal").append(getTimeLong(standardPc));
			$("#table-cainNormal").attr('class', 'text-danger');
				
			$("#table-cainFast").empty();
			$("#table-cainFast").append(getTimeLong(fastPc));
			$("#table-cainFast").attr('class', 'text-danger');
		} else {
			$("#table-cainNormal").empty();
			$("#table-cainNormal").append("Not in the dictionary");
			$("#table-cainNormal").attr('class', 'text-success');
				
			$("#table-cainFast").empty();
			$("#table-cainFast").append("Not in the dictionary");
			$("#table-cainFast").attr('class', 'text-success');
		}
	} else {
			$("#table-cainNormal").empty();
			$("#table-cainNormal").append("Loading Dictionary");
			$("#table-cainNormal").attr('class', 'text-primary');
				
			$("#table-cainFast").empty();
			$("#table-cainFast").append("Loading Dictionary");
			$("#table-cainFast").attr('class', 'text-primary');
	}
	//Rock you
	if (rockyouLoaded) {
		if (inDictionary(pass, rockyouDict)) {
			var standardPc = 14344383/2000000000;	//rock you has 14344383 words in its dictionary
			var fastPc = 14344383/(4*(3700000000));
				
			$("#table-rockNormal").empty();
			$("#table-rockNormal").append(getTimeLong(standardPc));
			$("#table-rockNormal").attr('class', 'text-danger');
				
			$("#table-rockFast").empty();
			$("#table-rockFast").append(getTimeLong(fastPc));
			$("#table-rockFast").attr('class', 'text-danger');
		} else {
			$("#table-rockNormal").empty();
			$("#table-rockNormal").append("Not in the dictionary");
			$("#table-rockNormal").attr('class', 'text-success');
				
			$("#table-rockFast").empty();
			$("#table-rockFast").append("Not in the dictionary");
			$("#table-rockFast").attr('class', 'text-success');
		}
	} else {
			$("#table-rockNormal").empty();
			$("#table-rockNormal").append("Loading Dictionary");
			$("#table-rockNormal").attr('class', 'text-primary');
				
			$("#table-rockFast").empty();
			$("#table-rockFast").append("Loading Dictionary");
			$("#table-rockFast").attr('class', 'text-primary');
	}
}

function initGraphs(){
	if (contentChart == undefined)
		initContentChart();
	if (timeChart == undefined)
		initTimeCharts();
	if ($( "#inputPassword" ).val().length >0)
		calculateStrength();
}

function initContentChart(){
	contentChart = new Highcharts.Chart({
        chart: {
			renderTo: 'passContentChart',
            type: 'column'
        },
        title: {
            text: 'Password Strength Properties'
        },
        xAxis: {
            categories: ["Numbers", "Lower Case Letters", "Upper Case Letters", "Special Characters"]
        },
        yAxis: {
			min: 0,
            title: {
                text: 'Number of Occurences'
            }
        },
        series: [{
            name: 'Password',
            data: [0, 0, 0,0]
        }]
    });
}

function initTimeCharts(){
	    timeChart = new Highcharts.Chart({
        chart: {
			renderTo: 'passTimeChart',
            type: 'bar'
        },
        title: {
            text: 'Time Needed to Hack - Standard PC'
        },
        xAxis: {
			categories: ['AttackType']
        },
		yAxis: {
			min:0,
			title: {
                    text: 'Time in - Seconds',
                },
			labels: {
				overflow: 'justify'
				}
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
			id: 'brute',
            name: 'Brute Force',
            data: [0]
        }, {
			id: 'top',
            name: "Dictionary - top 10'000 passwords",
            data: [0]
        }, {
			id: 'john',
            name: "Dictionary - John The Ripper",
            data: [0]
        }, {
			id: 'cain',
            name: "Dictionary - Cain & Abel",
            data: [0]
        }, {
			id: 'rock',
            name: "Dictionary - Rock You",
            data: [0]
        } ]
    });
	 timeFastChart = new Highcharts.Chart({
        chart: {
			renderTo: 'passTimeFastChart',
            type: 'bar'
        },
        title: {
            text: 'Time Needed to Hack - Fast PC'
        },
        xAxis: {
			categories: ['AttackType']
        },
		yAxis: {
			min:0,
			title: {
                    text: 'Time in - Seconds',
                },
			labels: {
				overflow: 'justify'
				}
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
			id: 'brute',
            name: 'Brute Force',
            data: [0]
        }, {
			id: 'top',
            name: "Dictionary - top 10'000 passwords",
            data: [0]
        }, {
			id: 'john',
            name: "Dictionary - John The Ripper",
            data: [0]
        }, {
			id: 'cain',
            name: "Dictionary - Cain & Abel",
            data: [0]
        }, {
			id: 'rock',
            name: "Dictionary - Rock You",
            data: [0]
        } ]
    });
}

function updateGraphs(numberCount, letterCount, upperCount, symbolCount) {
	updateContentChart(numberCount, letterCount, upperCount, symbolCount);
	updateTimeCharts(numberCount, letterCount, upperCount, symbolCount);
}

function updateContentChart(numberCount, letterCount, upperCount, symbolCount){
	contentChart.series[0].data[0].update(y  = numberCount);
	contentChart.series[0].data[1].update(y  = letterCount);
	contentChart.series[0].data[2].update(y  = upperCount);
	contentChart.series[0].data[3].update(y  = symbolCount);
}

function updateTimeCharts(numberCount, letterCount, upperCount, symbolCount){
	var pass = $("#inputPassword" ).val();
	var calculated = calcKeySpace(pass.length,numberCount, letterCount, upperCount, symbolCount);
	
	var standardPc = calculated/2000000000; //time needed in seconds
	var fastPc = calculated/(4*(3700000000));
	
	var mins = standardPc/60;
	var hours = mins/60;
	var days = hours/24;
	var years = days/365;
	
	//change labels to minutes if the time to hack is longer than 60 seconds
	if (mins>1 && hours <1 && days < 1 && years <1) {
		timeChart.yAxis[0].axisTitle.attr({text: 'Time in - Minutes'});
		standardPc = mins;
	} else if (hours >1 && days < 1 && years < 1) {
		timeChart.yAxis[0].axisTitle.attr({text: 'Time in - Hours'});
		standardPc = hours;
	} else if (days >1 && years < 1) {
		timeChart.yAxis[0].axisTitle.attr({text: 'Time in - Days'});
		standardPc = days;
	} else if (years >1) {
		timeChart.yAxis[0].axisTitle.attr({text: 'Time in - Years'});
		standardPc = years;
	}
	
	var fmins = fastPc/60;
	var fhours = mins/60;
	var fdays = hours/24;
	var fyears = days/365;
	
	//change labels to minutes if the time to hack is longer than 60 seconds
	if (fmins>1 && fhours <1 && fdays < 1 && fyears <1) {
		timeFastChart.yAxis[0].axisTitle.attr({text: 'Time in - Minutes'});
		fastPc = fmins;
	} else if (fhours >1 && fdays < 1 && fyears < 1) {
		timeFastChart.yAxis[0].axisTitle.attr({text: 'Time in - Hours'});
		fastPc = fhours;
	} else if (fdays >1 && fyears < 1) {
		timeFastChart.yAxis[0].axisTitle.attr({text: 'Time in - Days'});
		fastPc = fdays;
	} else if (fyears >1) {
		timeFastChart.yAxis[0].axisTitle.attr({text: 'Time in - Years'});
		fastPc = fyears;
	}
	
	//get the series by name and add a new point
	timeChart.series[0].data[0].update(y  = standardPc);
	timeFastChart.series[0].data[0].update(y  = fastPc);
	
	//Top 10'000
	if (commonLoaded) {
		if (inDictionary(pass, commonDict)) {
			//top 10'000 has 10'0000 words in its dictionary
			timeChart.series[1].data[0].update(y  = 10000/2000000000);
			timeFastChart.series[1].data[0].update(y  = (10000/(4*(3700000000))));
		} else { 
			timeChart.series[1].data[0].update(y  = standardPc);
			timeFastChart.series[1].data[0].update(y  = fastPc);
		}
	}
	//John The Ripper
	if (johnLoaded) {
		if (inDictionary(pass, johnDict)) {
			//john the ripper has 3107 words in its dictionary
			timeChart.series[2].data[0].update(y  = 3107/2000000000);
			timeFastChart.series[2].data[0].update(y  = (3107/(4*(3700000000))));
		} else {
			timeChart.series[2].data[0].update(y  = standardPc);
			timeFastChart.series[2].data[0].update(y  = fastPc);
		}
	}
	//Cain and Abel
	if (cainLoaded) {
		if (inDictionary(pass, cainDict)) {
			//cain & abel has 306706 words in its dictionary
			timeChart.series[3].data[0].update(y  = 306706/2000000000);
			timeFastChart.series[3].data[0].update(y  = (306706/(4*(3700000000))));
		} else {
			timeChart.series[3].data[0].update(y  = standardPc);
			timeFastChart.series[3].data[0].update(y  = fastPc);
		}
	}
	//Rock you
	if (rockyouLoaded) {
		if (inDictionary(pass, rockyouDict)) {
			//rock you has 14344383 words in its dictionary
			timeChart.series[4].data[0].update(y  = 14344383/2000000000);
			timeFastChart.series[4].data[0].update(y  = (14344383/(4*(3700000000))));
		} else {
			timeChart.series[4].data[0].update(y  = standardPc);
			timeFastChart.series[4].data[0].update(y  = fastPc);
		}
	}
	timeChart.redraw();
}