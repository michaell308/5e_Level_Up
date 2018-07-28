//run when the document is ready
jQuery(document).ready(function(){
	//animate scroll opening up
	$("#middleScroll").velocity("slideDown", { 
    duration: 500,
    complete: function() { //ensure element is shown
    	document.getElementById("middleScroll").style.display = "block";
    }
	});
});

//show background image for class button based on its value (Barbarian, Bard, etc.)
$('.classButton').css('background-image', function(index,currentvalue) {
	return 'url(images/' + this.value + 'Button.png)';
});

var lastClickedClassButton = null;
$('.classButton').click(function(e) {
	//update hidden class input when any class button is clicked 
	document.getElementById('classInput').value = this.value;

	if (lastClickedClassButton !== null) {
		//reset button image and text color to initial values
		lastClickedClassButton.style.backgroundImage = 'url(images/' + lastClickedClassButton.value + 'Button.png)';
		lastClickedClassButton.style.color = '#cea564'; 
	}
	lastClickedClassButton = this;
	//remove background image and set text color to black to indicate current selection
	this.style.background = ""; //remove background image
	this.style.color = "black";
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
            	if (savedThis.parent().children().length === 1) { //ensures text isn't duplicated on spam click
	            	descriptionDiv.setAttribute('style', 'white-space: pre-line;');
					descriptionDiv.style.display = "none";
					descriptionDiv.innerHTML = data.description;
					savedThis.parent().append(descriptionDiv);
					$(descriptionDiv).velocity("slideDown", { 
					    duration: 300,
					    complete: function() { //ensure element is shown
					    	descriptionDiv.style.display = "block";
					    }
					});
				}
	        }
    	});
	}
	else { //animate existing description div
		var descriptionDiv = $(this).parent().children("div");
		var isOpen = descriptionDiv.is(':visible'),
        slideDir = isOpen ? 'slideUp' : 'slideDown';
		descriptionDiv.velocity(slideDir, { 
		    duration: 300,
		    complete: function() { //ensure element is shown
		    	descriptionDiv.css("display", isOpen ? "none" : "block");
		    }
		});
	}
});

$('#client-form').on('submit', function (event) {
    event.preventDefault(); //prevent form from refreshing page
    
    var data = {};
	data.level = document.getElementById('levelInput').value;
	data.class = document.getElementById('classInput').value;
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/',						
        success: function(data) { //on successful post, data contains anything sent back from server
            successfulFormSubmit(data);
        }
	});
});

function successfulFormSubmit(data) {
	$('.reset').text(""); //reset all output text
    if (typeof data  === 'string') {
    	document.getElementById("error").textContent = data; //write error
    }
    else { //no error, so write output
	    ga('send', {
            'hitType' : 'event',
            'eventCategory' : 'Forms',
            'eventAction' : 'successful-level-up'
        });
    	//Ouput Header (Class/Level)
    	document.getElementById("outputHeader").innerHTML = "<hr>To Become a Level " + data.level + " " + data.class + ":";
        //HP
        var hpDoc = document.getElementById("hp")
       	hpDoc.innerHTML = "<b>HP:</b> Roll a d" + data.hit_die + 
        ". Your hp increases by (the number you rolled) + (your constitution modifier)\r\n";
        var hpButton = document.createElement("BUTTON");
        hpButton.innerHTML = "Note: Constitution modifier changes are retroactive <i class='down'>";
        hpButton.className = "featureButton note";
        var descriptionDiv = document.createElement("DIV");
		descriptionDiv.hidden = true;
		descriptionDiv.textContent = "If your Constitution modifier changes, your hit point maximum changes as well, as though you had the new modifier from 1st level. For example, if you raise your Constitution score when you reach 4th level and your Constitution modifier increases from +1 to +2, you adjust your hit point maximum as though the modifier had always been +2. So you add 3 hit points for your first three levels, and then roll your hit points for 4th level using your new modifier. Or if you're 7th level and some effect lowers your Constitution score so as to reduce your Constitution modifier by 1, your hit point maximum is reduced by 7.";
		hpDoc.appendChild(hpButton);
		hpDoc.appendChild(descriptionDiv);
        //Max hit die
        document.getElementById("maxHitDie").innerHTML = "<b>Hit Die:</b> The maximum number of hit die you have is now " + data.level;
        //Proficiency bonus
        var is_pbi = data.is_pbi;
        if (is_pbi === 1) {
        	document.getElementById("profBonus").innerHTML = "<b>Proficiency bonus:</b> Your proficiency bonus increases to +" + data.prof_bonus;
        }
        //Features
        var featureLI = document.getElementById("featureLI");
        var featuresArray = data.features.split(',');
        if (featuresArray.length > 0 && featuresArray[0] !== "") {
        	featureLI.innerHTML = "<b>Features:</b>";
        	var featureUL = document.createElement("UL");
        	featureLI.appendChild(featureUL);
            for (var i = 0; i < featuresArray.length; i++) {
            	createListButton(featureUL,featuresArray[i]);
			}					
		}
		//Spell Slots Table
		var userClass = data.class;
        writeSSTable(data.spell_slots,userClass);
		//Spell Save DC and Spell Attack Modifier
		var stat_modifier = data.stat_modifier;
		if (stat_modifier !== "" && is_pbi === 1) {
			document.getElementById("spellSaveDC").innerHTML = "<b>Update Spell Save DC</b> = 8 + " + data.prof_bonus +" + " + stat_modifier +" modifier";
			document.getElementById("spellAttackMod").innerHTML = "<b>Update Spell Attack Modifier</b> = " + data.prof_bonus +" + " + stat_modifier +" modifier";
		}
		//Cantrips known
		var cantrips_known = data.cantrips_known;
		if (cantrips_known !== undefined && cantrips_known !== null) {
			document.getElementById("cantripsKnown").innerHTML = "<b>Cantrips Known:</b> You now know " + cantrips_known + " cantrips";
		}
		//Spells known
		var spells_known = data.spells_known;
		if (spells_known !== undefined && spells_known !== null) {
			document.getElementById("spellsKnown").innerHTML = "<b>Spells Known:</b> You now know " + spells_known + " spells";
		}
		//Class output
		var classOutput = document.getElementById("classOutput");
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
				document.getElementById("classOutput2").innerHTML = "<b>Martial Arts Damage:</b> Your martial arts damage is now 1d" + martial_arts_damage;
			}
			var unarmored_movement = data.unarmored_movement;
			if (unarmored_movement !== null) {
				document.getElementById("classOutput2").innerHTML = "<b>Unarmored Movement:</b> Your unarmored movement increases to +" + unarmored_movement + " ft.";
			}
			if (is_pbi === 1) {
				document.getElementById("classOutput3").innerHTML = "<b>Update Ki Save DC</b> = 8 + " + data.prof_bonus + " + your Wisdom modifier";
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
				document.getElementById("classOutput2").innerHTML = "<b>Invocations Known:</b> You now know " + invocations_known + " invocations";
			}

			writeInvocations();
		}
		//Subclass
		if (data.subclass !== null) {
			document.getElementById("subClass").innerHTML = data.subclass_header + "<br><hr>" + data.subclass
			+ "<br><hr>" + "<b>Note:</b> Only subclasses in the SRD are included. For all subclasses, see the Player's Handbook";
		}
		//scroll down to the output
		$('#outputHeader').velocity("scroll", { duration: 400 });
	}
}

function writeSSTable(spellSlotData, userClass) {
	var spellSlotLI = document.getElementById("spellSlotLI");
	spellSlotLI.textContent = ""; //reset spell slots table
	var spellSlotArray = spellSlotData.split(",");
	var spellSlotArrayLength = spellSlotArray.length;
	if (spellSlotArrayLength > 0 && spellSlotArray[0] !== "" && userClass !== "Warlock") {
		spellSlotLI.innerHTML = "<b>Spell Slots per Spell Level:</b>";
		var tableSS = document.createElement("TABLE");
		tableSS.className = "spellSlotTable";
		spellSlotLI.appendChild(tableSS);
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
}

function createListButton(ul, buttonName) {
	var node = document.createElement("LI");
	var button = document.createElement("BUTTON");
	var buttonText = buttonName;
	var buttonIdx = buttonName.indexOf("(");
	if (buttonIdx !== -1) { //handle cases where features have same name, but diff description
		buttonText = buttonName.substring(0,buttonIdx-1);
	}
	button.innerHTML = buttonText + "&nbsp; <i class='arrow down'>";
	button.type = "button";
	button.className = "featureButton text";
	button.value = buttonName;
	node.appendChild(button); 
	ul.appendChild(node);
}

function createDivUnderUL(ul, text) {
	var newDiv = document.createElement("DIV");
	newDiv.innerHTML = "<b>" + text + "</b>";
	ul.appendChild(newDiv);
}

function writeInvocations() {
	var invocationLI = document.getElementById("invocationLI");
	invocationLI.innerHTML = "<b>Eldritch Invocations:</b> You can choose one of the invocations you know and replace it with another. If an eldritch invocation has prerequisites, you must meet them to learn it. You can learn the invocation at the same time that you meet its prerequisites. A level prerequisite refers to your level in this class.";
	var eldritchInvocationUL = document.createElement("UL");
	eldritchInvocationUL.className = "invocationTable";
	invocationLI.appendChild(eldritchInvocationUL);
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