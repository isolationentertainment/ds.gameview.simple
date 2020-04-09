//Global variables
var gameOver = false
var score = 0
//Handle game loading.
function OnLoad()
{
    //Create background (and stretch it to full screen).
    sky = gfx.CreateBackground( "Img/flappy_back.jpg", "stretch" )
    
    //Create graphical objects.
    dino = gfx.CreateSprite( "Img/dino_fly_783x136x3x1", "dinos" )
    croc = gfx.CreateSprite( "Img/crocs_149x686x1x2", "enemies" )
    crash = gfx.CreateSpriteSheet( "Img/dino_crash_920x138x4" ) 
    txt = gfx.CreateText( score.toString(), 0.1, "Img/Desyrel.xml" );
    
    gameover = gfx.CreateSprite( "Img/gameover.jpg", "gameover" )
    
    //Create sounds.
	jungle = gfx.CreateSound( "Snd/jungle.mp3" )
	crunch = gfx.CreateSound( "Snd/crunch.mp3" )
	end = gfx.CreateSound( "Snd/game_over.mp3" )
}

//Called when game has loaded.
function OnReady()
{
	//Set background.
	gfx.AddBackground( sky )
	
	//Add dino image
    gfx.AddSprite( dino, 0.1, 0.5, 0.15 )
    //Add enemy sprites.
	gfx.AddSprite( croc, 0.8, 0.55, 0.12 )

    //Start animations
    dino.Play( 0, 0.25 )
    croc.Play( 0, 0.05 )
    
    //Add score text
	gfx.AddText( txt, 0, 0 );
    
    //Play looping background sound.
    jungle.Play(true)

	//Start the game.
    gfx.Play()
}

//Update game objects.
//(called for every frame)
function OnAnimate( time, timeDiff ) 
{	
    //Make background slide to the left a small amount.
    sky.Scroll( -0.002, 0 )
    
    //Slide croc to left. 
	croc.x = croc.x - 0.004
	dino.y+= 0.0005
	
	if( gfx.IsOverlap(dino, croc, 0.03) && !gameOver  ) 
    {
      Crash()
    }
    
    //If croc has gone off left side of screen.
	if( croc.x < -croc.width ) 
	{ 
		//Move the croc back to the right hand side.
		croc.x = 1
		
		//Scale croc with a random value.
		var height = 0.4 + Math.random()*0.4
		croc.SetSize( null, height )
		croc.y = 1 - croc.height
		score++
		txt.SetText( score.toString() )  
	}
}

//Handle screen touches and key presses.
function OnControl( touchState, touchX, touchY, keyState, key )
{
	//Increase dino's upward velocity when screen touched.
	if( touchState=="Up" && !gameOver ) dino.y-= 0.03
}

//Crash our character and end the game.
function Crash()
{
	//Switch sprite sheets and change play speed.
	dino.SetSpriteSheet( crash )
	dino.Play( 0, 0.1 )
	
	//Play crunch sound and prevent scroll.
	crunch.Play()
	setTimeout(GameOver, 1000)
	//Set gameover state.
	gameOver = true
	
}

function GameOver()
{
    gfx.AddSprite( gameover, 0, 0, 1, 1 )
    //Play 'game over' sound after half a second.
    end.Play( false, 500 ) 
}

