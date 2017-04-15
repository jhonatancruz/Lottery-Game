// TODOs
// - Get form data
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

// Creates a random choice for testing purposes
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

// Add results of roll to page
function RevealDie(roll) {
  rollString = "<td><center><h1>"+roll[0]+"</h1></center></td><td><center><h1>"+roll[1]+"</h1></center></td>";
  rollString += "</tr>";
  $('#dice-numbers').html(rollString);
}

// Compares the result of the roll of two die to the chosen range
function Sim(choice, roll=Roll()) {
  var rollSum = parseInt(roll[0]) + parseInt(roll[1]);
  return choice.range.includes(rollSum);
}

// Simulates an array of scenarios and returns the total payout
function SimScenarios(scenarios) {
  var payouts = 0;
  var roll = Roll();

  RevealDie(roll);

  var rollTotal = parseInt(roll[0]) + parseInt(roll[1]);

  for (i = 0; i < scenarios.length; i++) {
    print("Player chose: " + choices[i].description + " for $" + choices[i].payout);
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

  RevealDie(roll);

  for (i = 0; i < choices.length; i++) {
    print("Player chose: " + choices[i].description + " for $" + choices[i].payout);
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
    $('#'+index + "-" + 0).removeClass('btn-secondary');
    $('#'+index + "-" + 0).addClass('btn-info');
    $('#'+index + "-" + 1).addClass('btn-secondary');
    $('#'+index + "-" + 1).removeClass('btn-info');
  } else {
    scenarios[index].chosen = scenarios[index].choiceB;
    $('#'+index + "-" + 1).removeClass('btn-secondary');
    $('#'+index + "-" + 1).addClass('btn-info');
    $('#'+index + "-" + 0).removeClass('btn-info');
    $('#'+index + "-" + 0).addClass('btn-secondary');
  }

}

// Populates and returns an array of choices from scenarios
function Validate(scenarios) {
  choices = [];
  for(i = 0; i < scenarios.length; i++) {
  	if(scenarios[i].chosen === null) {
  	  return false;
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

    $('#'+ i + "-" + 0).addClass('btn-secondary');
    $('#'+ i + "-" + 0).removeClass('btn-info');

    $('#'+ i + "-" + 1).addClass('btn-secondary');
    $('#'+ i + "-" + 1).removeClass('btn-info');
  }

}

// Calculates game total and adds to running total
function submitForm() {

	// Verify all chosen options and store in choices
	var choices = Validate(scenarios);
  if(choices) {
    // Update total cash earned
    cashEarned = parseFloat(SimChoices(choices)) + parseFloat(cashEarned);

  	// Set choices back to null for next game
    Reset(scenarios);
    choices = [];

    $('#cash-earned').html("<center><h2>$"+cashEarned+"</h2></center>");
  } else {
    alert("Please make sure one option is chosen for each choice!");
  }
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
    pageList += '<table class="table">'
    for (i = 0; i < scenarios.length; i++) {

      // Add first choice -- onclick="Choose('+i+',0)"

      pageList += '<div class="row"><tr><td><button id="'+i+'-0" onclick="Choose('+i+',0)" class="btn btn-block btn-lg btn-secondary">'+scenarios[i].choiceA.description+'</button></div></div>';

      // Add second choice
      pageList += '<td><button id="'+i+'-1" onclick="Choose('+i+',1)" class="btn btn-block btn-lg btn-secondary">'+scenarios[i].choiceB.description+'</button></td></tr>';
    }
    pageList += '</table>'
    $('#choice-selection').html(pageList);
});
