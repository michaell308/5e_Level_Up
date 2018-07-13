console.log('Client-side code running');
//allows /r/n on given element
document.getElementById("output").setAttribute('style', 'white-space: pre;');
document.getElementById("classOutput").setAttribute('style', 'white-space: pre;');


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
				descriptionDiv.textContent = data.description;
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
    document.getElementById("output").textContent = "Level:" + levelInput + "\r\nClass:" + classInput;
    

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
	            if (featuresArray.length > 0 && featuresArray[0] != "") {
		          	var featureUL = document.getElementById("features");
		            featureUL.textContent = "Features:";
		            for (var i = 0; i < featuresArray.length; i++) {
		              var node = document.createElement("LI");
		              var button = document.createElement("BUTTON");
		              var textnode = document.createTextNode(featuresArray[i]);
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
				if (spellSlotArrayLength > 0 && userClass !== "Warlock") {
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
				var is_asi = data.is_asi;
				var stat_modifier = data.stat_modifier;
				var spellSaveDC = document.getElementById("spellSaveDC");
				var spellAttackMod = document.getElementById("spellAttackMod");
				spellSaveDC.textContent = ""; //reset spell save dc
				spellAttackMod.textContent = ""; //reset spell attack modifier
				if (stat_modifier !== null && (is_asi === 1 || is_pbi === 1)) {
					spellSaveDC.textContent = "Update Spell Save DC = 8 + " + data.prof_bonus +" + " + stat_modifier +" modifier";
					spellAttackMod.textContent = "Update Spell Attack Modifier = " + data.prof_bonus +" + " + stat_modifier +" modifier";
				}
				//Cantrips known
				var cantrips_known = data.cantrips_known;
				var cantripsKnown = document.getElementById("cantripsKnown");
				cantripsKnown.textContent = ""; //reset cantrips known
				if (cantrips_known !== null) {
					cantripsKnown.textContent = "You now know " + cantrips_known + " cantrips";
				}
				//Spells known
				var spells_known = data.spells_known;
				var spellsKnown = document.getElementById("spellsKnown");
				spellsKnown.textContent = ""; //reset spells known
				if (spells_known !== null) {
					spellsKnown.textContent = "You now know " + spells_known + " spells";
				}
				//Class output
				var classOutput = document.getElementById("classOutput");
				classOutput.textContent = ""; //reset class output
				//Barbarian
				if (userClass === "Barbarian") {
					var num_rages = data.num_rages;
					if (num_rages !== null) {
						classOuput.textContent = "Number of rages is now = " + num_rages + "\r\n";
					}
					var rage_damage = data.rage_damage;
					if (rage_damage !== null) {
						classOuput.textContent += "Rage damage is now = " + rage_damage;
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
					classOuput.textContent = "You now have " + ki_points + " ki points" + "\r\n";
					var martial_arts_damage = data.martial_arts_damage;
					if (martial_arts_damage !== null) {
						classOuput.textContent += "Your martial arts damage is now 1d" + martial_arts_damage + "\r\n";
					}
					var unarmored_movement = data.unarmored_movement;
					if (unarmored_movement !== null) {
						classOuput.textContent += "Your unarmored_movement is now +" + unarmored_movement + "ft."
					}
				}
				//Rogue
				else if (userClass === "Rogue") {
					var num_sneak_attack_die = data.num_sneak_attack_die;
					if (num_sneak_attack_die !== null) {
						classOuput.textContent = "Your sneak attack now does " + num_sneak_attack_die + "d6 damage"; 
					}
				}
				//Sorcerer
				else if (userClass === "Sorcerer") {
					var sorcerer_points = data.level;
					classOuput.textContent = "You now have " + sorcerer_points + " sorcerer points";
				}
				//Warlock
				else if (userClass === "Warlock") {
					var spell_slots = data.spell_slots;
					if (spell_slots !== null) {
						var num_spell_slots = spell_slots.split(",")[0];
						classOuput.textContent = "Number of spell slots " + num_spell_slots + "\r\n"; 
					}
					var slot_level = data.slot_level;
					if (slot_level !== null) {
						classOuput.textContent += "Slot Level: " + slot_level + "th\r\n";
					}
					var invocations_known = data.invocations_known;
					if (invocations_known !== null) {
						classOuput.textContent += "Invocations Known: " + invocations_known;
					}
				}
			}
        }
	});
});