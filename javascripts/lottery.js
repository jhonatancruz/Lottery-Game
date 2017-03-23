var cashValue= 0; //starting cash

//boolean value for event listeners
var option= false;
var pressA= false;
var pressB= false;

function move() {
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function randomDice1(){
  var random= (Math.floor(Math.random()*7));
  return random;
}
function randomDice2(){
  var random= (Math.floor(Math.random()*7));
  return random;
}
function optionClickA(x){
  if(pressB==true){
    alert("Option B is already pressed");
  }else{
    console.log(x);
    var optionA= document.getElementById("optionA");
    optionA.style.backgroundColor= 'yellow';
    option=true;
    pressA= true;
  }
}
function optionClickB(x){
  if(pressA==true){
    alert("Option A is already pressed")
  }else{
    console.log(x);
    var optionB= document.getElementById("optionB");
    optionB.style.backgroundColor= "yellow";
    option= true;
    pressB=true;
}
}
function showOthers(){
  var header= document.getElementById("header");
  header.innerHTML= "Decision 2";
  optionA.innerHTML= "Option A: If die is 2, then get $2. Or if die 3-12, get $1.60";
  optionB.innerHTML= "Option B: If die is 2, then get $3.85. Or die 3-12, get $0.10";
}

function dieClick(){
    var result= document.getElementById("diceOne")
    var result2= document.getElementById("diceTwo");
    var total= document.getElementById("total");
    var cash= document.getElementById("cash");
    var dice1= randomDice1();
    var dice2= randomDice2();
    var totalresult= dice1+dice2;

    if(option!= true){
    alert("You must select an option.")

  } else{
      if(pressA==true && totalresult==2){
        cashValue+=2;
        cash.innerHTML= "Cash: "+cashValue;
      }else if (pressA==true && totalresult>2) {
        cashValue+=1.60;
        cash.innerHTML= "Cash: "+cashValue;
      }if(pressB==true && totalresult==2){
        cashValue+=3.85;
        cash.innerHTML= "Cash: "+cashValue;
      }else if(pressB==true && totalresult>2){
        cashValue+=0.10;
        cash.innerHTML= "Cash: "+cashValue;
    }
    if(dice1==1){
      result.src= "diceOne.png";
    }else if (dice1==2) {
      result.src= "diceTwo.png";
    }else if (dice1==3) {
      result.src= "diceThree.png";
    }else if (dice1==4){
      result.src= "diceFour.png";
    }else if (dice1==5) {
      result.src= "diceFive.png";
    }else if (dice1==6){
      result.src= "diceSix.png";
    }
    if(dice2==1){
      result2.src= "diceOne.png";
    }else if (dice2==2) {
      result2.src= "diceTwo.png";
    }else if (dice2==3) {
      result2.src= "diceThree.png";
    }else if (dice2==4){
      result2.src= "diceFour.png";
    }else if (dice2==5) {
      result2.src= "diceFive.png";
    }else if (dice2==6){
      result2.src= "diceSix.png";
    }
    total.innerHTML= "Total: "+ totalresult;
    // cash.innerHTML= "Cash: "+cashValue;
