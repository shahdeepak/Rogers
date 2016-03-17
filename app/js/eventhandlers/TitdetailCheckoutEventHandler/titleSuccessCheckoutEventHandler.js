function titleSuccessCheckoutEventHandler($scope, $location, $routeParams, rbiCommonService, $timeout) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.titleCheckoutSuccessMouseOver = titleCheckoutSuccessMouseOver;
    this.watchNowClick = watchNowClick;

    function titleCheckoutSuccessMouseOver(Level_button, btnID) {
        if (rbiCommonService.isSharedItemExist(IS_INSTANT_OPTION)) {
            rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
        }
        $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).blur();
        $scope.currentSuccessLevel = Level_button;
        $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex = btnID;
        if (Level_button == 0)
        $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).focus();

    }

    function watchNowClick() {
        // var ratingValue = rbiCommonService.getSharedItem("RATING");  // not needed here
        // helper.debugLog("RATING IS: " + ratingValue);

        if ($scope.currentSuccessLevel == 1 && $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex == 1)
            $scope.checkOutWatchNow();
        else
            $("#titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).click();
    }

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE || $('.popupboxouterdiv').is(":visible") == true) {
            PopupBox.HandleKeyPress();
            return false;
        }
        if (rbiCommonService.isSharedItemExist(IS_INSTANT_OPTION)) {
            rbiCommonService.removeSharedItem(IS_INSTANT_OPTION);
        }


        switch (event.keyCode) {
            case KEY_CODES.DPAD_LEFT:
            {

                $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).blur();

                if ($scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex > 0) {
                    $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex--;
                }


                $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).focus();

                break;
            }

            case KEY_CODES.DPAD_RIGHT:
            {

                $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).blur();

                if ($scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex < $scope.titlesuccessLevel[$scope.currentSuccessLevel].maxElement - 1) {
                    $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex++;
                }

                $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).focus();


                break;
            }

            case KEY_CODES.DPAD_DOWN:
            {

                $scope.currentSuccessLevel = 1;

                $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).focus();
                break;
            }

            case KEY_CODES.DPAD_UP:
            {
                if ($scope.RecommendedProductsResponse.length > 0) {
                    $("#" + "titleconfirmcheckout_" + $scope.currentSuccessLevel + "_" + $scope.titlesuccessLevel[$scope.currentSuccessLevel].currentIndex).blur();
                    $scope.currentSuccessLevel = 0;
                    $scope.titlesuccessLevel[$scope.currentSuccessLevel].maxElement = $scope.RecommendedProductsResponse.length > 4 ? 4 : $scope.RecommendedProductsResponse.length;
                } else {

                }
                break;
            }
            case KEY_CODES.X:
            case KEY_CODES.F:
                watchNowClick();
                break;
            case KEY_CODES.CIRCLE:
                $scope.goBack();
                break;
        }
    }

}