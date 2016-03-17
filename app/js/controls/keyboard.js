/*
code provided by TF to handle keyboard invocation

var OSKconfig = {
	initialText: 'Foo',
	mTitle: 'MyTitle',
	passwordQ: false,
	mType: 'qwerty'
};*/
var currentFormFieldObj;
var currentFormFieldId = false;
var currentFormValue;

function invokeOSK(obj, keytype, title){
    // Adding timeout so that the keyboard does not show up automatically when the
    // password pop up is show ZOE-31523
    setTimeout(function(){
        title = obj.placeholder || title || 'Enter Text';
        currentFormFieldObj = obj;
        currentFormFieldId = currentFormFieldObj.id;
        currentFormFieldObj.title = title;
        currentFormFieldObj.keytype = keytype || false;
        //helper.debugLog(obj.id + " for invokeOSK... " + title + " passwd type:" + currentFormFieldObj.keytype);
    },300);
}
function checkInputFocusOSK(key){
	helper.debugLog('checkInputFocusOSK on field>>>');
	
	// Added check for checking currentFormFieldObj
	if(!isDefined(currentFormFieldObj))
		return false;
	// added extra check for text filed type
	if(key !== KEY_CODES.X || (currentFormFieldObj.tagName != "INPUT" && (currentFormFieldObj.type != "text" || currentFormFieldObj.type != "password" || currentFormFieldObj.type != "email")))
		return false;
	helper.debugLog('checkInputFocusOSK on field: ' + currentFormFieldId);
    if(!POP_ALERT_BOX_VISIBLE){
        if ( $('#'+currentFormFieldId)[0] == document.activeElement &&
            $('#'+currentFormFieldId).is(':visible') ) {
            helper.debugLog('checkInputOSK: Focus on field: ' + currentFormFieldObj.id);
            if(RBI.PlatformConfig.genericKeyboard == true)
            {
                $( "body" ).append('<div id = "key-bg" />');
            }
            return pullUpOSK(currentFormFieldObj);
        }
        else {
            helper.debugLog('resetting inactive/invisible field: ' + currentFormFieldId);
            currentFormFieldId = false; // setting this to false so that it does no persist the id
            return false; // we need to return false since the RBIKey Event checks this function if the keyboard has to be shown or not...
        }
    }
}
// This will trigger the custom keyboard only, initially we had an option to use the device keyboard.
function pullUpOSK(obj){
    helper.debugLog('pullUpOSK' + obj.title);
    title = obj.placeholder;
    helper.debugLog(obj.id + " " + title );
    if(RBI.PlatformConfig.genericKeyboard == true)
    {
        $('#'+obj.id).keyboard();
        $('#'+obj.id).addNavigation({
            position   : [2,7],// Changes made as per suggestion in issue ZOE-32509
            toggleMode : true,
            focusClass : 'hasFocus'
        });
		  $('#'+obj.id).focus();
    }else if (typeof vod !== 'undefined' && typeof vod.triggerOnScreenKeyboard !== 'undefined' )  {
        vod.triggerOnScreenKeyboard(obj.value, title, obj.keytype, 'qwerty');
        return true;
    }
    else{
        $("#key-bg").remove();
        handleOSK( {data: {event: 1, text: obj.value}} ); // put value in "" to verify function in chrome
    }
}