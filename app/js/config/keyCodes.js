/*******************************************************

Navigation button mapping
X -  select item
Square
Help on main landing page
Home when on any other page
Triangle � Search
Circle - Back
Playback button mapping
X � play/pause
Triangle � Options Menu (for Closed Captions, streams settings, etc)
Circle
Exit playback
Exit Options menu
Right/Left on D-Pad and R1/L1 � FastForward / Rewind
Video Pauses
Multiple taps increases velocity up to 256x speed
Starts FF/RW, while showing a trick play image per jump
Seek to position happens when X is tapped

********************************************************/

var KEY_CODES;
var Keyboard = new Array();
var DEVICE_TYPE = "";
if(navigator.userAgent.match('Maple'))
{
	DEVICE_TYPE = "SAMSUNG";
}else if(navigator.userAgent.match('Mozilla')  || navigator.userAgent.match('Chrome')|| navigator.userAgent.match('Safari'))
{
    DEVICE_TYPE = "KEYBOARD";
}
console.log(navigator.userAgent);
// :Mozilla/5.0 (compatible; U; Fymp) Factory Media Production GmbH/3.0.2
// will be false positive here Shoumik, but TF is sending wrong set anyway. We will discuss.

Keyboard[0] = {
    SELECT: 84, 		// T
    L3: 88, //
    R3: 190,
    START: 71,
    DPAD_UP: 38,
    DPAD_RIGHT: 39,
    DPAD_DOWN: 40,
    DPAD_LEFT: 37,
    L2: 83,
    R2: 76,
    L1: 87,
    R1: 79,
    TRIANGLE: 73, 	// I
    CIRCLE: 75, 		// K
    X: 13, 			// enter
    F: 13,//
    SQUARE: 74, 	// J
    INFO:74,     // INFO
    EXIT: 27, //
    PREVIEW:71, //preview
    
    RBIKEYBOARD_ESC: 27,
    RBIKEYBOARD_TOGGLE     : 112, // toggle key; F1 = 112 (event.which value for function 1 key)
    RBIKEYBOARD_ENTER      : 13,
    RBIKEYBOARD_PAGEUP     : 33,
    RBIKEYBOARD_PAGEDOWN   : 34,
    RBIKEYBOARD_END        : 35,
    RBIKEYBOARD_HOME       : 36,
    RBIKEYBOARD_LEFT       : 37,
    RBIKEYBOARD_UP         : 38,
    RBIKEYBOARD_RIGHT      : 39,
    RBIKEYBOARD_DOWN       : 40,

	    // keycodes for numaric key input
    RBIKEYBOARD_0: 17,
    RBIKEYBOARD_1: 101,
    RBIKEYBOARD_2: 98,
    RBIKEYBOARD_3: 6,
    RBIKEYBOARD_4: 8,
    RBIKEYBOARD_5: 9,
    RBIKEYBOARD_6: 10,
    RBIKEYBOARD_7: 12,
    RBIKEYBOARD_8: 13,
    RBIKEYBOARD_9: 14,
    //
	//Keys for media remote to map to EXISTING normal controller integer, and to restore to default
    MAPOVER : {
        '29443' : 'X', //ENTER
        '13' : 'X',  // restore default

        '88' :  'CIRCLE',  //RETURN 
        '75' :  'CIRCLE',  // restore default

        '20' : 'SELECT', // TOPMENU
        '20' : 'SELECT', // POPUP_MENU
        '84' : 'SELECT'  // restore default
    },
    //temp setting for testing hot key function
    RBIKEYBOARD_ok_F2 : 113,
    RBIKEYBOARD_Backspace_F4 : 115,
    RBIKEYBOARD_spacebutton_F7 : 118
    //
    
    
	
};

Keyboard[1] = {

		SELECT: 20, //Green		// T
	    L3: 88, //
	    R3: 190,
	    START: 71,
	    DPAD_UP: 29460,
	    DPAD_RIGHT: 5,
	    DPAD_DOWN: 29461,
	    DPAD_LEFT: 4,
	    L2: 83,
	    R2: 76,
	    L1: 69,
	    R1: 72,
	    TRIANGLE: 22,//Blue 	// I
	    CIRCLE: 88,//Back 		// K
	    X: 29443, //Enter			// enter
	    F: 29443,//Enter
	    SQUARE: 108, //Red
	    EXIT: 45,
	    PREVIEW:71, //preview
	    
		PLAY: 71,   // PLAY
        PAUSE:74,   // PAUSE
        STOP:70,    // STOP
        INFO:31,    // INFO
        SKIP_FWD:1078, //SKIP FORWARD
        SKIP_RWD:1080, //SKIP BACKWARD
        REWIND:69, //REWIND
        FFWD:72, //FORWARD
        SCENES:20, //SCENES
		CAPTION:652, // CAPTION CC Button on TV remote
		CAPTION_BRD:1089, // CAPTION SUBTITLE Button on BRD remote

	    RBIKEYBOARD_ESC: 88,
	    RBIKEYBOARD_TOGGLE     : 112, // toggle key; F1 = 112 (event.which value for function 1 key)
	    RBIKEYBOARD_ENTER      : 29443,
	    RBIKEYBOARD_PAGEUP     : 33,
	    RBIKEYBOARD_PAGEDOWN   : 34,
	    RBIKEYBOARD_END        : 35,
	    RBIKEYBOARD_HOME       : 36,
	    RBIKEYBOARD_LEFT       : 4,
	    RBIKEYBOARD_UP         : 29460,
	    RBIKEYBOARD_RIGHT      : 5,
	    RBIKEYBOARD_DOWN       : 29461,	

	    PL_TVMW_KEY_VOL_UP : 200, //Volume Up
	    PL_TVMW_KEY_VOL_DOWN : 201, //Volume Down
	    PL_TVMW_KEY_MUTE : 202, // MUTE KEY
	    MUTE : 27,
		
	    //
	  //Keys for media remote to map to EXISTING normal controller integer, and to restore to default
	    MAPOVER : {
	        '29443' : 'X', //ENTER
	        '13' : 'X',  // restore default

	        '88' :  'CIRCLE',  //RETURN 
	        '75' :  'CIRCLE',  // restore default

	        '20' : 'SELECT', // TOPMENU
	        '20' : 'SELECT', // POPUP_MENU
	        '84' : 'SELECT'  // restore default
	    },
	    
	    // keycodes for numaric key input
    RBIKEYBOARD_0: 17,
    RBIKEYBOARD_1: 101,
    RBIKEYBOARD_2: 98,
    RBIKEYBOARD_3: 6,
    RBIKEYBOARD_4: 8,
    RBIKEYBOARD_5: 9,
    RBIKEYBOARD_6: 10,
    RBIKEYBOARD_7: 12,
    RBIKEYBOARD_8: 13,
    RBIKEYBOARD_9: 14,
    //
    
    //temp setting for testing hot key function
    RBIKEYBOARD_ok_F2 : 113,
    RBIKEYBOARD_Backspace_F4 : 115,
    RBIKEYBOARD_spacebutton_F7 : 118,
    //
	//fwd,play,puase,stop,skip fwd, skip back,rewnd, scene,caption L3,R3,L2,R2,L1,R1 
    NON_SUPPORTED_KEYS_ARRAY: [-133311, 72, 71, 74, 70, 1078, 1080, 69, 20, 21, 88, 190, 83, 76, 69, 72]
    //	
		};

if (DEVICE_TYPE == "KEYBOARD") {
    KEY_CODES = Keyboard[0];
}
else {
    KEY_CODES = Keyboard[1];
}
