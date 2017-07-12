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
	
	var version = "1.4.3",
	releasedate = "13/07/2017",
	languageTag = "languages",
	whichLanguage = "Common",
	
	alphabets = [],
	numbers = [],
	symbols = [],
	consonant = [],
	consonantUpper = [],
	vowel = [],
	vowelUpper = [],
	
	roll20API = roll20API || {},
	
	characters = "",
	
	languageSeed = 0,
	separators = /[()\-\s,]+/,
	
	checkInstall = function() {
		log("Languages version: "+version+" ("+releasedate+") installed");
		log("https://github.com/Roll20/roll20-api-scripts/tree/master/Languages");
	},
	
	initialize = function() {
		//Alphabets
		//Please notice: names in this massive should be in lower case only
		//This is not strict to other lists
		alphabets = ["Common","Common_old","Dwarven","Gnome","Orc","Elven","Elven_old","Sylvan","Draconic","Draconic_old","Infernal","Infernal_old","Celestial","Cyrillic","Arabic","Runic","Japanese","ZALGO"];
		
		numbers["Common"] = ["1","2","3","4","5","6","7","8","9","0"];
		numbers["Common_old"] = ["1","2","3","4","5","6","7","8","9","0"];
		numbers["Dwarven"] = ["·",":","∴","+","◊","◊·","◊:","◊∴","◊+","°"];
		numbers["Gnome"] = ["Ⰰ","Ⰱ","Ⰲ","Ⰳ","Ⰴ","Ⰵ","Ⰶ","Ⰷ","Ⰸ","Ⰹ"];
		numbers["Orc"] = ["·",":","∴","+","◊","◊·","◊:","◊∴","◊+","°"];
		numbers["Elven"] = ["௧","௨","௩","௪","௫","௬","௭:","௮","௯","௦"];
		numbers["Elven_old"] = ["·",":","∴","+","¤","¤·","¤:","¤∴","¤+","°"];
		numbers["Sylvan"] = ["౧","౨","౩","౪","౫","౬","౭","౮","౯","௦"];
		numbers["Draconic"] = ["༡","༢","༣","༤","༥","༦","༧","༨","༩","༠"];
		numbers["Draconic_old"] = ["·",":","∴","+","×","×·","×:","×∴","×+","°"];
		numbers["Infernal"] = ["·",":","∴","+","∏","∏·","∏:","∏∴","∏+","°"];
		numbers["Infernal_old"] = ["·",":","∴","+","∏","∏·","∏:","∏∴","∏+","°"];
		numbers["Celestial"] = ["๑","๒","๓","๔","๕","๖","๗","๘","๙","๐"];
		numbers["Cyrillic"] = ["Ⰰ","Ⰱ","Ⰲ","Ⰳ","Ⰴ","Ⰵ","Ⰶ","Ⰷ","Ⰸ","Ⰹ"];
		numbers["Arabic"] = ["۱","۲","۳","۴","۵","۶","۷","۸","۹","۰"];
		numbers["Runic"] = ["ᚨ","ᚩ","ᚪ","ᚫ","ᚬ","ᚭ","ᚮ","ᚯ","ᚰ","ᚲ"];
		numbers["Japanese"] = ["一","二","三","四","五","六","七","八","九","〇"];
		numbers["ZALGO"] = ["1͏̴̸̀","2̶̶̧͡","3̴̷̢","4̧̡̛́","5҉̸̛̀","6̸̸̛͝","7̧͞͝","8͡͏̷̸͢","9̢̡͢","0̸̵͟"];
		
		symbols["Common"] = [" ","!","@","#","$","%","¦","&","*","(",")","`","-","=","~","_","+","[","]","{","}","|",";","'",":",",",".","/","<",">","?"];
		symbols["Common_old"] = [" ","!","@","#","$","%","¦","&","*","(",")","`","-","=","~","_","+","[","]","{","}","|",";","'",":",",",".","/","<",">","?"];
		symbols["Dwarven"] = [":","∫","»","‡","∇","‰","¦","χ","¬","|","]","`","-","Ξ","⊥","_","=","|","|","|","|","|","|","^","|","-","•","||","[","]","Ž"]; 
		symbols["Gnome"] = [" ","!","•","⊕","Ҙ","‰","։","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋",";"];
		symbols["Orc"] = ["|","∫","»","‡","∇","‰","¦","χ","¬","|","]","`","-","Ξ","⊥","_","=","|","|","|","|","|","|","^","|","-","•","||","[","]","Ž"];
		symbols["Elven"] = [" ","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Elven_old"] = [" '","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Sylvan"] = [" ","༎","•","༉","§","‰","¦","∞","Φ","༺","༻","`","༄","༄","༄","_","†","]","[",")","(","|","༈","'","༈","≈","།","∠", "∈","∋","¿"];
		symbols["Draconic"] = ["་","༎","•","༉","§","‰","¦","∞","Φ","༺","༻","`","༄","༄","༄","_","†","]","[",")","(","|","༈","'","༈","≈","།","∠", "∈","∋","¿"];
		symbols["Draconic_old"] = [" ","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Infernal"] = ["' ","՜","•","‡","§","‰","¦","χ","Φ","|","]","՝","֊","Ξ","≈","՟","∧","|","|",")","(","|","|","'","∫","≈","•","||","«","»","՞"];
		symbols["Infernal_old"] = ["' ","∧","•","‡","§","‰","¦","χ","Φ","|","]","`","-","Ξ","≈","_","∧","|","|",")","(","|","|","'","∫","≈","•","||","∈","∋","¿"];
		symbols["Celestial"] = [" ","՜","•","‡","§","‰","¦","χ","Φ","|","]","՝","֊","Ξ","≈","՟","∧","|","|",")","(","|","|","'","∫","≈","•","||","«","»","՞"];
		symbols["Cyrillic"] = [" ","!","•","⊕","Ҙ","‰","։","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋",";"];
		symbols["Arabic"] = [" ","~","•","⊕","§","‰","¦","∞","Φ","}","|","`","-","Ξ","≈","_","†","]","[",")","(","|","|","'","∫","≈","·","∠", "∈","∋","¿"];
		symbols["Runic"] = ["|","∫","»","‡","∇","‰","¦","χ","¬","|","]","`","-","Ξ","⊥","_","=","|","|","|","|","|","|","^","|","-","•","||","[","]","Ž"];
		symbols["Japanese"] = ["・","!","@","#","$","%","¦","&","*","(",")","`","-","=","~","_","+","[","]","{","}","|",";","'",":",",",".","/","<",">","?"];
		symbols["ZALGO"] = [" ","!̸̢̡̕","@̷̧́","#̶̡͜͢","$͡͠","%̶̨͘͠͞","¦͏̨̀͝","&̸̀","*̀͠҉","(́͞҉̀",")҉̀","`̸̸̡","-͝","=̴́͏","~̀͏","_̵̴͘","+̸̢́͘͡","[̧҉̛","]̷̛͘","{̡͘҉","}̵̀͟","|̸̀",";͢͝","'̴͜",":̡͘͢",",",".̵̧","/̸̀̀","<҉́͡",">̷͢͝","?͏̷̢"];
		
		consonant["ForChecks"] = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z","б","в","г","д","ж","з","й","к","л","м","н","п","р","с","т","ф","х","ц","ч","ш","щ","ъ","ь"];
		
		consonant["Common"] = ["b","c","d","ð","f","ᵹ","g","h","j","k","l","m","n","p","q","r","s","ſ","t","þ","v","ƿ","w","x","z"];
		consonant["Common_old"] = ["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"];
		consonant["Dwarven"] = ["𐰊","𐰑‎","‏𐰎","‏𐰵","𐰍","𐰴","‏𐰹","𐰸","‏𐱃","𐱄","𐰞‎","𐰟‎","𐰣‎","𐰺‎","‏𐰻","𐰽","𐰖","‏𐰗","‏𐰋‎","‏𐰌","‏𐰓","‏𐰏‎","‏𐰐","‏𐰚","‏𐰛","‏𐰜","‏𐰝","‏𐱅‎","‏𐱆","‏𐰠‎","‏𐰤","‏𐰥","‏𐰼","‏𐰾‎","‏𐰘‎","‏𐰙‎"]; 
		consonant["Gnome"] = ["ⰱ","ⰲ","ⰳ","ⰴ","ⰶ","ⰷ","ⰸ","ⰼ","ⰽ","ⰾ","ⰿ","ⱀ","ⱂ","ⱃ","‎ⱄ","ⱅ","ⱇ","ⱈ","ⱉ","ⱋ","‎ⱌ","ⱍ","‎ⱎ","ⱖ","ⱚ"];
		consonant["Orc"] = ["⌈","⌉","⌊","⌋","¬","¦","Γ","Λ","Ξ","Π","‡","∫","[","]","|","||","ΠΠ","VV","M","|"]; 
		consonant["Elven"] = ["க்","ங்","ச்","ஞ்","ட்","ண்","த்","ந்","ப்","ம்","ய்","ர்","ல்","வ்","ழ்","ள்","ற்","ன்","ஜ்","ஶ்","ஷ்","ஸ்","ஹ்","க்ஷ்"];
		consonant["Elven_old"] = ["λ","Ψ","ϒ","ϖ","φ","ç","þ","Þ","q","r","ξ","∫","~","∈","∋","ω","∪","⊆","⊇","∂"];
		consonant["Sylvan"] = ["ప","బ","ఫ","భ","మ","వ","త","ద","థ","ధ","న","స","ల","ట","డ","ఠ","ఢ","ణ","ష","ళ","చ","జ","ఛ","ఝ","శ","య","క","గ","ఖ","ఘ","హ"];
		consonant["Draconic"] = ["ཀ","ཅ","ཏ","པ","ཙ","ཞ","ར","ཧ","ཁ","ཆ","ཐ","ཕ","ཚ","ཟ","ལ","ཨ","ག","ཇ","ད","བ","ཛ","འ","ཤ","ང","ཉ","ན","མ","ཝ","ཡ","ས"];
		consonant["Draconic_old"] = ["v","c","x","ϒ","þ","s","∫","ð","l","ʔ","n","≠","q","r","h","‡","b","w","t","d"];
		consonant["Infernal"] = ["բ","գ","դ","զ","թ","ժ","լ","Խ","ծ","կ","հ","ձ","ղ","ճ","մ","ն","շ","չ","պ","ջ","ռ","ս","վ","տ","ր","ց","ւ","փ","ք","ֆ"];
		consonant["Infernal_old"] = ["ζ","Ψ","∈","ϖ","౻","ç","þ","∫","q","⊆","ς","Þ","ς","ϒ","∋","ω","∪","ξ","⊇","μ"];
		consonant["Celestial"] = ["ก","ข","ฃ","ค","ฅ","ฆ","ง","จ","ฉ","ช","ซ","ฌ","ญ","ฎ","ฏ","ฐ","ฑ","ฒ","ณ","ด","ต","ถ","ท","ธ","น","บ","ป","ผ","ฝ","พ","ฟ","ภ","ม","ย","ร","ล","ว","ศ","ษ","ส","ห","ฬ","อ","ฮ"];
		consonant["Cyrillic"] = ["б","в","г","д","ж","ѕ","з","к","л","м","н","п","р","с","т","ф","х","ѡ","ц","ч","ш","щ","ы","ѯ","ѱ","ѵ","ҁ","ҵ"];
		consonant["Arabic"] = ["ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه"];
		consonant["Runic"] = ["ᚠ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚻ","ᚾ","ᛃ","ᛈ","ᛉ","ᛊ","ᛋ","ᛏ","ᛒ","ᛗ","ᛚ","ᛜ","ᛝ","ᛞ"];
		consonant["Japanese"] = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヰ","ヱ","ヲ"];
		consonant["ZALGO"] = ["b̵͠","ç̷̛","d̛̛","ð̡҉́͝","f͏͘","ᵹ̶̷̛͏","g̵͘","ḩ͏̵͏","j̡͟","k̵̢","ĺ̷","ḿ͜͞","n̢̡҉̕","p̨̀̕","q̷́͘͘","r̛͢","ś̶͘͡","ſ͘͘͟","ţ̀͞","þ̷̢͢͡","v̡̢","ƿ̡͟͏","w̸","x́͘͘͢","z̵̨"];
		
		consonantUpper["Common"] = ["B","C","D","Ð","F","G","H","J","K","L","M","N","P","Q","R","S","T","Þ","V","W","X","Z"];
		consonantUpper["Common_old"] = ["B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Z"];
		consonantUpper["Dwarven"] = consonant["Dwarven"];
		consonantUpper["Gnome"] = ["Ⰱ","Ⰲ","Ⰳ","Ⰴ","Ⰶ","Ⰷ","Ⰸ‎","Ⰼ","Ⰽ‎","Ⰾ","Ⰿ","Ⱀ‎","Ⱂ","Ⱃ","‎Ⱄ","Ⱅ","Ⱇ","Ⱈ","Ⱉ","Ⱋ","‎Ⱌ","Ⱍ","‎Ⱎ","Ⱖ","Ⱚ"];
		consonantUpper["Orc"] = ["⌈","⌉","⌊","⌋","¬","¦","Γ","Λ","Ξ","Π","‡","∫","[","]","|","||","ΠΠ","VV","M","|"]; 
		consonantUpper["Elven"] = consonant["Elven"];
		consonantUpper["Elven_old"] = ["λ","Ψ","ϒ","ϖ","φ","ç","þ","Þ","θ","η","ξ","∫","~","∈","∋","ω","∪","⊆","⊇","∂"];
		consonantUpper["Sylvan"] = consonant["Sylvan"];
		consonantUpper["Draconic"] = consonant["Draconic"];
		consonantUpper["Draconic_old"] = ["B","C","D","ϒ","þ","H","∫","K","L","M","N","P","θ","Γ","∂","‡","V","W","‡","χ"];
		consonantUpper["Infernal"] = ["Բ","Գ","Դ","Զ","Թ","Ժ","Լ","խ","Ծ","Կ","Հ","Ձ","Ղ","Ճ","Մ","Ն","Շ","Չ","Պ","Ջ","Ռ","Ս","Վ","Տ","Ր","Ց","Ւ","Փ","Ք","Ֆ"];
		consonantUpper["Infernal_old"] = ["ζ","Ψ","ϒ","ϖ","∏","ç","þ","Þ","θ","ξ","ς","∫","ς","E","∃","ω","∪","⊆","⊇","μ"];
		consonantUpper["Celestial"] = consonant["Celestial"];
		consonantUpper["Cyrillic"] = ["Б","В","Г","Д","Ж","S","З","К","Л","М","Н","П","Р","С","Т","Ф","Х","Ѡ","Ц","Ч","Ш","Щ","Ы","Ѯ","Ѱ","Ѵ","Ҁ","Ҵ"];
		consonantUpper["Arabic"] = ["ـب","ـت","ـث","ـج","ـح","ـخ","ـد","ـذ","ـر","ـز","ـس","ـش","ـص","ـض","ـط","ـظ","ـع","ـغ","ـف","ـق","ـك","ـل","ـم","ـن","ـه"];
		consonantUpper["Runic"] = consonant["Runic"];
		consonantUpper["Japanese"] = consonant["Japanese"];
		consonantUpper["ZALGO"] = ["B͏̛͘͞","C̕͘͡͠","Ḑ̵̀","Ð̡͘͟","F͏͟","G̨̛","H̶̢̕͡͝","J҉̨͠","K̷̵̶̛͠","L̨̕͢","Ḿ","N҉̨͜͡","Ṕ̶̢͠҉","Q̡͢͟͞͞","R҉̷̢","S͡","Ţ̶","Þ́̕͜͡","V́͢","W̷̨͘͝","X̀͜","Z̷̵̕͟͟"];
		
		vowel["ForChecks"] = ["a","e","i","o","u","y","а","е","ё","и","о","у","ы","ю","я"];
		
		vowel["Common"] = ["a","æ","e","i","o","u","y"];
		vowel["Common_old"] = ["a","e","i","o","u","y"];
		vowel["Dwarven"]  = ["𐰀‎","𐰃","𐰆","𐰇‎","𐰂","𐰁","𐰅","𐰄","𐰈"];
		vowel["Gnome"]  = ["ⰰ‎","ⰵ","ⰹ","ⰺ‎","ⰻ","ⱁ","ⱛ","ⱆ","ⱊ","ⱏ","ⱐ","ⱑ","ⱓ","ⱔ","ⱕ","ⱗ","ⱙ"];
		vowel["Orc"]  = ["⌈","⌉","⌊","⌋","¬","¦"];
		vowel["Elven"] = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ","க","கா","கி","கீ","கு","கூ","கெ","கே","கை"];
		vowel["Elven_old"] = ["í","ä","ö","ý","ú","ë"];
		vowel["Sylvan"] = ["ఇ","ఎ","ఈ","ఏ","అ","ఆ","ఉ","ఒ","ఊ","ఓ"]
		vowel["Draconic"] = ["གྷ","ཛྷ","ཊ","ཋ","ཌ","ཌྷ","ཎ","དྷ","བྷ","ཥ","ཀྵ"];
		vowel["Draconic_old"] = ["à","è","ì","õ","ù","ý"];
		vowel["Infernal"] = ["ա","ե","է","ը","յ","ո","և","օ"];
		vowel["Infernal_old"] = ["ô","‡","∧","û","¦","î"];
		vowel["Celestial"] = ["ะ","ั","็","า","ิ","ู","เ","โ","ใ","ไ","อ","ย","ว","ฤ","ฤๅ","ฦ","ฦๅ"];
		vowel["Cyrillic"] = ["а","е","и","i","о","ѹ","у","ѣ","ѥ","ю","ѫ","ѭ","ѧ","ѩ","ѳ"];
		vowel["Arabic"] = ["ا","و","ي","آ","ة","ى","ڛ‎"];
		vowel["Runic"] = ["ᚢ","ᚦ","ᚨ","ᛁ","ᛇ","ᛖ","ᛟ‎"];
		vowel["Japanese"] = ["ガ","ギ","グ","ゲ","ゴ","ザ","ジ","ズ","ゼ","ゾ","ダ","ヂ","ヅ","デ","ド","バ","ビ","ブ","ベ","ボ","パ","ピ","プ","ペ","ポ"];
		vowel["ZALGO"] = ["ą̢͞","æ͝͏","é̕","i̵̵̢","o̧͢͜͢","ú̕","y҉̧͘҉͠"];
		
		vowelUpper["Common"] = ["A","Æ","E","I","O","U","Y"];
		vowelUpper["Common_old"] = ["A","E","I","O","U","Y"];
		vowelUpper["Dwarven"]  = vowel["Dwarven"];
		vowelUpper["Gnome"]  = ["Ⰰ","Ⰵ","Ⰹ","Ⰺ","Ⰻ","Ⱁ","Ⱛ","Ⱆ","Ⱊ","Ⱏ","Ⱐ","Ⱑ","Ⱓ","Ⱔ","Ⱕ","Ⱗ","Ⱘ"];
		vowelUpper["Orc"]  = ["Γ","Λ","Ξ","Ξ","Π","‡"];
		vowelUpper["Elven"] = vowel["Elven"];
		vowelUpper["Elven_old"] = ["Í","Ä","Ö","Ÿ","Ú","Ë"];
		vowelUpper["Sylvan"] = vowel["Sylvan"];
		vowelUpper["Draconic"] = vowel["Draconic"];
		vowelUpper["Draconic_old"] = ["À","È","Ì","Ò","Ù","Ý"];
		vowelUpper["Infernal"] = ["Ա","Ե","Է","Ի","Յ","Ո","և","Օ"];
		vowelUpper["Infernal_old"] = ["Ô","χ","Φ","Û","Î","Ξ"];
		vowelUpper["Cyrillic"] = ["А","Е","И","I","О","Ѹ","У","Ѣ","Ѥ","Ю","Ѫ","Ѭ","Ѧ","Ѩ","Ѳ"];
		vowelUpper["Arabic"] = ["ـا","ـو","ـي","ـآ","ـة","ـى","ـڛ‎"];
		vowelUpper["Runic"] = vowel["Runic"];
		vowelUpper["Japanese"] = vowel["Japanese"];
		vowelUpper["ZALGO"] = ["À̷̡̨͢","Æ̧̛","E̢","I̶̵҉҉","O͢҉","U̸̧͟","Y̷͝҉"];
		
		roll20API.languageData = [];
		
		//Basic Languages
		pushLanguage("Unknown",6,"Common");
		pushLanguage("Common",0,"Common_old");
		pushLanguage("Draconic",0,"Draconic");
		pushLanguage("Druidic",5,"Sylvan");
		pushLanguage("Undercommon",11,"Elven");
		
		pushLanguage("Arabic",0,"Arabic");
		pushLanguage("Cyrillic",0,"Cyrillic");
		pushLanguage("Runic",0,"Runic");
		pushLanguage("Slavic",3,"Cyrillic");
		pushLanguage("Japanese",0,"Japanese");
		
		//Basic race Languages
		pushLanguage("Dwarven",0,"Dwarven");
		pushLanguage("Elven",0,"Elven");
		pushLanguage("Gnome",0,"Gnome");
		pushLanguage("Halfling",3,"Gnome");
		pushLanguage("Tengu",3,"Japanese");
		pushLanguage("Sylvan",0,"Sylvan");
		
		//Human region Languages
		pushLanguage("Hallit",7,"Runic");
		pushLanguage("Kelish",15,"Elven");
		pushLanguage("Osiriani",0,"Arabic");
		pushLanguage("Polyglot",3,"Common");
		pushLanguage("Shadowtongue",3,"Infernal");
		pushLanguage("Shoanti",7,"Elven");
		pushLanguage("Skald",0,"Runic");
		pushLanguage("Tien",12,"Celestial");
		pushLanguage("Varisian",11,"Gnome");
		pushLanguage("Vudrani",19,"Elven");
		
		//Planar Languages
		pushLanguage("Celestial",0,"Celestial");
		pushLanguage("Abyssal",7,"Infernal");
		pushLanguage("Infernal",0,"Infernal");
		
		pushLanguage("Auran",7,"Celestial");
		pushLanguage("Aquan",7,"Sylvan");
		pushLanguage("Aboleth",13,"Sylvan");
		pushLanguage("Ignan",11,"Infernal");
		pushLanguage("Terran",15,"Dwarven");
		
		//Monster Languages
		pushLanguage("Boggard",21,"Dwarven");
		pushLanguage("Cyclops",3,"Dwarven");
		pushLanguage("Darkfolk",11,"Common");
		pushLanguage("D’ziriak",21,"Infernal");
		pushLanguage("Giant",5,"Dwarven");
		pushLanguage("Gnoll",11,"Common");
		pushLanguage("Goblin",3,"Orc");
		pushLanguage("Grippli",11,"Sylvan");
		pushLanguage("Necril",11,"Arabic");
		pushLanguage("Orc",11,"Orc");
		pushLanguage("Orvian",11,"Dwarven");
		pushLanguage("Protean",11,"Draconic");
		pushLanguage("Sphinx",6,"Arabic");
		
		//Other
		pushLanguage("Thieves'Cant",1,"Common_old");
		pushLanguage("Aklo",1,"ZALGO"); //This ancient tongue is spoken by strange eldritch entities, and certain ancient beings.
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
		//Check if it is character of GM speaks. If no, throw error
		if(findObjs({ _type: "character", name: msg.who }).length === 0 && !playerIsGM(msg.playerid)){
			sendChat("Languages Script", "/w " + msg.who + " Only characters or GMs may speak character languages");
			return;
		}
		var sentence = msg.content.substr(2);
		if(sentence.length === 0) {
			sendChat("Languages Script", "/w " + msg.who + " You didn't say anything.");
			return;
		}
		var allPlayers = findObjs({_type: "player"}, {caseInsensitive: true});
		var speakingas = "";
		var languages = "";
		var spokenByIds = [];
		//For each player...
		_.each(allPlayers, function(p) {
			//if player is online...
			if(p.get("_online")){
				speakingas = p.get("speakingas");
				//If player speaks as character...
				if(speakingas !== undefined){
					if(speakingas !== "") {
						var languages = getAttrByName(speakingas.split("|")[1], languageTag);
						//If character knows any languages...
						if(languages !== undefined){
							languages.split(separators).some(function(lang) {
								//And speaks the one we need...
								if(lang.toUpperCase() == whichLanguage.toUpperCase()){
									//Add character to list of chars who can understand language.
									spokenByIds.push(p.get("id"));
									return true;
								}
								else {
									return false;
								}
							});
						}
					}
				}
			}
		});
		//Test if speaker can speak that language (or if he is a GM)
		var isSpeakerFluent = true;
		if (spokenByIds.indexOf(msg.playerid) === -1 && !playerIsGM(msg.playerid)) {
			isSpeakerFluent = false;
			sendChat(msg.who, "/w " + msg.who + " You pretend to speak " + whichLanguage + ".");
		}
		//Sends gibberish to chat
		sendChat(msg.who, gibberishFunction(characters,sentence));
		if (isSpeakerFluent) {
			//whispers meaning of gibberish to ones who can understand language
			sendChat("Languages Script", "/w gm " + msg.who + " said '" + sentence + "' in " + whichLanguage);
			_.each(allPlayers,function(p) {
				if (spokenByIds.indexOf(p.get("id")) > -1) {
					sendChat(msg.who, "/w " + p.get("_displayname") + " '" + sentence +"' in " + whichLanguage + ".");
				}
			});
		}
		else {
			//ones who can understand language gets that speaker is pretending
			sendChat("Languages Script", "/w gm " + msg.who + " **pretended** to say '" + sentence + "' in " + whichLanguage);
			_.each(allPlayers,function(p) {
				if (spokenByIds.indexOf(p.get("id")) > -1) {
					sendChat(msg.who, "/w " + p.get("_displayname") + " " + msg.who + " pretends to speak in " + whichLanguage + ".");
				}
			});
		}
	},
	
	gibberishFunction = function(language,sentence) {
		//Polyfill - implementation of arr.findIndex method
		var directChangeFromArray = numbers["Common_old"].concat(symbols["Common_old"]);
		var directChangeToArray = numbers[language].concat(symbols[language]);
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
					var allLetters = consonant[language].concat(vowel[language]);
					var allLettersUpper = consonantUpper[language].concat(vowelUpper[language]);
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
			if (alphabets.indexOf(parentlanguage.toLowerCase()) > -1) {
				//first letter to upper case, other to lower
				parentlanguage = parentlanguage[0].toUpperCase() + parentlanguage.substring(1).toLowerCase();
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