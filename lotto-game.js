// TODOs
// - Get form data
// - Simulate selected choices
// - Update Cash balance
// - Store in database model

var cashEarned = 0;
var scenarios = [];
var randChoices = [];

// Returns array with ints from x to n
function iRange(x, n) {
  var a = [];
  var i = 0;
  for (i = x; i <= n; i++) {
    a.push(i);
  }
  return a;
}

// Recreated Python's print function for testing
function print(string_to_print) {
  console.log(string_to_print);
}

// Choice consists of a range of values that will result in a payout
function Choice(rangeIn, payoutIn) {
  this.range = rangeIn;
  this.payout = payoutIn.toFixed(2);
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.range.length - 1] + " then get $" + this.payout;
}

function randChoice() {
  this.range = iRange(6,10);
  this.payout = parseFloat(Math.random()*21).toFixed(2);
  this.last = this.range.length - 1;
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.last] + " then get $" + this.payout;
}

// A Scenario consists of two choices, and a chosen value set by the 'Choose' function
function Scenario(choiceA, choiceB) {
  this.choiceA = choiceA;
  this.choiceB = choiceB;
  this.choice = null;
}

// Returns result from rolling two 6-sided die
function Roll() {
  return [Math.floor(Math.random()*7), Math.floor(Math.random()*7)];
}

// Compares the result of the roll of two die to the chosen range
function Sim(choice, roll=Roll()) {
  return choice.range.includes(roll);
}

// Simulates an array of scenarios and returns the total payout
function SimScenarios(scenarios) {
  var payouts = 0;
  var roll = Roll();

  // TODO Add die faces to page
  var rollTotal = parseInt(roll[0]) + parseInt(roll[1]);

  for (i = 0; i < scenarios.length; i++) {
    print("\t Choice: " + scenarios[i].chosen.range + " for " +scenarios[i].chosen.payout);
    if(scenarios[i].chosen.range.includes(rollTotal)) {
      payouts = parseFloat(scenarios.pop().chosen.payout) + payouts;
    }
  }
  return parseFloat(payouts).toFixed(2);
}

// Simulates an array of choices and returns the total payout
function SimChoices(choices) {
  var payouts = 0;
  var roll = Roll();

  for (i = 0; i < choices.length; i++) {
    print("\t Choice: " + choices[i].range + " for " + choices[i].payout);
    if(Sim(choices[i], roll)) {
      payouts = parseFloat(choices.pop().payout) + payouts;
    }
  }
  return parseFloat(payouts).toFixed(2);
}

// Allows choice at index to be chosen
function Choose(index, choice) {

  if(choice === 0) {
    scenarios[index].chosen = scenarios[index].choiceA;
    document.getElementById(index + "-" + 0).style.background = "blue";
    document.getElementById(index + "-" + 1).style.background = "white";
  } else {
    scenarios[index].chosen = scenarios[index].choiceB;
    document.getElementById(index + "-" + 1).style.background = "blue";
    document.getElementById(index + "-" + 0).style.background = "white";
  }

}

// Populates and returns an array of choices from scenarios
// TODO Should alert the user if an option is not selected
function Validate(scenarios) {
  choices = [];
  for(i = 0; i < scenarios.length; i++) {
  	if(scenarios[i].chosen === null) {
  	  alert("Null choice found...");
  	  break;
  	} else {
      choices.push(scenarios[i].chosen);
    }
  }

  return choices;
}

// Resets page colors and chosen elements given an array of scenarios
function Reset(scenarios) {
  print(scenarios.length);
  for(i = 0; i < scenarios.length; i++) {
    scenarios[i].chosen = null;
    document.getElementById(i + "-" + 0).style.background = "white";
    document.getElementById(i + "-" + 1).style.background = "white";
  }

}

// Calculates game total and adds to running total
function submitForm() {

	// Verify all chosen options and store in choices
	var choices = Validate(scenarios);

	// Update total cash earned
    cashEarned = parseFloat(SimChoices(choices)) + parseFloat(cashEarned);

	// Set choices back to null for next game
    Reset(scenarios);
    choices = [];

    print(cashEarned);

    $('#cash-earned').html(cashEarned);
}

// This section will be replaced with code that creates scenario objects with data from database
// Creates sample array of scenarios
for (m = 0; m < 5; m++) {
  scenarios.push(new Scenario(new Choice([2],15), new randChoice()));
}

// Add choices to page
$(document).ready(function() {
    var pageList = "";
    var i = 0;
    for (i = 0; i < scenarios.length; i++) {

      // Add first choice
      pageList += '<tr><td class="tels"><div onclick="Choose('+i+',0)" id="'+i+'-0" name="'+i+'" value="A">'+scenarios[i].choiceA.description+'</div></td>';

      // Add second choice
      pageList += '<td class="tels"><div onclick="Choose('+i+',1)" id="'+i+'-1" name="'+i+'" value="B">'+scenarios[i].choiceB.description+'</div></td></tr>';
    }
    $('#choice-selection').html(pageList);
});
