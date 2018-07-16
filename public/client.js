console.log('Client-side code running');
//allows /r/n on given element
document.getElementById("output").setAttribute('style', 'white-space: pre;');
document.getElementById("classOutput").setAttribute('style', 'white-space: pre;');
document.getElementById("eldritchInvocations").setAttribute('style', 'white-space: pre;');


$('.classButton').click(function(e) {
	//update hidden class input when any class button is clicked 
	document.getElementById('classInput').value = this.value;
});

$('.staticFeature').on('click','.featureButton',function() {
	if ($(this).parent().children().length === 1) { //first click on feature
		var data = {};
		data.feature = this.value;
		var savedThis = $(this);
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
    document.getElementById("output").textContent = "Level:" + (parseInt(levelInput)+1) + "\r\nClass:" + classInput;
    

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
            	document.getElementById("hp").textContent = "";
            	document.getElementById("maxHitDie").textContent = "";
            	document.getElementById("profBonus").textContent = "";
            	document.getElementById("spellSaveDC").textContent = "";
            	$("#features").empty();
            	$("#spellSlotTable").empty();
            	document.getElementById("spellAttackMod").textContent = "";
            	document.getElementById("cantripsKnown").textContent = "";
            	document.getElementById("spellsKnown").textContent = "";
				document.getElementById("classOutput").textContent = "";
				$("#eldritchInvocations").empty();
            }
            else {
            	document.getElementById("error").textContent = "";
	            //HP
	            document.getElementById("hp").textContent = "Roll a d" + data.hit_die + ". Your hp increases by the number you rolled + your constitution modifier";
	            //Max hit die
	            document.getElementById("maxHitDie").textContent = "The maximum number of hit die you have is now " + data.level;
	            //Proficiency bonus
	            var profBonus = document.getElementById("profBonus"); 
	            profBonus.textContent = ""; //reset proficiency bonus
	            var is_pbi = data.is_pbi;
	            if (is_pbi === 1) {
	            	profBonus.textContent = "Your proficiency bonus increases to +" + data.prof_bonus;
	            }
	            //Features
	            $("#features").empty(); //reset features
	            var featuresArray = data.features.split(',');
	            if (featuresArray.length > 0 && featuresArray[0] !== "") {
		          	var featureUL = document.getElementById("features");
		            featureUL.textContent = "Features:";
		            for (var i = 0; i < featuresArray.length; i++) {
		              var node = document.createElement("LI");
		              var button = document.createElement("BUTTON");
		              var featureText = featuresArray[i];
		              var featureIdx = featureText.indexOf("(");
		              if (featureIdx !== -1) {
		              	featureText = featureText.substring(0,featureIdx-1);
		              }
		              var textnode = document.createTextNode(featureText);
		              button.appendChild(textnode);
		              button.type = "button";
		              button.className = "featureButton";
		              button.value = featuresArray[i];
		              node.appendChild(button); 
					  featureUL.appendChild(node);
					}
				}
				//Spell Slots Table
				$("#spellSlotTable").empty(); //reset spell slots table
				var userClass = data.class;
				var spellSlotArray = data.spell_slots.split(",");
				var spellSlotArrayLength = spellSlotArray.length;
				if (spellSlotArrayLength > 0 && spellSlotArray[0] !== "" && userClass !== "Warlock") {
					var table = document.getElementById("spellSlotTable");
					table.textContent = "Spell Slot Table";
					var headerRow = document.createElement("TR");
					var dataRow = document.createElement("TR");
					for (var i = 1; i <= 9; i++) {
						var newHeader = document.createElement("TH");
						newHeader.textContent = "Spell slot " + i;
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

					table.appendChild(headerRow);
					table.appendChild(dataRow);
				}
				//Spell Save DC and Spell Attack Modifier
				var stat_modifier = data.stat_modifier;
				var spellSaveDC = document.getElementById("spellSaveDC");
				var spellAttackMod = document.getElementById("spellAttackMod");
				spellSaveDC.textContent = ""; //reset spell save dc
				spellAttackMod.textContent = ""; //reset spell attack modifier
				if (stat_modifier !== "" && is_pbi === 1) {
					spellSaveDC.textContent = "Update Spell Save DC = 8 + " + data.prof_bonus +" + " + stat_modifier +" modifier";
					spellAttackMod.textContent = "Update Spell Attack Modifier = " + data.prof_bonus +" + " + stat_modifier +" modifier";
				}
				//Cantrips known
				var cantrips_known = data.cantrips_known;
				var cantripsKnown = document.getElementById("cantripsKnown");
				cantripsKnown.textContent = ""; //reset cantrips known
				if (cantrips_known !== undefined && cantrips_known !== null) {
					cantripsKnown.textContent = "You now know " + cantrips_known + " cantrips";
				}
				//Spells known
				var spells_known = data.spells_known;
				var spellsKnown = document.getElementById("spellsKnown");
				spellsKnown.textContent = ""; //reset spells known
				if (spells_known !== undefined && spells_known !== null) {
					spellsKnown.textContent = "You now know " + spells_known + " spells";
				}
				//Class output
				var classOutput = document.getElementById("classOutput");
				classOutput.textContent = ""; //reset class output
				$("#eldritchInvocations").empty(); //reset eldritch invocations
				//Barbarian
				if (userClass === "Barbarian") {
					var num_rages = data.num_rages;
					if (num_rages !== null) {
						if (num_rages === 99) {
							num_rages = "Unlimited";
						}
						classOutput.textContent = "Number of rages is now = " + num_rages + "\r\n";
					}
					var rage_damage = data.rage_damage;
					if (rage_damage !== null) {
						classOutput.textContent += "Rage damage is now +" + rage_damage;
					}
				}
				//Bard
				else if (userClass === "Bard") {
					var inspiration_die = data.inspiration_die;
					if (inspiration_die !== null) {
						classOutput.textContent = "Your inspiration die is now a d" + inspiration_die + "\r\n";
					}
				}
				//Monk
				else if (userClass === "Monk") {
					var ki_points = data.level;
					classOutput.textContent = "You now have " + ki_points + " ki points" + "\r\n";
					var martial_arts_damage = data.martial_arts_damage;
					if (martial_arts_damage !== null) {
						classOutput.textContent += "Your martial arts damage is now 1d" + martial_arts_damage + "\r\n";
					}
					var unarmored_movement = data.unarmored_movement;
					if (unarmored_movement !== null) {
						classOutput.textContent += "Your unarmored_movement is now +" + unarmored_movement + "ft.\r\n"
					}
					if (is_pbi === 1) {
						classOutput.textContent += "Update Ki save DC = 8 + " + data.prof_bonus + " + your Wisdom modifier";
					}
				}
				//Rogue
				else if (userClass === "Rogue") {
					var num_sneak_attack_die = data.num_sneak_attack_die;
					if (num_sneak_attack_die !== null) {
						classOutput.textContent = "Your sneak attack now does " + num_sneak_attack_die + "d6 damage"; 
					}
				}
				//Sorcerer
				else if (userClass === "Sorcerer") {
					var sorcerer_points = data.level;
					classOutput.textContent = "You now have " + sorcerer_points + " sorcerer points";
				}
				//Warlock
				else if (userClass === "Warlock") {
					var spell_slots = data.spell_slots;
					if (spell_slots !== null && spell_slots !== "") {
						var num_spell_slots = spell_slots.split(",")[0];
						classOutput.textContent = "Number of spell slots " + num_spell_slots + "\r\n"; 
					}
					var slot_level = data.slot_level;
					if (slot_level !== null) {
						classOutput.textContent += "Slot Level: " + slot_level + "\r\n";
					}
					var invocations_known = data.invocations_known;
					if (invocations_known !== null) {
						classOutput.textContent += "Invocations Known: " + invocations_known + "\r\n";
					}
					classOutput.textContent += "\r\nYou can choose one of the invocations you know and replace it with another invocation that you could learn at this level.";
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

					var eldritchInvocationUL = document.getElementById("eldritchInvocations");
					eldritchInvocationUL.textContent = "Eldritch Invocations:\r\nIf an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.";
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
			}
        }
	});
});

function createListButton(ul, buttonName) {
	var node = document.createElement("LI");
	var button = document.createElement("BUTTON");
	var textnode = document.createTextNode(buttonName);
	button.appendChild(textnode);
	button.type = "button";
	button.className = "featureButton";
	button.value = buttonName;
	node.appendChild(button); 
	ul.appendChild(node);
}

function createDivUnderUL(ul, text) {
	var newDiv = document.createElement("DIV");
	newDiv.textContent = text;
	ul.appendChild(newDiv);
}