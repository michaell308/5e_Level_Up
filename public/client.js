console.log('Client-side code running');
//allows /r/n on given element
//document.getElementById("outputHeader").setAttribute('style', 'white-space: pre-line;');
//document.getElementById("classOutput").setAttribute('style', 'white-space: pre-line;');
//document.getElementById("eldritchInvocations").setAttribute('style', 'white-space: pre-line;');
document.getElementById("subClass").setAttribute('style', 'white-space: pre-line;');

var lastClickedButton = null;

//$('.classButton').css('background-image', 'url(SorcererButton.png)');
//$('.classButton').css('background-image', 'url(' + this.value + 'Button.png)');
$('.classButton').css('background-image', function(index,currentvalue) {
	return 'url(' + this.value + 'Button.png)';
});

$('.classButton').click(function(e) {
	//update hidden class input when any class button is clicked 
	document.getElementById('classInput').value = this.value;
	if (lastClickedButton !== null) {
		lastClickedButton.style.backgroundImage = 'url(' + lastClickedButton.value + 'Button.png)';
		lastClickedButton.style.color = '#cea564'; 
	}
	lastClickedButton = this;
	//this.style.backgroundColor = 'red';
	//this.style.background = "linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,1)), url(" + this.value + "Button.png) no-repeat center";
	this.style.background = "";
	this.style.color = "black";
	//this.style.color = 'white';
});

$('.staticFeature').on('click','.featureButton',function() {
	console.log("hey");
	if ($(this).parent().children().length === 1) { //first click on feature
		console.log("a button was clicked!");
		var data = {};
		data.feature = this.value;
		var savedThis = $(this);
		var savedThis2 = this;
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: '/',						
	        success: function(data) { //on successful post, data contains anything sent back from server
	        	//create description div and animate text top to bottom
            	var descriptionDiv = document.createElement("DIV");
            	descriptionDiv.setAttribute('style', 'white-space: pre-line;');
				descriptionDiv.hidden = true;
				descriptionDiv.innerHTML = data.description;
				savedThis.parent().append(descriptionDiv);
				console.log(savedThis.children.length);
				//console.log(savedThis.children[1]);
			//	savedThis.children().removeClass();
			//	savedThis.children().addClass('up');
				//savedThis2.children[1].className = "up";
				$(descriptionDiv).animate({height: 'toggle'});
	        }
    	});

	}
	else { //animate existing description div
		$(this).parent().children("div").animate({height: 'toggle'});
	}
});

$('#client-form').on('submit', function (event) {
    event.preventDefault(); //prevent form from refreshing page
    var classInput = document.getElementById('classInput').value;
    var levelInput = document.getElementById('levelInput').value;
    

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
            if (typeof data  === 'string') {
            	document.getElementById("error").textContent = data; //write error
            	//reset all fields
            	document.getElementById("outputHeader").textContent = "";
            	document.getElementById("hp").textContent = "";
            	document.getElementById("maxHitDie").textContent = "";
            	document.getElementById("profBonus").textContent = "";
            	document.getElementById("spellSaveDC").textContent = "";
            	//$("#features").empty();
            	document.getElementById("liFeature").textContent = "";
            	//$("#spellSlotTable").empty();
            	document.getElementById("liSpellSlot").textContent = "";
            	document.getElementById("spellAttackMod").textContent = "";
            	document.getElementById("cantripsKnown").textContent = "";
            	document.getElementById("spellsKnown").textContent = "";
				document.getElementById("classOutput").textContent = "";
				document.getElementById("classOutput2").textContent = "";
				document.getElementById("classOutput3").textContent = "";
				//$("#eldritchInvocations").empty();
				document.getElementById("liInvocation").textContent = "";
				document.getElementById("subClass").textContent = "";
            }
            else {
            	document.getElementById("outputHeader").textContent = "To Become a Level " + data.level + " " + data.class + ": ";
            	document.getElementById("error").textContent = "";
	            //HP
	            document.getElementById("hp").innerHTML = "<b>HP:</b> Roll a d" + data.hit_die + ". Your hp increases by (the number you rolled) + (your constitution modifier)";
	            //Max hit die
	            document.getElementById("maxHitDie").innerHTML = "<b>Hit Die:</b> The maximum number of hit die you have is now " + data.level;
	            //Proficiency bonus
	            var profBonus = document.getElementById("profBonus"); 
	            profBonus.textContent = ""; //reset proficiency bonus
	            var is_pbi = data.is_pbi;
	            if (is_pbi === 1) {
	            	profBonus.innerHTML = "<b>Proficiency bonus:</b> Your proficiency bonus increases to +" + data.prof_bonus;
	            }
	            //Features
	            //$("#features").empty(); //reset features
	            var liFeature = document.getElementById("liFeature");
	            liFeature.textContent = "";
	            var featuresArray = data.features.split(',');
	            if (featuresArray.length > 0 && featuresArray[0] !== "") {
	            	console.log("hello");
	            	liFeature.innerHTML = "<b>Features:</b>";
	            	var featureUL = document.createElement("UL");
	            	liFeature.appendChild(featureUL);
		          	//document.getElementById("liFeature").innerHTML = "Features:" +
		          	//document.getElementById("liFeature").innerHTML;
		          //var featureUL = document.getElementById("features");
		            //featureUL.textContent = "Features:";
		            for (var i = 0; i < featuresArray.length; i++) {
		              var node = document.createElement("LI");
		              var button = document.createElement("BUTTON");
		              var featureText = featuresArray[i];
		              var featureIdx = featureText.indexOf("(");
		              if (featureIdx !== -1) {
		              	featureText = featureText.substring(0,featureIdx-1);
		              }
		              /*var iEle = document.createElement("I");
		              iEle.className = "arrow down";
		              var textnode = document.createTextNode(featureText + "  ");
		              button.appendChild(textnode);
		              button.appendChild(iEle);*/
		              button.innerHTML = featureText + "&nbsp;&nbsp;" + "<i class='down'>";
		              button.type = "button";
		              button.className = "featureButton text";
		              button.value = featuresArray[i];
		              node.appendChild(button); 
					  featureUL.appendChild(node);
					}					
				}
				//Spell Slots Table
				//$("#spellSlotTable").empty(); //reset spell slots table
				var userClass = data.class;
				var spellSlotArray = data.spell_slots.split(",");
				var spellSlotArrayLength = spellSlotArray.length;
				var liSpellSlot = document.getElementById("liSpellSlot");
	            liSpellSlot.textContent = "";
				if (spellSlotArrayLength > 0 && spellSlotArray[0] !== "" && userClass !== "Warlock") {
					liSpellSlot.innerHTML = "<b>Spell Slots per Spell Level:</b>";
					//document.getElementById("liSSTable").innerHTML = "Spell Slot Table:" +
					//document.getElementById("liSSTable").innerHTML;
					var tableSS = document.createElement("TABLE");
					//tableSS.style.width = "50%";
					tableSS.className = "spellSlotTable";
	            	liSpellSlot.appendChild(tableSS);
					//var table = document.getElementById("spellSlotTable");
					//table.textContent = "Spell Slot Table:";
					var headerRow = document.createElement("TR");
					var dataRow = document.createElement("TR");
					for (var i = 1; i <= 9; i++) {
						var newHeader = document.createElement("TH");
						var suffix = "th";
						if (i == 1) {
							suffix="st";
						}
						else if (i == 2) {
							suffix="nd";
						}
						else if (i == 3) {
							suffix="rd";
						}
						newHeader.textContent = i + suffix;
						headerRow.appendChild(newHeader);

						var newCell = document.createElement("TD");
						if (i-1 < spellSlotArrayLength) {
							newCell.textContent = spellSlotArray[i-1];
						}
						else {
							newCell.textContent = "-";
						}
						dataRow.appendChild(newCell);
					}

					tableSS.appendChild(headerRow);
					tableSS.appendChild(dataRow);
				}
				//Spell Save DC and Spell Attack Modifier
				var stat_modifier = data.stat_modifier;
				var spellSaveDC = document.getElementById("spellSaveDC");
				var spellAttackMod = document.getElementById("spellAttackMod");
				spellSaveDC.textContent = ""; //reset spell save dc
				spellAttackMod.textContent = ""; //reset spell attack modifier
				if (stat_modifier !== "" && is_pbi === 1) {
					spellSaveDC.innerHTML = "<b>Update Spell Save DC</b> = 8 + " + data.prof_bonus +" + " + stat_modifier +" modifier";
					spellAttackMod.innerHTML = "<b>Update Spell Attack Modifier</b> = " + data.prof_bonus +" + " + stat_modifier +" modifier";
				}
				//Cantrips known
				var cantrips_known = data.cantrips_known;
				var cantripsKnown = document.getElementById("cantripsKnown");
				cantripsKnown.textContent = ""; //reset cantrips known
				if (cantrips_known !== undefined && cantrips_known !== null) {
					cantripsKnown.innerHTML = "<b>Cantrips Known:</b> You now know " + cantrips_known + " cantrips";
				}
				//Spells known
				var spells_known = data.spells_known;
				var spellsKnown = document.getElementById("spellsKnown");
				spellsKnown.textContent = ""; //reset spells known
				if (spells_known !== undefined && spells_known !== null) {
					spellsKnown.innerHTML = "<b>Spells Known:</b> You now know " + spells_known + " spells";
				}
				//Class output
				var classOutput = document.getElementById("classOutput");
				classOutput.textContent = ""; //reset class output
				var classOutput2 = document.getElementById("classOutput2");
				classOutput2.textContent = ""; //reset class output 2
				var classOutput3 = document.getElementById("classOutput3");
				classOutput3.textContent = ""; //reset class output 2
				document.getElementById("liInvocation").textContent = "";
				//$(".staticFeature").empty(); //reset eldritch invocations
				//Barbarian
				if (userClass === "Barbarian") {
					var num_rages = data.num_rages;
					if (num_rages !== null) {
						if (num_rages === 99) {
							num_rages = "Unlimited";
						}
						classOutput.innerHTML = "<b>Number of Rages:</b> You now have " + num_rages + " rages";
					}
					var rage_damage = data.rage_damage;
					if (rage_damage !== null) {
						classOutput.innerHTML += "<b>Rage Damage:</b> Your rage damage increases to +" + rage_damage;
					}
				}
				//Bard
				else if (userClass === "Bard") {
					var inspiration_die = data.inspiration_die;
					if (inspiration_die !== null) {
						classOutput.innerHTML = "<b>Inspiration Die:</b> Your inspiration die is now a d" + inspiration_die;
					}
				}
				//Monk
				else if (userClass === "Monk") {
					var ki_points = data.level;
					classOutput.innerHTML = "<b>Ki Points:</b> You now have " + ki_points + " ki points";
					var martial_arts_damage = data.martial_arts_damage;
					if (martial_arts_damage !== null) {
						classOutput2.innerHTML = "<b>Martial Arts Damage:</b> Your martial arts damage is now 1d" + martial_arts_damage;
					}
					var unarmored_movement = data.unarmored_movement;
					if (unarmored_movement !== null) {
						classOutput2.innerHTML = "<b>Unarmored Movement:</b> Your unarmored movement increases to +" + unarmored_movement + " ft.";
					}
					if (is_pbi === 1) {
						classOutput3.innerHTML = "<b>Update Ki Save DC</b> = 8 + " + data.prof_bonus + " + your Wisdom modifier";
					}
				}
				//Rogue
				else if (userClass === "Rogue") {
					var num_sneak_attack_die = data.num_sneak_attack_die;
					if (num_sneak_attack_die !== null) {
						classOutput.innerHTML = "<b>Sneak Attack:</b> Your sneak attack now does " + num_sneak_attack_die + "d6 damage"; 
					}
				}
				//Sorcerer
				else if (userClass === "Sorcerer") {
					var sorcerer_points = data.level;
					classOutput.innerHTML = "<b>Sorcerer Points:</b> You now have " + sorcerer_points + " sorcerer points";
				}
				//Warlock
				else if (userClass === "Warlock") {
					var spell_slots = data.spell_slots;
					if (spell_slots !== null && spell_slots !== "") {
						var num_spell_slots = spell_slots.split(",")[0];
						classOutput.innerHTML = "<b>Number of Spell Slots:</b> You now have " + num_spell_slots + " spell slots"; 
					}
					var slot_level = data.slot_level;
					if (slot_level !== null) {
						classOutput.innerHTML += "<b>Slot Level:</b> Your slot level has increased to " + slot_level + " level";
					}
					var invocations_known = data.invocations_known;
					if (invocations_known !== null) {
						classOutput2.innerHTML = "<b>Invocations Known:</b> You now know " + invocations_known + " invocations";
					}
					//document.getElementById("liInvocation").innerHTML = "You can choose one of the invocations you know and replace it with another invocation that you could learn at this level." +
					//document.getElementById("liInvocation").innerHTML;
					var liInvocation = document.getElementById("liInvocation");
					//liInvocation.style.display = "inline";
					liInvocation.innerHTML = "<b>Eldritch Invocations:</b> You can choose one of the invocations you know and replace it with another. If an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.";
					var eldritchInvocationUL = document.createElement("UL");
					eldritchInvocationUL.className = "invocationTable";
					//eldritchInvocationUL.className = "staticFeature";
					liInvocation.appendChild(eldritchInvocationUL);
					//liInvocation.appendChild(eldritchInvocationUL);
					//classOutput.textContent += "You can choose one of the invocations you know and replace it with another invocation that you could learn at this level.";
					var noPrereq = ["Armor of Shadows","Beast Speech","Beguiling Influence",
					"Devil's Sight","Eldritch Sight","Eyes of the Rune Keeper",
					"Fiendish Vigor","Gaze of Two Minds","Mask of Many Faces",
					"Misty Visions","Thief of Five Fates"];
					var ebCantrip = ["Agonizing Blast","Eldritch Spear","Repelling Blast"];
					var pactOfTome = "Book of Ancient Secrets";
					var pactOfChain = "Voice of the Chain Master";
					var fifthLevel = ["Mire the Mind","One with Shadows","Sign of Ill Omen"];
					var fifthLevelPactOfBlade = "Thirsting Blade";
					var seventhLevel = ["Bewitching Whispers","Dreadful Word","Sculptor of Flesh"];
					var ninethLevel = ["Ascendant Step","Minions of Chaos",
					"Otherworldly Leap","Whispers of the Grave"];
					var twelvethLevelPactOfBlade = "Lifedrinker";
					var fifteenthLevel = ["Master of Myriad Forms","Visions of Distant Realms","Witch Sight"];
					var fifteenthLevelPactOfChain = "Chains of Carceri";

					//var eldritchInvocationUL = document.getElementById("eldritchInvocations");
					eldritchInvocationUL.appendChild(document.createElement("BR"));
					eldritchInvocationUL.appendChild(document.createElement("BR"));
					createDivUnderUL(eldritchInvocationUL,"No Prerequisites:");
					for (var i = 0; i < noPrereq.length; i++) {
						createListButton(eldritchInvocationUL, noPrereq[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: eldritch blast cantrip");
					for (var i = 0; i < ebCantrip.length; i++) {
						createListButton(eldritchInvocationUL, ebCantrip[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: Pact of the Tome feature");
					createListButton(eldritchInvocationUL, pactOfTome);
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: Pact of the Chain feature");
					createListButton(eldritchInvocationUL, pactOfChain);
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 5th level");
					for (var i = 0; i < fifthLevel.length; i++) {
						createListButton(eldritchInvocationUL, fifthLevel[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 5th level, Pact of the Blade feature");
					createListButton(eldritchInvocationUL, fifthLevelPactOfBlade);
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 7th level");
					for (var i = 0; i < seventhLevel.length; i++) {
						createListButton(eldritchInvocationUL, seventhLevel[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 9th level");
					for (var i = 0; i < ninethLevel.length; i++) {
						createListButton(eldritchInvocationUL, ninethLevel[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 12th level, Pact of the Blade feature");
					createListButton(eldritchInvocationUL, twelvethLevelPactOfBlade);
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 15th level");
					for (var i = 0; i < fifteenthLevel.length; i++) {
						createListButton(eldritchInvocationUL, fifteenthLevel[i]);
					}
					eldritchInvocationUL.appendChild(document.createElement("BR"));

					createDivUnderUL(eldritchInvocationUL,"Prerequisite: 15th level, Pact of the Chain feature");
					createListButton(eldritchInvocationUL, fifteenthLevelPactOfChain);
				}
				var subClassDoc = document.getElementById("subClass");
				subClassDoc.textContent = "";
				if (data.subclass !== null) {
					subClassDoc.innerHTML += data.subclass_header + "<br>";
					subClassDoc.innerHTML += data.subclass;
				}
			}
			document.getElementById("output").style.visibility = "visible";
        }
	});
});

function createListButton(ul, buttonName) {
	var node = document.createElement("LI");
	var button = document.createElement("BUTTON");
	//var textnode = document.createTextNode(buttonName);
	//button.appendChild(textnode);
	button.innerHTML = buttonName + "&nbsp;&nbsp;" + "<i class='arrow down'>";
	button.type = "button";
	button.className = "featureButton";
	button.className += " text";
	button.value = buttonName;
	node.appendChild(button); 
	ul.appendChild(node);
}

function createDivUnderUL(ul, text) {
	var newDiv = document.createElement("DIV");
	newDiv.innerHTML = "<b>" + text + "</b>";
	ul.appendChild(newDiv);
}