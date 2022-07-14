// Written by Matthew Spiller
// July 13, 2022

// For storing the game generated pattern
var gamePattern = [];

// For storing user input
var userPattern = [];

// The available colors for the pattern
var colors = ["green", "red", "yellow", "blue"];

// Audio sources corresponding to colors
var audios = [new Audio("sounds/green.mp3"), new Audio("sounds/red.mp3"), new Audio("sounds/yellow.mp3"), new Audio("sounds/blue.mp3"), new Audio("sounds/wrong.mp3"), new Audio("sounds/correct.wav")];

// is true when the game is being played
var gameRunning = false;

// is true when game is started and it is the user's turn to input a pattern
var acceptingInput = false;

// to keep track of the round
var currentRound = 1;

// The number of milliseconds between each button animation
var speed = 500;

// to stop audio of the previous color to prevent audio sources playing over each other
var previousColor = "";

// When a button is clicked, it fades out and in.
// This is feedback for the user so that they know the button is pressed.
$(".btn").click(function() {

  // Disallows button presses while pattern is being animated for user
  if(acceptingInput)
  {
    // fades button when pressed
    $(this).animate({opacity: "50%"}, 100).animate({opacity: "100%"}, 100);

    var colorSelected = $(this)[0].id;

    // The previous audio source is stopped and the new one plays
    stopAudio(previousColor);
    playAudio(colorSelected);
    previousColor = colorSelected;

    // The color selected by the user is added to their pattern array
    userPattern.push(colorSelected);

    // Checks to make sure that the most recent user input matches the generated pattern at the given index
    checkValidityOfInput(userPattern.length - 1);

    // When user pattern is the same size as the game pattern and the game is still running, then the user wins the round
    if (userPattern.length == gamePattern.length && gameRunning)
    {
      setTimeout(playerWins, 200);
      //playerWins();
    }
  }
});

// When start/restart button is clicked
$(".start-button").click(function() {
  if(!gameRunning)
  {
    $(this).hide();
    $("#prompt").hide();
    $(".buttons").css({"margin-top": "5.55rem"});
    $("#level-title").css({"padding-top": "5rem"});
    gameRunning = true;
    nextRound();
  }
})

// Runs at the beginning of each round
function nextRound()
{
  acceptingInput = false;
  $("h1").html("Round " + currentRound);
  setTimeout(createPattern, 1000);
}

// Creates the next color in the growing pattern array
function createPattern ()
{
  var randomNumber = Math.floor(Math.random() * colors.length);
  var randomColor = colors[randomNumber];
  gamePattern.push(randomColor);
  animatePattern(0);
}

function checkValidityOfInput (index)
{
  if(userPattern[index] != gamePattern[index])
  {
    playerLoses();
  }
}

/*
To make sure there is a delay between each button animation, setTimeout is used to
recursively call this function, incrementing the "position" integer until it is equal
to the length of the generated pattern */
function animatePattern(position)
{
  if(position == gamePattern.length)
  {
    acceptingInput = true;
    return;
  }

  // For each color in the pattern, the corresponding button fades in and out, and a sound plays
  var color = gamePattern[position];
  $("#" + color).fadeOut(100);
  stopAudio(previousColor);
  playAudio(color);
  previousColor = color;
  $("#" + color).fadeIn(100);

  if (speed > 250)
  {
    speed -= 10;
  }

  setTimeout(animatePattern, speed, ++position);
};

// plays the audio corresponding to the color
function playAudio(color)
{
  if (color == "green")
  {
    audios[0].play();
    audios[0]
  }
  else if (color == "red")
  {
    audios[1].play();
  }
  else if (color == "yellow")
  {
    audios[2].play();
  }
  else if (color == "blue")
  {
    audios[3].play();
  }
  else
  {
    return;
  }
}

// stops playing the audio corresponding to the color
function stopAudio(color)
{
  if (color == "green")
  {
    audios[0].pause();
    audios[0].currentTime = 0;
  }
  else if (color == "red")
  {
    audios[1].pause();
    audios[1].currentTime = 0;
  }
  else if (color == "yellow")
  {
    audios[2].pause();
    audios[2].currentTime = 0;
  }
  else if (color == "blue")
  {
    audios[3].pause();
    audios[3].currentTime = 0;
  }
  else
  {
    return;
  }
}

// When the player loses the game
function playerLoses()
{
  stopAudio(previousColor);
  audios[4].play();
  $(".buttons").css({"margin-top": "1rem"});
  $("#level-title").css({"padding-top": "0"});
  $("h1").html("Incorrect").css({"padding-top": ""});
  gameRunning = false;
  acceptingInput = false;
  $("h2").html("Press Restart To Play Again").show();
  $(".start-button").html("RESTART").show();
  gamePattern = [];
  userPattern = [];
  currentRound = 1;
  speed = 500;
}

// When the player wins the round
function playerWins()
{
  stopAudio(previousColor);
  audios[5].play();
  $("h1").html("Correct");
  userPattern = [];
  acceptingInput = false;
  currentRound++;
  setTimeout(nextRound, 1000);
}
