var PLAYER_IDLE_TIME_TOSTART_CALL = 1000;

//to show player UI
function ShowPlayerLayout() {
    angular.element("#bottomContainer").css('visibility', 'visible');
    angular.element("#playerButtonDiv").css('visibility', 'visible');
    angular.element("#" + state).css('visibility', 'visible');
    angular.element("#title_progress_status_bar").css('visibility', 'visible');
    angular.element("#TdInfo").css('visibility', 'visible');
    //$("#QMenu").css('visibility', 'visible');
    //HideInfoPopup();
}
var state;
//to hide player UI
function HidePlayerLayout() {

    angular.element("#bottomContainer").css('visibility', 'hidden');
    if (angular.element("#play").css('visibility') == 'visible') {
        state = "play";
        angular.element("#play").css('visibility', 'hidden');
    } else if (angular.element("#pause").css('visibility') == 'visible') {
        state = "pause";
        angular.element("#pause").css('visibility', 'hidden');
    }
    if (angular.element("#suggestionDiv").css('visibility') == 'visible') {
        angular.element("#play").css('visibility', 'hidden');
        angular.element("#pause").css('visibility', 'hidden');
    }
    angular.element("#playerButtonDiv").css('visibility', 'hidden');
    angular.element("#title_progress_status_bar").css('visibility', 'hidden');
    //HideInfoPopup();
    angular.element("#TdInfo").css('visibility', 'hidden');
    angular.element("#TdInfoClose").css('visibility', 'hidden');
}


//timeout is in milliseconds; defaults to 30000
$.idleTimer(PLAYER_IDLE_TIME_TOSTART_CALL);

angular.element(document).bind("idle.idleTimer", function () {
    // function you want to fire when the user goes idle
    HidePlayerLayout();
});

angular.element(document).bind("active.idleTimer", function () {
    // function you want to fire when the user becomes active again
    if (angular.element("#suggestionDiv").css('visibility') != 'visible') {
        ShowPlayerLayout();
    }

});