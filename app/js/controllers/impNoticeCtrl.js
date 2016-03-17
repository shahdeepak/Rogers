'use strict';

rbi.controller('impNoticeCtrl', function ($scope, $location, $routeParams, $dialog, rbiCommonService, loginService, customerService) {
    //Omniture
    Omniture.pageName = "";


    $scope.omnitureReady = [true];
    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            if (internetConnected) {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|accept terms";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|accept terms";
                Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|accept terms";
                Omniture.Variables.eVar54 = "+1";
                Omniture.Variables.events = ["event23"];
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
        }
    });
    //Omniture

    if (typeof $routeParams.returnURL1 != 'undefined') {
        $scope.returnUrl = $routeParams.returnURL1;
    }
    else {
        $scope.returnUrl = '';
    }
    if (typeof $routeParams.returnURL2 != 'undefined') {
        $scope.returnUrl += '/' + $routeParams.returnURL2;
    }
    if (typeof $routeParams.returnURL3 != 'undefined') {
    	$scope.returnUrl += '/' + $routeParams.returnURL3;
    }

    hideMainMenu();


    $scope.eventHandler = new ImpNoticeEventHandler($scope, $location, $routeParams);
   $('#main-menu-return').css('display','none');

    $scope.mainMenuReturn = {display : false};
    $scope.isVerizonPolicyOpen = false;
    $scope.isRedboxPolicyOpen = false;
    $scope.Offset = 150;
    $scope.redboxstartpos = 0;
    $scope.verizonstartpos = 0;

    var loginTimeout = null;
    helper.SetButtonFocus('#sign-in-button');

    $scope.acceptSignIn = function () {
        var user = rbiCommonService.getSharedItem("USER_CRED");
        disableHttpSpinner = true;
        helper.showSpinner (config.SPINNER_FADEOUT_MS, config.spinnerPosition);
        loginService.Login(user.emailAddress, user.password, true, function (data) {
            disableHttpSpinner = false;
            helper.hideSpinner();
            if (loginTimeout != null) {
                clearTimeout(loginTimeout);
            }
            LoginSuccessCallback();

            // ZOE-29733: CommonHTML: Remove check and prompt for all missing customer profile information on Mobile and TV clients
           /*
            if (loginService.UpdateProfileNeeded(data)) {

                platformStorage.setItem(UPDATE_NEEDED, "true");
                $location.path("/createAccount/true");
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                //$scope.$apply();
            }
            else {
                $scope.LoginSuccessCallback();
            }  */

        }, function (data) {
        	//Display a popup to the user
            helper.hideSpinner();
            if ($scope.loginTimeout != null) {
                clearTimeout($scope.loginTimeout);
            }
            disableHttpSpinner = false;
            helper.showErrorMessage(data, $scope);
        });

        // login timeout
        loginTimeout = setTimeout(function () {
            helper.hideSpinner();
            if (helper.isUserLoggedIn()) {
                LoginSuccessCallback();
            }
            else {
                helper.ShowPopupBox('Error_PopUp', $scope);
            }
        }, LOGIN_TIMEOUT);
    };


    function LoginSuccessCallback () {
       if (helper.isUserLoggedIn()) {
            helper.debugLog('login successful');
	        platformStorage.setItem("is_Helpoverlayeopen", "true");

           if (RBI.PlatformConfig.activateDevice) {
               loginService.ProcessDeviceActivation();
           }

           // Process free trial entry - ZOE 29147
           if (helper.isFreeTrialEntry(rbiCommonService)) {
               helper.processFreeTrial($scope, $location, customerService, rbiCommonService, true);
           }
           else {
               // ZOE-33373 - Take user to 'How about subscription' page after login
               $location.path("/freeTrial");
           /*
               customerService.getCustomer(function (customerData) {
                   helper.processCustomerData(customerData, customerService, rbiCommonService, $scope, $location);
               }, function (data) {
                   // If getCustomer fails show an error message and redirect user from login page
                   helper.debugLog("Get Customer error");
                   helper.showErrorMessage(data, $scope);
                   helper.redirectFromLoginPage($scope, $location);
               }); */
           }
    	}    	
    };

    $scope.redirectUserToLoginPage = function () {
    	$("#main-menu-return").show();
        helper.debugLog("Redirecting back to login page");
        $location.path("/login");
    };

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
});