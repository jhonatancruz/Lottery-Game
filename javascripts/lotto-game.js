// TODO
// - Get form data from database
// - Store in database model

// Chris Thurber - 2017
// Lottery Game

// Returns array with ints from x to n
function iRange(x, n) {
  var a = [];
  var i = 0;
  for (i = x; i <= n; i++) {
    a.push(i);
  }
  return a;
}

function Game() {
  // Values from server
  this.player_id;
  this.research_id;
  this.game_id;
  this.next_game_id;

  // Initialize defaults
  this.cashEarned = 0;
  this.scenarios = [];
}

Game.prototype.readPlayerID = function(){
  var player_id = parseInt($('#player_id').text());
  return player_id;
}

Game.prototype.readNextGameId = function(){
  var next_game_id = parseInt($('#next_game_id').text());
  return next_game_id;
}

Game.prototype.setGameDefaults = function(research_id, game_id, scenarios){
    //set variables to initials variables
    this.scenarios = scenarios;
    this.player_id = this.readPlayerID();
    this.research_id = research_id;
    this.game_id = game_id;
    this.next_game_id = this.readNextGameId();
    this.cashEarned = this.initial_cash;
}

Game.prototype.listGameVariables = function(){
    console.log("Scenarios: "+ this.scenarios);
    console.log("Player Id: "+this.player_id);
    console.log("Research Id: "+this.research_id);
    console.log("Game Id: "+this.game_id);
    console.log("Cashed Earned: "+ this.cashEarned);
}

Game.prototype.startGame = function(){
    var url = document.URL; // url to get JSON content
    console.log(url);
    //function to handle content returned by AJAX reponse
    //assign object to use in callback function below
    var game = this;
    //use ajax to get JSON content from server
    //assign variable to Game variables
    $.getJSON(url, function(response){
        // assign content from response to initial variables
        //session is the first object in the list
        //eventually we neeed to find the latest version of the session

        var session = response;
        console.log(session);
        //set the content to the default variables
        var sc = session.scenarios;
        var ic = session.initial_cash;
        var ri = session.research_id;
        var id = session.id;

        //set up game defaults
        game.setGameDefaults(ri, id, sc);
    });

    var pageList = "";
    var i = 0;
    pageList += '<table class="table">'
    for (i = 0; i < game.scenarios.length; i++) {

      // Add first choice -- onclick="Choose('+i+',0)"

      pageList += '<div class="row"><tr><td><button id="'+i+'-0" onclick="Choose('+i+',0)" class="btn btn-block btn-lg btn-secondary">'+game.scenarios[i].choiceA.description+'</button></div></div>';

      // Add second choice
      pageList += '<td><button id="'+i+'-1" onclick="Choose('+i+',1)" class="btn btn-block btn-lg btn-secondary">'+game.scenarios[i].choiceB.description+'</button></td></tr>';
    }
    pageList += '</table>'
    $('#choice-selection').html(pageList);
}

// Choice consists of a range of values that will result in a payout
Game.prototype.Choice = function (rangeIn, payoutIn) {
  this.range = rangeIn;
  this.payout = payoutIn.toFixed(2);
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.range.length - 1] + " then get $" + this.payout;
}

// Creates a random choice for testing purposes
Game.prototype.randChoice = function() {
  this.range = iRange(6,10);
  this.payout = parseFloat(Math.random()*21).toFixed(2);
  this.last = this.range.length - 1;
  this.description = this.range.length == 1 ? "If the die is " + this.range[0] + " then get $" + this.payout : "If the die is between " + this.range[0] + " and " + this.range[this.last] + " then get $" + this.payout;
}

// A Scenario consists of two choices, and a chosen value set by the 'Choose' function
Game.prototype.Scenario = function(choiceA, choiceB) {
  this.choiceA = choiceA;
  this.choiceB = choiceB;
  this.choice = null;
}

// Returns result from rolling two 6-sided die
Game.prototype.Roll = function() {
  return [Math.floor(Math.random()*7), Math.floor(Math.random()*7)];
}

// Add results of roll to page
Game.prototype.RevealDice = function (roll) {
  rollString = "<td><center><h1>"+roll[0]+"</h1></center></td><td><center><h1>"+roll[1]+"</h1></center></td>";
  rollString += "</tr>";
  $('#dice-numbers').html(rollString);
}

// Compares the result of the roll of two die to the chosen range
Game.prototype.Sim = function (choice, roll=Roll()) {
  var rollSum = parseInt(roll[0]) + parseInt(roll[1]);
  return choice.range.includes(rollSum);
}

// Simulates an array of scenarios and returns the total payout
Game.prototype.SimScenarios = function (scenarios) {
  var payouts = 0;
  var roll = Roll();

  RevealDice(roll);

  var rollTotal = parseInt(roll[0]) + parseInt(roll[1]);

  for (i = 0; i < scenarios.length; i++) {
    console.log("Player chose: " + choices[i].description + " for $" + choices[i].payout);
    if(scenarios[i].chosen.range.includes(rollTotal)) {
      payouts = parseFloat(scenarios.pop().chosen.payout) + payouts;
    }
  }
  return parseFloat(payouts).toFixed(2);
}

// Simulates an array of choices and returns the total payout
Game.prototype.SimChoices = function(choices) {
  var payouts = 0;
  var roll = Roll();

  RevealDice(roll);

  for (i = 0; i < choices.length; i++) {
    console.log("Player chose: " + choices[i].description + " for $" + choices[i].payout);
    if(Sim(choices[i], roll)) {
      payouts = parseFloat(choices.pop().payout) + payouts;
    }
  }
  return parseFloat(payouts).toFixed(2);
}

// Allows choice at index to be chosen
Game.prototype.Choose = function (index, choice) {

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
Game.prototype.Validate = function(scenarios) {
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
Game.prototype.Reset = function(scenarios) {
  console.log(scenarios.length);
  for(i = 0; i < scenarios.length; i++) {
    scenarios[i].chosen = null;

    $('#'+ i + "-" + 0).addClass('btn-secondary');
    $('#'+ i + "-" + 0).removeClass('btn-info');

    $('#'+ i + "-" + 1).addClass('btn-secondary');
    $('#'+ i + "-" + 1).removeClass('btn-info');
  }

}

// Calculates game total and adds to running total
Game.prototype.submitForm = function() {

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

//hide buttons so that user can't keep playing
Game.prototype.leaveGame= function(){
    $("#inflate").hide();
    $("#leave").hide();
    $("#content").append('<br /><a href="/risk_balloon_games/'+this.next_game_id+'"><div class="btn btn-primary btn-block">Continue</div></a>')
    this.submitData();
}

// This section will be replaced with code that creates scenario objects with data from database
// Creates sample array of scenarios
// for (m = 0; m < 5; m++) {
//   scenarios.push(new Scenario(new Choice([2],15), new randChoice()));
// }

// Add choices to page
// $(document).ready(function() {
//     var pageList = "";
//     var i = 0;
//     pageList += '<table class="table">'
//     for (i = 0; i < scenarios.length; i++) {
//
//       // Add first choice -- onclick="Choose('+i+',0)"
//
//       pageList += '<div class="row"><tr><td><button id="'+i+'-0" onclick="Choose('+i+',0)" class="btn btn-block btn-lg btn-secondary">'+scenarios[i].choiceA.description+'</button></div></div>';
//
//       // Add second choice
//       pageList += '<td><button id="'+i+'-1" onclick="Choose('+i+',1)" class="btn btn-block btn-lg btn-secondary">'+scenarios[i].choiceB.description+'</button></td></tr>';
//     }
//     pageList += '</table>'
//     $('#choice-selection').html(pageList);
// });
