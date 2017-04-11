// TODOs
// - Get form data
// - Simulate selected choices
// - Update Cash balance
// - Store in database model

// function Choose(choice) {
//   this.chosen = choice;
// }

var cashEarned = 0;
var choices = [];
var Scenarios = [];
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

// Choice consists of a range of values that will result in a payout
function Choice(rangeIn, payoutIn) {
  this.range = rangeIn;
  this.payout = payoutIn.toFixed(2);
  this.last = this.range.length - 1;
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.last] + " then get $" + this.payout;
}

function randChoice() {
  this.range = iRange(6,10);
  this.payout = (Math.random()*21).toFixed(2);
  this.last = this.range.length - 1;
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.last] + " then get $" + this.payout;
}

// A Scenario consists of two choices, and a chosen value set by the 'Choose' function
function Scenario(choiceA, choiceB) {
  this.choiceA = choiceA;
  this.choiceB = choiceB;
  this.chosen = null;
}

// Sim simulates a two-dice roll and returns whether or not the result is in the range of the 'choice' selected
function Sim(choice) {
  var diOne = Math.floor(Math.random()*7);
  var diTwo = Math.floor(Math.random()*7);
  var outcome = diOne + diTwo;

  return choice.range.includes(outcome);
}

// Simulates an array of choices and returns the payouts accordinglys
function SimAll(choices) {
  var payouts = 0;
  var i = 0;
  for (i = 0; i < choices.length; i++) {
    console.log("Payout:"+choices[])
    if(Sim(choices[i])) {
      payouts += choices.pop().payout;
    }
  }

  return payouts;
}

// Allows choice at index to be chosen
function Choose(index, choice) {
  if(choice === 0) {
    choices.push(Scenarios[index].choiceA);
  } else {
    choices.push(Scenarios[index].choiceB);
  }
}

// Calculates game total and adds to running total
function submitForm() {

    for (q = 0; q < Scenarios.length; q++) {
      choices.push(Scenarios[q].chosen);
    }

    cashEarned += SimAll(choices);

    console.log($(this).serialize()); // will be the serialized form
    $(this).append($(this).serialize() + '<br />');
    $('#cash-earned').html(cashEarned);
}

// Chosen values will come from
for (r = 0; r < 10; r++) {
  randChoices.push(new randChoice());
}

// This section will be replaced with code that creates scenario objects with data from database
// Creates sample array of scenarios
for (m = 0; m < 5; m++) {
  Scenarios.push(new Scenario(randChoices.pop(), randChoices.pop()));
}

// Add choices to page
$(document).ready(function() {
    var pageList = "";
    var i = 0;
    for (i = 0; i < Scenarios.length; i++) {
      pageList += '<tr><td><button onclick="Choose('+i+',0)" id="'+i+'-A" name="'+i+'" value="A">';
      pageList += Scenarios[i].choiceA.description;
      pageList += '</button></td>';
      pageList += '<td><button onclick="Choose('+i+',1)" id="'+i+'-B" name="'+i+'" value="B">';
      pageList += Scenarios[i].choiceB.description;
      pageList += '</button></td></tr>';
    }
    $('#choice-selection').html(pageList);
});
