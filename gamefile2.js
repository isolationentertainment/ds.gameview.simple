//Global variables
var gameOver = false
var score = 0

//Handle game loading.
//Handle game loading.
function OnLoad()
{
    //Add physics
    gfx.AddPhysics(2)
    gfx.Enclose( -1, "top,bottom" )
    
    //Create background (and stretch it to full screen).
    sky = gfx.CreateBackground( "Img/flappy_back.jpg", "stretch" )
    
    //Create graphical objects.
    dino = gfx.CreateSprite( "Img/dino_fly_783x136x3x1", "dinos" )
    croc = gfx.CreateSprite( "Img/crocs_149x686x1x2", "enemies" )
    crash = gfx.CreateSpriteSheet( "Img/dino_crash_920x138x4" ) 
    txt = gfx.CreateText( score.toString(), 0.1, "Img/Desyrel.xml" );
    
    gameover = gfx.CreateSprite( "Img/gameover.jpg", "gameover" )
    replay = gfx.CreateSprite( "Img/replay.png", "replay" )
	
    replay.Contains = function( x, y )
    {
        if( x > replay.x && x < replay.x + replay.width 
        && y > replay.y && y < replay.y + replay.height ) return true
        else return false
    }
    
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
    dino.SetPhysics( 1, "dynamic" )
    
    //Set dino physics shape to be a rectangle slighly smaller than
	//the source image boundary so that collions look more realistic.
	dino.SetShape( "rect", 0.7, 0.7 )

    
    //Add enemy sprites.
	gfx.AddSprite( croc, 0.8, 0.55, 0.12 )
    croc.SetPhysics( 2, "fixed", 1 )

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
	//Do nothing if game is over.
	if( gameOver ) return
	
	//Make background slide to the left a small amount.
	sky.Scroll( -0.002, 0 )
	
	//Slide croc to left. 
	croc.x -= 0.004
	
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

	//We need to update the physics state when we manually 
	//move objects that use physics.
	croc.UpdatePhysics()
	
	//Check for dino collisions with spiky grass.
	if( dino.y > 0.8 && !gameOver ) Crash()
}


//Handle screen touches and key presses.
function OnControl( touchState, touchX, touchY, keyState, key )
{
	//Increase dino's upward velocity when screen touched.
	if( touchState=="Up" && !gameOver ) dino.AddVelocity( 0, -0.3 )
	
	else if( gameOver && replay.Contains(touchX,touchY) && touchState=="Down" ) 
	{ 
          gfx.Reload();
	}	
}


//Crash our character and end the game.
function Crash()
{
	//Set gameover state.
	gameOver = true
	
	//Switch sprite sheets and change play speed.
	dino.SetSpriteSheet( crash )
	dino.Play( 0, 0.1 )
	
	//Play crunch sound and prevent scroll.
	crunch.Play()
	//Play 'game over' sound after half a second.
    end.Play( false, 500 ) 
	setTimeout(GameOver, 500)
}

function GameOver()
{
    gfx.AddSprite( gameover, 0, 0, 1, 1 )
    gfx.AddSprite( replay, 0.4, 0.7, 0.2)
}

//Handle sprite collisions.
function OnCollide( a, b )
{
    console.log( "a:" + a.group + " b:"+b.group )
    
    if( a.group=="dinos" && b.group=="enemies" ) 
	{
		//If dino hits croc, then play the crash
		//animation and disable physics for croc, so
		//that way is clear for dino to fall to floor.
		Crash()
		croc.EnablePhysics( false )
	}
}


