/*

Github:   https://github.com/anthonytasca/roll20-api-scripts/blob/master/Languages/Languages.js
By:	   Anthony Tasca
Contact:  https://app.roll20.net/users/1000007/target

INTRODUCTION:
This is a re-work of "WhatSaywithUnknown.js" by derekkoehl which is an "enhancement" on "What Did He Say?" by Stephen S.
More information and a link to the credited work is provided here: https://app.roll20.net/forum/post/2723217/script-languages

TO INSTALL:
The default character sheet language attribute that this script uses is "prolanguages"
Change this if your character sheets dont use this attribute
	TO DO:
	!setLanugageTag newlanguagetag

*/

var LanguageScript = LanguageScript || (function () {
	'use strict';
	
	var version = "1.2.1",
	releasedate = "01/06/2017",  
	languageTag = "prolanguages",
	whichLanguage = "Common",
	
	numbers = [],
	symbols = [],
	consonant = [],
	consonantUpper = [],
	vowel = [],
	vowelUpper = [],
	
	roll20API = roll20API || {},
	
	whoSpoke = "",
	whoSpoke2 = "",
	gibberish = "",
	spokenByIds = "",
	characters = "",
	
	rndSeed,
	languageSeed = 0,
	separators = /[()\-\s,]+/,
	
	checkInstall = function() {
		log("Languages version: "+version+" ("+releasedate+") installed");
		log("https://github.com/Roll20/roll20-api-scripts/tree/master/Languages");
	},
	
	initialize = function() {
		numbers["Common"] = ["1","2","3","4","5","6","7","8","9","0"];
		numbers["Dwarven"] = ["·",":","∴","+","◊","◊·","◊:","◊∴","◊+","°"];
		numbers["Elven"] = ["·",":","∴","+","¤","¤·","¤:","¤∴","¤+","°"];
		numbers["Draconic"] = ["·",":","∴","+","×","×·","×:","×∴","×+","°"];
		numbers["Infernal"] = ["·",":","∴","+","∏","∏·","∏:","∏∴","∏+","°"];
		numbers["Cyrillic"] = ["Ⰰ","Ⰱ","Ⰲ","Ⰳ","Ⰴ","Ⰵ","Ⰶ","Ⰷ","Ⰸ","Ⰹ"];
		numbers["Arabic"] = ["۱","۲","۳","۴","۵","۶","۷","۸","۹","۰"];
		numbers["Runic"] = ["ᚨ","ᚩ","ᚪ","ᚫ","ᚬ","ᚭ","ᚮ","ᚯ","ᚰ","ᚲ"];
		
		symbols["Common"] = [" ","!","@","#","$","%","¦","&","*","(",")","`","-","=","~","_","+","[","]","{","}","|",";","'",":",",",".","/","<",">","?"];
		symbols["Dwarven"] = ["|","∫","»","‡","∇","‰","¦","χ","¬","|","]","`","-","Ξ","⊥","_","=","|","|","|","|","|","|","^","|","-","•","||","[","]","Ž"]; 
		symbols["Elven"] = [" '","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Draconic"] = [" ","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Infernal"] = ["' ","∧","•","‡","§","‰","¦","χ","Φ","|","]","`","-","Ξ","≈","_","∧","|","|",")","(","|","|","'","∫","≈","•","||","∈","∋","¿"];
		symbols["Cyrillic"] = [" ","!","•","⊕","Ҙ","‰","։","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋",";"];
		symbols["Arabic"] = [" ","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Runic"] = ["|","∫","»","‡","∇","‰","¦","χ","¬","|","]","`","-","Ξ","⊥","_","=","|","|","|","|","|","|","^","|","-","•","||","[","]","Ž"];
		
		consonant["ForChecks"] = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z","б","в","г","д","ж","з","й","к","л","м","н","п","р","с","т","ф","х","ц","ч","ш","щ","ъ","ь"];
		
		consonant["Common"] = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"];
		consonant["Dwarven"] = ["⌈","⌉","⌊","⌋","¬","¦","Γ","Λ","Ξ","Π","‡","∫","[","]","|","||","ΠΠ","VV","M","|"]; 
		consonant["Elven"] = ["λ","Ψ","ϒ","ϖ","φ","ç","þ","Þ","q","r","ξ","∫","~","∈","∋","ω","∪","⊆","⊇","∂"];
		consonant["Draconic"] = ["v","c","x","ϒ","þ","s","∫","ð","l","ʔ","n","≠","q","r","h","‡","b","w","t","d"];
		consonant["Infernal"] = ["ζ","Ψ","∈","ϖ","∏","ç","þ","∫","q","⊆","ς","Þ","ς","ϒ","∋","ω","∪","ξ","⊇","μ"];
		consonant["Cyrillic"] = ["б","в","г","д","ж","ѕ","з","к","л","м","н","п","р","с","т","ф","х","ѡ","ц","ч","ш","щ","ы","ѯ","ѱ","ѵ","ҁ","ҵ"];
		consonant["Arabic"] = ["ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه"];
		consonant["Runic"] = ["ᚠ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚻ","ᚾ","ᛃ","ᛈ","ᛉ","ᛊ","ᛋ","ᛏ","ᛒ","ᛗ","ᛚ","ᛜ","ᛝ","ᛞ"];
	   
		consonantUpper["Common"] = ["B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Z"];
		consonantUpper["Dwarven"] = ["⌈","⌉","⌊","⌋","¬","¦","Γ","Λ","Ξ","Π","‡","∫","[","]","|","||","ΠΠ","VV","M","|"]; 
		consonantUpper["Elven"] = ["λ","Ψ","ϒ","ϖ","φ","ç","þ","Þ","θ","η","ξ","∫","~","∈","∋","ω","∪","⊆","⊇","∂"];
		consonantUpper["Draconic"] = ["B","C","D","ϒ","þ","H","∫","K","L","M","N","P","θ","Γ","∂","‡","V","W","‡","χ"];
		consonantUpper["Infernal"] = ["ζ","Ψ","ϒ","ϖ","∏","ç","þ","Þ","θ","ξ","ς","∫","ς","E","∃","ω","∪","⊆","⊇","μ"];
		consonantUpper["Cyrillic"] = ["Б","В","Г","Д","Ж","S","З","К","Л","М","Н","П","Р","С","Т","Ф","Х","Ѡ","Ц","Ч","Ш","Щ","Ы","Ѯ","Ѱ","Ѵ","Ҁ","Ҵ"];
		consonantUpper["Arabic"] = ["ـب","ـت","ـث","ـج","ـح","ـخ","ـد","ـذ","ـر","ـز","ـس","ـش","ـص","ـض","ـط","ـظ","ـع","ـغ","ـف","ـق","ـك","ـل","ـم","ـن","ـه"];
		consonantUpper["Runic"] = consonant["Runic"];
		
		vowel["ForChecks"] = ["a","e","i","o","u","y","а","е","ё","и","о","у","ы","ю","я"];
		
		vowel["Common"] = ["a","e","i","o","u","y"];
		vowel["Dwarven"]  = ["⌈","⌉","⌊","⌋","¬","¦"];
		vowel["Elven"] = ["í","ä","ö","ý","ú","ë"];
		vowel["Draconic"] = ["à","è","ì","õ","ù","ý"];
		vowel["Infernal"] = ["ô","‡","∧","û","¦","î"];
		vowel["Cyrillic"] = ["а","е","и","i","о","оу","у","ѣ","ѥ","ю","ѫ","ѭ","ѧ","ѩ","ѳ"];
		vowel["Arabic"] = ["ا","و","ي","آ","ة","ى","ڛ‎"];
		vowel["Runic"] = ["ᚢ","ᚦ","ᚨ","ᛁ","ᛇ","ᛖ","ᛟ‎"];
		
		vowelUpper["Common"] = ["A","E","I","O","U","Y"];
		vowelUpper["Dwarven"]  = ["Γ","Λ","Ξ","Ξ","Π","‡"];
		vowelUpper["Elven"] = ["Í","Ä","Ö","Ÿ","Ú","Ë"];
		vowelUpper["Draconic"] = ["À","È","Ì","Ò","Ù","Ý"];
		vowelUpper["Infernal"] = ["Ô","χ","Φ","Û","Î","Ξ"];
		vowelUpper["Cyrillic"] = ["А","Е","И","I","О","ОУ","У","Ѣ","Ѥ","Ю","Ѫ","Ѭ","Ѧ","Ѩ","Ѳ"];
		vowelUpper["Arabic"] = ["ـا","ـو","ـي","ـآ","ـة","ـى","ـڛ‎"];
		vowelUpper["Runic"] = vowel["Runic"];
		
		roll20API.languageData = [];
		
		pushLanguage("Unknown",6,whichLanguage);
		pushLanguage("Abyssal",7,"Infernal");
		pushLanguage("Aquan",3,"Elven");
		pushLanguage("Arabic",0,"Arabic");
		pushLanguage("Auran",3,"Draconic");
		pushLanguage("Celestial",2,"Draconic");
		pushLanguage("Cyrillic",0,"Cyrillic");
		pushLanguage("Draconic",0,"Draconic");
		pushLanguage("Druidic",5,"Elven");
		pushLanguage("Dwarven",0,"Dwarven");
		pushLanguage("Elven",0,"Elven");
		pushLanguage("Giant",5,"Dwarven");
		pushLanguage("Gnome",3,"Dwarven");
		pushLanguage("Goblin",11,"Dwarven");
		pushLanguage("Gnoll",11,"Common");
		pushLanguage("Halfling",3,"Common");
		pushLanguage("Ignan",11,"Draconic");
		pushLanguage("Infernal",0,"Infernal");
		pushLanguage("Orc",9,"Dwarven");
		pushLanguage("Runic",0,"Runic");
		pushLanguage("Slavic",3,"Cyrillic");
		pushLanguage("Sylvan",7,"Elven");
		pushLanguage("Terran",15,"Dwarven");
		pushLanguage("Undercommon",11,"Elven");
		pushLanguage("Thieves'Cant",1,"Common");
	},
	
	//Handles chat message (on('chat:message') event)
	handleChat = function(msg) {	
		//Do nothing if chat msg is not API type
		if (msg.type != "api"){
			return;
		}
		
		//setlanguagetag handler
		if(msg.content.toLowerCase().indexOf("setlanguagetag ")==1){
			//check if player is GM
			if(playerIsGM(msg.playerid)){
				setLanguageTag(msg);
				sendChat("Languages Script", "LanguageTag is set to "+msg.content.toLowerCase());
			}else{
				sendChat("Languages Script", "Access denied, " + msg.who + " could set language tag");
			}
			return;
		}
		
		//createlanguage handler
		if(msg.content.toLowerCase().indexOf("createlanguage ")==1){
			if(playerIsGM(msg.playerid)){
				if(msg.content.split(" ").length == 4 && !isNaN(msg.content.split(" ")[2])){
					createLanguage(msg.content.split(" ")[1],parseInt(msg.content.split(" ")[2]),msg.content.split(" ")[3]);
				}else{
					sendChat("Languages Script", "could not create language, try this syntax: !createlanguage [name] [#seed] [parent] .. ex: !createlanguage newlanguage 3 common");
				}
			}else{
				sendChat("Languages Script", "access denied, " + msg.who + " could not create language");
			}
			return;
		}
		
		//deletelanguage handler
		if(msg.content.toLowerCase().indexOf("deletelanguage ")==1){
			if(playerIsGM(msg.playerid)){
				deleteLanguage(msg.content.split(" ")[1]);
			}else{
				sendChat("Languages Script", "access denied, " + msg.who + " could not create language");
			}
			return;
		}
		
		//If message is one of registered languages...
		if(isSpeakingLanguage(msg)){
			//Check if speaker can speak this language
			checkForFluency(msg);
			//Switch whichLanguage back to default
			whichLanguage = 'Common';
			return;
		}
	},
	
	//Checks if character who player speaks as can speak language
	checkForFluency = function(msg) {
		//All players
		var allPlayers = findObjs({_type: "player"}, {caseInsensitive: true});
		//Check if it is character of GM speaks. If no, throw error
		if(findObjs({ _type: "character", name: msg.who }).length !== 0 || playerIsGM(msg.playerid)){
			spokenByIds = "";
			//For each player...
			_.each(allPlayers, function(p) {
				//if player is online...
				if(p.get("_online")){
					var speakingas = p.get("speakingas");
					//If player speaks as character...
					if(speakingas !== undefined){
						var languages = getAttrByName(speakingas.split("|")[1], languageTag);
						//If character knows any languages...
						if(languages !== undefined){
							languages.split(separators).forEach(function(lang) {
								if(lang.toUpperCase() == whichLanguage.toUpperCase()){
									//Add character to list of chars who can understand language.
									spokenByIds += "," + p.get("id");
								}
							});
						}else if(findObjs({ _type: "character", _id: speakingas }).length !== 0){
							sendChat("Languages Script", "This script is not set up properly for your character sheets. Use this command to fix: !setlanguagetag [character sheet language attribute name]");
							log("This script is not set up for your character sheets. Use this command to fix: !setlanguagetag [character sheet language attribute name]");   
							return;
						}else if(playerIsGM(p.get("id"))){
							log("The previous error was handled properly and there is nothing to worry about");
						}
					}
				}
			});
		}else{
			sendChat("Languages Script", "/w " + msg.who + " Only characters or GMs may speak character languages");
			return;
		}
		roll20API.fluencyArray = [];
		_.each(allPlayers, function(indexPlayers) {
			if(indexPlayers.get("_online")){
				var isSpeaking = 0;
				if(indexPlayers.get("_id") == msg.playerid){
					isSpeaking = 1;
					whoSpoke = indexPlayers.get("_displayname");
				}
				var displayNameShort = indexPlayers.get("_displayname").substr(0,indexPlayers.get("_displayname").indexOf(' '));
				var displayNameFull = indexPlayers.get("_displayname");
				var playerID = indexPlayers.get("_id");
				var asWho = msg.who;
				var speaks = -1;
				if(spokenByIds.indexOf(indexPlayers.get("_id"))>-1){
					speaks = 1;
				}else if(playerIsGM((indexPlayers.get("_id")))){
					speaks = 1;
				}else{
					speaks = -1;   
				}
				roll20API.fluencyArray.push({
					isSpeaking: isSpeaking,
					displayNameShort: displayNameShort,
					displayNameFull: displayNameFull,
					playerID: playerID,
					asWho: asWho,
					speaks: speaks
				});
			}
		});
		prepareSend(msg);
	},
	
	prepareSend = function(msg) {
		var sentence = msg.content.substr(1);
	
		if(sentence.length === 0) {
			sendChat("Languages Script", "/w " + whoSpoke + " You didn't say anything.");
			return;
		}
	
		gibberish = gibberishFunction(characters,sentence);
		
		var theSpeaker = _.findWhere(roll20API.fluencyArray, {isSpeaking: 1});
		if(theSpeaker.speaks == -1){
			sendChat(msg.who + " Pretending to speak " + whichLanguage, gibberish);
			return;
		}
		
		if(whoSpoke.indexOf(" ")>-1){
			whoSpoke = whoSpoke.substring(0,whoSpoke.indexOf(" "));
		}
		
		sendChat(msg.who, "/w " + whoSpoke + " '" + sentence +" ' in " + whichLanguage + ".");
		sendChat("Languages Script", "/w gm " + msg.who + " said '" + sentence + " ' in " + whichLanguage);
		//Debugging (logging)
		sendChat("Languages Script", "/w gm " + msg.who + " gibberish version: '" + gibberish + " ' is in " + whichLanguage);
		
		_.each(roll20API.fluencyArray, function(indexPlayers) {
			if(indexPlayers.displayNameFull != whoSpoke && indexPlayers.displayNameShort != whoSpoke){
				if(indexPlayers.displayNameFull.indexOf(" ")>-1){
					whoSpoke2 = indexPlayers.displayNameFull.substring(0,indexPlayers.displayNameFull.indexOf(" "));
				}else{
					whoSpoke2 = indexPlayers.displayNameFull;
				}
				if(indexPlayers.speaks != -1){
					sendChat(msg.who, "/w " + whoSpoke2 + " '" + sentence +" ' in " + whichLanguage + ".");
				}else{
					sendChat(msg.who, "/w " + whoSpoke2 + " " + gibberish);
				}  
			}
		});  
	},
	
	gibberishFunction = function(language,sentence) {
		//Polyfill - implementation of arr.findIndex method
		var directChangeFromArray = numbers["Common"].concat(symbols["Common"]);
		var directChangeToArray = numbers[language].concat(symbols[language]);
		var allLetters = consonant[language].concat([language]);
		var allLettersUpper = consonantUpper[language].concat(vowelUpper[language]);
		var result = '';
		var temp = 0;
		var i = 0;
		var iKnowThisVowel = false;
		for (i=0;i<vowel["ForChecks"].length;i++){
			if (sentence.indexOf(vowel["ForChecks"][i]) != -1) {
				iKnowThisVowel = true;
				break;
			}
		}
		for (i=0;i<sentence.length;i++){
			temp = findIndex(sentence[i],directChangeFromArray);
			if (temp === -1) {
				if (iKnowThisVowel === true) {
					//If vowel
					if (findIndex(sentence[i],vowel["ForChecks"]) != -1) {
						if (sentence[i].toLowerCase() !== sentence[i]) {
							result += vowelUpper[language][customRandom(languageSeed,sentence.charCodeAt(i)) % vowelUpper[language].length];
						}
						else {
							result += vowel[language][customRandom(languageSeed,sentence.charCodeAt(i)) % vowel[language].length];
						}
					}
					//if consonant or unknown
					else {
						if (sentence[i].toLowerCase() !== sentence[i]) {
							result += consonantUpper[language][customRandom(languageSeed,sentence.charCodeAt(i)) % consonantUpper[language].length];
						}
						else {
							result += consonant[language][customRandom(languageSeed,sentence.charCodeAt(i)) % consonant[language].length];
						}
					}
				}
				//if we met no vowels at all
				else {
					if (sentence[i].toLowerCase() !== sentence[i]) {
						result += allLettersUpper[customRandom(languageSeed,sentence.charCodeAt(i)) % allLettersUpper.length];
					}
					else {
						result += allLetters[customRandom(languageSeed,sentence.charCodeAt(i)) % allLetters.length];
					}
				}
			}
			else {
				result += directChangeToArray[temp];
			}
		}
		return(result);
	},
	
	findIndex = function(character,array) {
		for(var i=0;i<array.length;i++){
			if (array[i] == character) {
				return(i);
			}
		}
		return(-1);
	},
	
	customRandom = function(seed,charID) {
		if (seed === 0) {
			return(charID);
		}
		var x = Math.sin(seed+charID) * 10000;
		return Math.floor((x - Math.floor(x))*1000);
	},
	
	//sets LanguageTag
	setLanguageTag = function(msg){
		if(msg.content.indexOf(" ")>0 && msg.content.indexOf(" ")<msg.content.length){
			var tempLanguageTag = msg.content.substring(msg.content.indexOf(" ")+1, msg.content.length);
			var flag = false;
			var allCharacters = findObjs({_type: "character"}, {caseInsensitive: true});
			_.each(allCharacters, function(c) {
			   	if(!flag){
				  	var languages = getAttrByName(c.id, tempLanguageTag);
			   		if(languages === undefined){
				  		flag = true;
				 	}
			   	}
			});
			var languageMessage;
			if(!flag){
				languageTag = tempLanguageTag;
				languageMessage = "language attribute name set to '" + languageTag + "'";
				sendChat("Languages Script", "/w gm " + languageMessage);
				return;
			}else{
				log("The previous error was handled properly and there is nothing to worry about");
				languageMessage = "'" + tempLanguageTag + "' is not the name of an attribute in your character sheet";
				sendChat("Languages Script", "/w gm " + languageMessage);
				return;   
			}
		}else{
			//language error
			sendChat("Languages Script", "/w gm Invalid language tag");
			return;
		}
	},
	
	isSpeakingLanguage = function(msg){
		var flag = false;
		_.each(roll20API.languageData, function(eachLanguage) {
			if(msg.content.toLowerCase().indexOf(eachLanguage.Description.toLowerCase())==1){
				whichLanguage = eachLanguage.Description;
				msg.content = msg.content.replace(eachLanguage.Description, "");
				msg.content = msg.content.replace(eachLanguage.Description.toLowerCase(), "");
				msg.content = msg.content.replace(eachLanguage.Description.toUpperCase(), "");
				languageSeed = eachLanguage.languageSeed;
				characters = eachLanguage.characters;
				flag = true;
			}
		});
		return flag;
	},
	
	createLanguage = function(description, seed, parentlanguage){
		var tempArray = roll20API.languageData.filter(function(language){
			return (description.toLowerCase() !== language.Description.toLowerCase());
		});
		if(arraysEqual(tempArray,roll20API.languageData)){
			if(parentlanguage.toLowerCase() == "dwarven"){
				parentlanguage = "Dwarven";
			}else if(parentlanguage.toLowerCase() == "common"){
				parentlanguage = "Common";
			}else if(parentlanguage.toLowerCase() == "elven"){
				parentlanguage = "Elven";
			}else if(parentlanguage.toLowerCase() == "infernal"){
				parentlanguage = "Infernal";
			}else if(parentlanguage.toLowerCase() == "draconic"){
				parentlanguage = "Draconic";
			}else if(parentlanguage.toLowerCase() == "cyrillic"){
				parentlanguage = "Cyrillic";
			}else{
				//language error
				sendChat("Languages Script", '/w gm Parent langauge: "' + parentlanguage + '" is not valid. Choices are : Dwarven, Elven, Common, Draconic, Infernal');
				return;
			}
			pushLanguage(description,seed,parentlanguage);
			var languageMessage = "langauge: '" + description + "' was created";
			sendChat("Languages Script", "/w gm " + languageMessage);
		}else{
			sendChat("Languages Script", '/w gm Language: "' + description + '" already exists and could not be created again');
		}
	},
	
	pushLanguage = function(description, seed, parentlanguage){
		roll20API.languageData.push({
			Description: description,   
			languageSeed: seed, 
			characters: parentlanguage
		});
	},
	
	deleteLanguage = function(description){
		var tempArray = roll20API.languageData.filter(function(language){
			return (description.toLowerCase() !== language.Description.toLowerCase());
		});
		if(arraysEqual(tempArray,roll20API.languageData)){
			sendChat("Languages Script", '/w gm Language "' + description + '" was not found and could not be deleted');
		}else{
			roll20API.languageData = tempArray;
			sendChat("Languages Script", '/w gm Language "' + description + '" deleted');
		}
	},

	arraysEqual = function(a, b) {
		if (a === b) return true;
		if (a === null || b === null) return false;
		if (a.length != b.length) return false;
		for (var i = 0; i < a.length; ++i) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	},
	
	registerEventHandlers = function() {
		on('chat:message', handleChat);
	};
	
	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers,
		Init: initialize
	};
	
}());

on('ready', function() {
	'use strict';
	LanguageScript.CheckInstall();
	LanguageScript.Init();
	LanguageScript.RegisterEventHandlers();
});