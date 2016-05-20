/*
Initializations and settings for the Capture Widget.

For more information about these settings, see the following documents:

    http://developers.janrain.com/documentation/widgets/social-sign-in-widget/social-sign-in-widget-api/settings/
    http://developers.janrain.com/documentation/widgets/user-registration-widget/capture-widget-api/settings/
*/

/* Validate Group ID Here! */
function validateForgotPassword(e) {

    var regex = /^(\d{3}\d{3}\d{4}|([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?))$/;
    e.preventDefault();
    if (regex.test(document.getElementById("capture_forgotPassword_resetPasswordUserID").value)) {
        janrain.capture.ui.postCaptureForm('forgotPasswordForm');
        //document.getElementById('forgotFormButton').style.display = 'none';
        //document.getElementById("forgotFormSubmit").click();
    } else if (document.getElementById("capture_forgotPassword_resetPasswordUserID").value != '') {
        janrain.capture.ui.postCaptureForm('forgotPasswordForm');
        console.log('invalid.. fp GROUP ID');
       // document.getElementById('forgotPasswordGroupFailure').style.display = 'block';
        //document.getElementById('forgotPasswordForm').style.display = 'none';
        //  document.getElementById('forgotFormButton').style.display = 'none';
        // document.getElementById("forgotFormSubmit").click();
    } else {
        console.log('invalid blank fp');
    }
}




// This function is called by the Capture Widget when it has completred loading
// itself and all other dependencies. This function is required, and must call
// janrain.capture.ui.start() for the Widget to initialize correctly.
function janrainCaptureWidgetOnLoad() {
    var implFuncs = janrainExampleImplementationFunctions(); // Located below.

    /*==== CUSTOM ONLOAD CODE START ==========================================*\
    ||  Any javascript that needs to be run before screens are rendered but   ||
    ||  after the Widget is loaded should go between this comment and "CUSTOM ||
    ||  ONLOAD CODE END" below.                                               ||
    \*                                                                        */



    /*--
        SCREEN TO RENDER:
        This setting defines which screen to render. We've set it to the result
        of implFuncs.getParameterByName() so that if you pass in a parameter
        in your URL called 'screenToRender' and provide a valid screen name,
        that screen will be shown when the Widget loads.
                                                                            --*/
    window.janrain.settings.capture.screenToRender = implFuncs.getParameterByName('screenToRender');


    /*--
        EVENT HANDLING:

        Event Documentation:
        http://developers.janrain.com/reference/javascript-api/registration-js-api/events/
    --*/
    // janrain.events.onCaptureScreenShow.addHandler(implFuncs.enhanceReturnExperience);
    // janrain.events.onCaptureSaveSuccess.addHandler(implFuncs.hideResendLink);

    /*--
        NAVIGATION EVENTS:
        These event handlers are used for navigating the example implementation
        that exists on our servers for testing/demo/sample purposes. It is not
        required for your implementation, but can be modified to suit your
        needs. These event handlers are provided as an example.
                                                                            --*/
    // janrain.events.onCaptureLoginSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    // janrain.events.onCaptureSessionFound.addHandler(implFuncs.setNavigationForLoggedInUser);
    // janrain.events.onCaptureRegistrationSuccess.addHandler(implFuncs.setNavigationForLoggedInUser);
    // janrain.events.onCaptureSessionEnded.addHandler(implementationlFuncs.setNavigationForLoggedOutUser);
    //janrain.events.onCaptureLoginSuccess.addHandler(implFuncs.redirectOnLogin);
    // janrain.events.onCaptureLoginFailed.addHandler(implFuncs.handleDeactivatedAccountLogin);
    // janrain.events.onCaptureAccountDeactivateSuccess.addHandler(implFuncs.handleAccountDeactivation);


    /*--
        SHOW EVENTS:\\ubuntu14\share\eclipse-web\app\js\vendor\janrain-init.js
        Uncomment this line to show events in your browser's console. You must
        include janrain-utils.js to run this function.
                                                                            --*/

    //janrainUtilityFunctions().showEvents();

    /*                                                                        *\
    || *** CUSTOM ONLOAD CODE END ***                                         ||
    \*========================================================================*/

    // Custom password validation
    window.janrain.capture.ui.registerFunction('custom_password_validation', function(name, value, validation) {
        validation.pending();
        var regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%^&*.:;'"<>{}\[\]]+)$/;
        if (regex.test(value)) {
            validation.valid();
            return true;
        } else {
            validation.notValid("Invalid");
            return false;
        }
    });

    /* this is bind events with JanRain  into services/janrainEvents.js*/

    //get your angular element
    var elem = angular.element($('body'));
    //get the injector.
    var injector = elem.injector();
    //get the service.
    injector.get('janrainEvents');

    // This should be the last line in janrainCaptureWidgetOnLoad()
    window.janrain.capture.ui.start();

}



// Reference implementation navigation.
function janrainExampleImplementationFunctions() {

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    ///functions below are example events bind it to
    //  function setNavigationForLoggedInUser(result) {
    //      janrain.capture.ui.modal.close();

    //      // var photoType = janrain.capture.ui.getReturnExperienceData("uuid");
    //      document.getElementById("captureSignInLink").style.display  = 'none';
    //      document.getElementById("captureSignUpLink").style.display  = 'none';
    //      document.getElementById("captureSignOutLink").style.display = '';
    //      document.getElementById("captureProfileLink").style.display = '';
    //  }

    //  function setNavigationForLoggedOutUser(result) {
    //      document.getElementById("captureSignInLink").style.display  = '';
    //      document.getElementById("captureSignUpLink").style.display  = '';
    //      document.getElementById("captureSignOutLink").style.display = 'none';
    //      document.getElementById("captureProfileLink").style.display = 'none';
    //      document.getElementById("editProfile").style.display = 'none';
    //  }

    //  function enhanceReturnExperience(result) {
    //      if (result.screen == "returnTraditional") {
    //          var span = document.getElementById('traditionalWelcomeName');
    //          var name = janrain.capture.ui.getReturnExperienceData("displayName");
    //          if (span && name) {
    //              span.innerHTML = "Welcome back, " + name + "!";
    //          }
    //      }
    //  }


    //   function redirectOnLogin(result) {



    //       // Redirect the end-user to the edit profile page when they successfully
    //       // sign in. For your final implementation this could redirect to the
    //       // browser to the site the end-user initiated the authentication from or
    //       // hide the Janrain UI.
    //       //janrain.capture.ui.renderScreen("editProfile");
    //   }
    // function hideResendLink(result) {
    //     // Hide the 'Resend confirmation email' link if it's been clicked
    //     // from the edit profile page. Link will reappear if the user
    //     // refreshes their profile page.


    //     if(result.controlName == "resendVerificationEmail" &&
    //        result.screen == "editProfile") {
    //         document.getElementById("capture_editProfile_resendLink").style.display = 'none';
    //     }
    // }
    // function handleDeactivatedAccountLogin(result) {
    //     console.log(result);
    //     if (result.statusMessage == "accountDeactivated") {
    //         janrain.capture.ui.renderScreen('accountDeactivated');
    //     }
    // }
    // function handleAccountDeactivation(result) {
    //     if(result.status == "success") {
    //         document.getElementById("editProfile").style.display = 'none';
    //         janrain.capture.ui.modal.close();
    //         janrain.capture.ui.endCaptureSession();
    //         janrain.capture.ui.renderScreen('accountDeactivated');
    //     }
    // }
    return {
        // displayInline : displayInline,
        // setNavigationForLoggedInUser: setNavigationForLoggedInUser,
        // setNavigationForLoggedOutUser: setNavigationForLoggedOutUser,
        getParameterByName: getParameterByName
        // enhanceReturnExperience: enhanceReturnExperience,
        // redirectOnLogin: redirectOnLogin,
        // hideResendLink: hideResendLink,
        // handleDeactivatedAccountLogin: handleDeactivatedAccountLogin,
        // handleAccountDeactivation: handleAccountDeactivation
    };
}
