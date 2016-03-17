var popupObj_Meta = new Object;
// Inlined template for popup


var POPUP_ALERT_TEMPLATE = '<div class="alertcontents">' +
    '<div class="alertcontenttitle">$title$</div><div class="alertcontentsmsg">$alertmsg$<a id="0_10" class="alerthelpurl">NextVideo</a>' +
    '</div><div class="alertseperator"></div><div align="right" style="margin:20px;">' +
    '<button id="0_111" class = "alertboxbuttonclass" type="button" onclick ="HandleAlertBoxClick(1)">$button1$</button></div></div>';

var POPUP_TEMPLATE = '<div id="alert-popup-container">' +
    '<div id="PopupTitle" class="title2">title goes here</div>' +
    '<div class="alert-content">$alertmsg$' +
    '</div>'+
    '<div class="popupBottomShadow"></div> '+
    '<div id="buttonContainer">'+
    ' <div id="110_0" class="back-button-wrapper PopupButton">  '+
    ' cancel<span class="icons cancel-small"></span>  '+
    '  </div> '+
    '   <div id="110_1" class="back-button-wrapper PopupButton">  '+
    ' accept<span class="icons close-small"></span>'+
    '  </div>  '+
    ' </div> '+
    '</div>';


popupObj_Meta['Exit_PopUp'] = {
    title_text: 'Application Exit',
    msg_text: 'Do you want to exit from application?',
    button_1_text: 'OK',
    button_2_text: 'Cancel',
    button_1_click: function () {
        Exit_PopUpClick(1);
    },
    button_2_click: function () {
        Exit_PopUpClick(2);
    },
    seperator: true
};

popupObj_Meta['Error_PopUp'] = {

    title_text: 'Error Occurred',
    msg_text: 'An unexpected problem has occurred during processing your request. Please try again.',
    button_1_text: 'Cancel',
    button_2_text: 'OK',
    button_1_click: function () {
        helper.HidePopupBox();
    },
    button_2_click: function () {
        helper.HidePopupBox();
    },
    seperator: true
};
// Title Collection Not available
popupObj_Meta['Error_Title_Collection_Not_Available'] = {

    title_text: 'Sorry',
    msg_text: '<p>Title Collection Not Available.</p>',
    button_1_text: '',
    button_2_text: 'OK',
    //button_1_click: function () {helper.HidePopupBox();},
    button_2_click: function () {
        helper.HidePopupBox();
    },
    seperator: true
};
// Title not available
popupObj_Meta['Error_Title_Not_Available'] = {

    title_text: 'Sorry',
    msg_text: '<p>Title Not Available.</p>',
    button_1_text: '',
    button_2_text: 'OK',
    //button_1_click: function () {helper.HidePopupBox();},
    button_2_click: function () {
        helper.HidePopupBox();
    },
    seperator: true
};


// Failed login
popupObj_Meta['Popup_LOGIN_FAIL'] = {
    title_text:'Sorry',
    msg_text:'Invalid username or password. Please try again.',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { helper.HidePopupBox(); },
    seperator:true
};

// User Profile
popupObj_Meta['USER_PROFILE'] = {
    title_text:'Almost Done...',
    msg_text:'We need some additional information. Please visit your Account on <br> www.redboxinstant.com to update your profile. Once you do that, come back so you can conveniently rent or buy movies on demand with ease.',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { helper.HidePopupBox(); },
    seperator:true
};

// Playback error on preview
popupObj_Meta['Popup_PREVIEW_ERROR'] = {
    title_text:'Sorry',
    msg_text:'Unable to play the preview.',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { helper.HidePopupBox();},
    seperator:true
};

popupObj_Meta['Popup_RESTRICT_PURCHASE_OFF'] = {
    title_text: 'Purchase Restrictions',
    msg_text: '<p>Purchases will not be restricted.</p>',
    button_1_text: 'CANCEL',
    button_2_text: 'ACCEPT',
    button_1_click: function ($scope) {
        $scope.eventHandler.RestrictCancel();
    },
//    button_2_click: function ($scope) {
//        $scope.eventHandler.RestrictContent();
//    },
    seperator: true
};
popupObj_Meta['Popup_RESTRICT_PURCHASE'] = {
    title_text: 'Purchase Restrictions',
    msg_text: '<p>Would you like to restrict all purchases? This means that in order to make a purchase you will have to enter your account password on this device.</p>',
    button_1_text: 'CANCEL',
    button_2_text: 'ACCEPT',
    button_1_click: function ($scope) {
        $scope.eventHandler.RestrictCancel();
    },
//    button_2_click: function ($scope) {
//        $scope.eventHandler.RestrictContent();
//    },
    seperator: true
};

popupObj_Meta['Popup_RESTRICT_CONTENT'] = {
    title_text: 'Content Restrictions',
    msg_text: '<p>Would you like to restrict content? This means that in order to view content above G, TY-Y and TV-G, you will have to enter your account password on this device.</p>',
    button_1_text: 'CANCEL',
    button_2_text: 'ACCEPT',
    button_1_click: function ($scope) {
        $scope.eventHandler.RestrictCancel();
    },
//    button_2_click: function ($scope) {
//        $scope.eventHandler.RestrictContent();
//    },
    seperator: true
};


popupObj_Meta['Popup_are_you_sure'] = {
    title_text: '<p></p>',
    msg_text: '<div><div><img id ="titleImage" class="Imgclass" src="../../images/missing-128-192.png"></div><div class = "TextStyle"><div class="popuptitleclass"> Are you sure?</div><div class="messageclass">By Selecting "I&#39m Done", this title will be removed from &#39Finished Watching&#39 section of My Redbox Dashboard.</div></div></div>',
    button_1_text: 'CANCEL',
    button_2_text: 'OK',
    button_1_click: function () {
        Popup_are_you_sure_Click(1);
    },
    button_2_click: function () {
        Popup_are_you_sure_Click(2);
    },
    seperator: true
};

popupObj_Meta['POPUP_TITLE_UNAVAILABLE'] = {
    title_text: 'Title Unavailable',
    msg_text: '<div id = "full_synopsis_popup_msg"></div>',
    button_1_text: '',
    button_2_text: 'OK',
    button_1_click: function () {
        eula(1);
    },
    button_2_click: function () {
        Popup_title_unavailable_Click(2);
    },
    seperator: true
};


 popupObj_Meta['Popup_MISSING_INFO_BILLING_INFO'] = {
 title_text: 'Missing Card Information',
 msg_text: '<p>Your account is missing billing information. In order to continue you must update your credit card information.</p>',
 button_1_text: 'Not Now',
 button_2_text: 'Update',
 button_1_click: function () { $scope.isFromKiosk(1); },
 button_2_click: function () { $scope.isFromKiosk(2); },
 seperator: true
 };

popupObj_Meta['Popup_ABANNDON_CART'] = {
    title_text: 'Hang On There...',
    msg_text: '<p>Are you sure you want to abandon your cart? You will lose all the titles you have previously selected and will no longer be viewing titles in your selected kiosk.</br></br>To do this, continue on by selecting "OK";.</br><br>If you want to return to checkout, select "Checkout".</br></br></p>',
    button_1_text: 'OK',
    button_2_text: 'CHECKOUT',
    button_1_click: function () {
        AbandonCartClick(1);
    },
    button_2_click: function () {
        AbandonCartClick(2);
    },
    seperator: true
};

popupObj_Meta['Abondon_Popup'] = {
    title_text: 'Abandon Checkout',
    msg_text: 'Are you sure you want to abandon your cart? You will lose all the title which you have previously selected.',
    button_1_text: 'YES',
    button_2_text: 'NO',
    button_1_click: function () {
        HandlePopupBoxClick(1);
    },
    button_2_click: function () {
        HandlePopupBoxClick(2);
    },
    seperator: true
};

popupObj_Meta['Popup_VALIDATION_FAIL'] = {
    title_text:'Error',
    msg_text:'<p>Upon submission, your payment method will be stored and will become effective immediately after the conclusion of the one-month free trial. All future [X – the entity that will show on the credit card receipt] subscription charges will be billed to the card shown below.</p><p>Please carefully read the Terms and Conditions for this automatic payment option. By enrolling in, using or paying for [X – the entity that will show on the credit card receipt] services by automatic payment, you agree to these terms and conditions. Checking the box means you</p>',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { PopupBox.Hide(); if(isDefined(alertVisible)) alertVisible = 0;},
    seperator:true
};


popupObj_Meta['Popup_ADDCARD_FAIL'] = {
    title_text: 'Cannot Add Card',
    msg_text: '<p>You already have the maximum number of payment cards. To add a new payment card, first remove an existing one by visiting redboxinstant.com or redbox.com</p>',
    button_1_text: '',
    button_2_text: 'OK',
    button_2_click: function () { PopupBox.Hide(); if (isDefined(alertVisible)) alertVisible = 0; },
    seperator: true
};

popupObj_Meta['Popup_RENTBUY_FAIL'] = {
    title_text: 'Sorry',
    msg_text: 'We are facing some probem please try after some time',
    button_1_text: '',
    button_2_text: 'OK',
    button_2_click: function () { helper.HidePopupBox(); },
    seperator: true
};

popupObj_Meta['Popup_CHANGECARD_FAIL'] = {
    title_text: 'Sorry',
    msg_text: 'We are facing some probem please try after some time',
    button_1_text: '',
    button_2_text: 'OK',
    button_2_click: function () { helper.HidePopupBox(); },
    seperator: true
};

// User Profile
popupObj_Meta[GO_TO_WEB_FOR_SUBSCRIPTION] = {
    title_text:'Sorry',
    msg_text:'Please visit www.redboxinstant.com for subscription.',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { helper.HidePopupBox(); },
    seperator:true
};

popupObj_Meta["Popup_CVV_HELP"] = {
    title_text:'CVV stands for Card Verification Value',
    msg_text:'It is a 3 or 4 digit number that can be found on your card. Where it is depends on the type of card.<div class="card-image-container"><div class="card-image-holder"><div class="american-card-image"></div><div class="card-image-holder-text">American Express</div></div><div class="card-image-holder"><div class="visa-card-image"></div><div class="card-image-holder-text">Visa, MasterCard or Discover</div></div></div>',
    button_1_text:'',
    button_2_text:'OK',
    button_2_click: function() { helper.HidePopupBox(); },
    seperator:true
};

popupObj_Meta['Popup_EXIT_PLAYER'] = {
    title_text: 'Are you sure?',
    msg_text: '<p>Are you sure you want to exit playback?</p>',
    button_1_text: 'No',
    button_2_text: 'Yes',
    button_1_click: function () {
        helper.HidePopupBox(); // No
    },
    seperator: true
};


popupObj_Meta['Popup_EXIT_APP'] = {
	    title_text: 'Application Exit?',
	    msg_text: 'Do you want to exit from application?',
	    button_1_text: 'Cancel',
	    button_2_text: 'OK',
	    seperator: true
	};

popupObj_Meta['Popup_PSN_LOGIN'] = {
    title_text: 'Please Note',
    msg_text: '<p>You have been signed out of the PlayStation®Network. All account and movie selection features of the Redbox Instant application will remain unusable until you sign in again.</p>',
    button_1_text:'',
    button_2_text: 'Sign In',
    seperator: true
};


// Failed createAccount
popupObj_Meta['Popup_CREATE_ACCOUNT_FAIL'] = {
   // title_text: 'Sorry',    
    button_1_text: '',
    button_2_text: 'OK',    
    seperator: true
};

popupObj_Meta['Popup_ATTEMPTING_RECONNECT'] = {
    title_text: 'Please Wait...',
    msg_text: '<p>We are checking the network to assure the internet is restored before proceeding.</p>',
    button_1_text:'',
    button_2_text: '',
    seperator: false
};

// Credit card update required
popupObj_Meta['Popup_UPDATE_REQUIRED'] = {
    title_text: 'Update Required',
    msg_text: '',
    msg_text_template: '<p>It looks like we\'re missing some billing information that is needed to charge your card ending in {cardNumber}. Your subscription will end on {billingDate} unless you enter the missing information.<p>',
    button_1_text: 'Not Now',
    button_2_text: 'OK',
    seperator: true
};

// ZOE-30494: Failed or pending subscription experience
popupObj_Meta['Popup_WATCH_NOW_ERROR'] = {
    title_text: 'Sorry',
    msg_text: '<p>We\'re not yet done setting up your account. Try again in a few minutes or contact customer support for help if this persists.</p>',
    button_1_text: '',
    button_2_text: 'OK',
    seperator: true
};

// ZOE-30490: Notify of subscription fail popup
popupObj_Meta['Popup_NOTIFY_OF_SUBSCRIPTION_FAIL'] = {
    title_text: 'Credit Card Update Needed',
    msg_text:'<p>Your credit card needs updating and your subscription has been cancelled. After you update your credit card, please repurchase your subscription via your Account.</p>'+
              '<div class="form-container"><div class="check-box"><input type="checkbox" onclick="helper.clickCheckbox(\'remind-checkbox\');" id="remind-checkbox"><span>Do not remind me again</span></div></div>',
    button_1_text: 'Later',
    button_2_text: 'Update Now',
    checkboxId: 'remind-checkbox',
    seperator: true
};

// ZOE-35303: App force upgrade popup
// The message was taken from ZOE-17174 - //TODO: check if it is correct
popupObj_Meta['Popup_APP_UPGRADE_REQUIRED'] = {
    title_text: 'App Update Required',
    msg_text:'<p>We have improved the Redbox Instant by Verizon service, and your app is now out of date. Please go to the Smart Hub to update it.</p>',
    button_1_text: 'Exit',
    button_2_text: 'Update Now',
    seperator: true
};