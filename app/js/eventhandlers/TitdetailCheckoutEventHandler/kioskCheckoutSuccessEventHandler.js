
function kioskCheckoutSuccessEventHandler($scope, $location, $routeParams, $timeout) {
    this.handleKeyDownEvent = handleKeyDownEvent;

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }


        switch (event.keyCode) {
            case KEY_CODES.DPAD_LEFT:
                {
                    break;
                }
            case KEY_CODES.DPAD_RIGHT:
                {
                    break;
                }
            case KEY_CODES.DPAD_DOWN:
                {

                    break;
                }
            case KEY_CODES.DPAD_UP:
                {

                    break;
                }
            case KEY_CODES.X:
                {
                    $("#ReserveDisk_1").click();
                    break;
                }
        }
    }
}