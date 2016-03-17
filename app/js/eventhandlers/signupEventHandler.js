/**
 * Created with JetBrains WebStorm.
 * User: dana
 * Date: 8/15/13
 * Time: 11:20 AM
 * To change this template use File | Settings | File Templates.
 */
function signupEventHandler($scope, $location) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    function handleKeyDownEvent(event) {


        switch (event.keyCode) {
            case KEY_CODES.CIRCLE:
            {
                //** Resetting the MENU back to its original form
                $("#menu-button-wrapper").css("display","block");
                $("#back-button-wrapper").html("<span class='icons cancel-small-noshadow'></span>Back");
                handleMainMenu($scope, event.keyCode, $location);
                break;
            }
        }
    }
}
