'use strict';
/**
 * EULA Event Handler
 * This class should handle event like keyEvent etc.
 * There should not be any business logic present in it. Business logic call should be in
 * service and called from controller using $scope.
 */

function EulaEventHandler($scope) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.handleEulaEvent=handleEulaEvent;

    function handleKeyDownEvent(event) {
        
        MAX_HEIGHT_EULA = $("#eula-content")[0].scrollHeight - (3 * $scope.offset);
        
        if(POP_ALERT_BOX_VISIBLE){
        	PopupBox.HandleKeyPress();
            return false;
           }
        else{
        	switch (event.keyCode) {

            case KEY_CODES.DPAD_DOWN:
            {
                if ($scope.startpos < MAX_HEIGHT_EULA) {
                    $scope.startpos = $scope.startpos + $scope.offset;
                    $("#eula-content").stop().animate({ scrollTop: $scope.startpos }, $scope.scrollDown);
                }
                break;
            }
            case KEY_CODES.DPAD_UP:
            {

                if ($scope.startpos >= $scope.offset) {
                    $scope.startpos = $scope.startpos - $scope.offset;
                    $("#eula-content").stop().animate({ scrollTop: $scope.startpos }, $scope.scrollDown);
                }
                break;
            }
            case KEY_CODES.X:
            {
               // Enter Key Accept function
            	handleEulaEvent();
                break;
            }
            case KEY_CODES.CIRCLE:
            {
                // X Key Cancel
                $scope.handleEula('cancel');
                break;
            }
        }
        }
    }
    /**
     * magic remote Implementation for Eula Accept button
     * @return 
     */
    function handleEulaEvent() {
   	 $scope.handleEula('accept');
    }
}