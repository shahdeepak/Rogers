// Level map to keep track of focus management
var LEVEL_POPUP = 0;
var levelPopupMap = new Array();

levelPopupMap[0] = {
	CurrentIndex : 222,
	MaxElements : 223,
	CanHandleDnKey : false,
	CanHandleUpKey : false,
	FirstElement : 0
};
// by default promo level will have focus
var PopupCurrentLevelIndex = LEVEL_POPUP;
var popupcurrentIndex;
var popupcurrentFocusedEleId;
var updownmoveflag = false;
var button_1_callback ;
var button_2_callback ;
var SingleButton;
var popupControllerScope;
var currentPopupKey;

var PopupBox = {
    Message: '',
    Title: '',
    Button1: '',
    Button2: '',
    CallBack: null,
    html: '',
    tpltemp: '',
    Seperator: '',
    popupkey: '',
    checkboxId: '',
    //tpl: '<div class="popupcontents"><div class="title1 popupcontenttitle">$title$</div><div class="popupcontentsmsgshow"><div id = "popupcontentsmsg" class="popupcontentsmsg">$popupmsg$</div></div><div class="popupseperator"></div><div align="right" style="margin:20px;"><button id="0_221" class = "popupboxbuttonclass" type="button" onmouseover= "PopupBox.popupmouseover(\'0_221\')" onmouseout="PopupBox.popupmouseout(\'0_221\')">$button1$</button><button id="0_222" class = "popupboxbuttonclass" type="button" onmouseover= "PopupBox.popupmouseover(\'0_222\')" onmouseout= "PopupBox.popupmouseout(\'0_222\')">$button2$</button></div><div class="popupboxmsgup" id = "1" onclick="PopupBox.HandleArrow(\'1\')" onmouseover= "PopupBox.Arrowmouseover(\'1\')" onmouseout= ""></div><div class="popupboxmsgdown" id = "2" onclick="PopupBox.HandleArrow(\'2\')"onmouseover= "PopupBox.Arrowmouseover(\'2\')" onmouseout= ""></div></div>',

    /*tpl: '<div class="popupcontents" style="z-index:9999"><div class="title1 popupcontenttitle">$title$</div>' +
        '<div class="popupcontentsmsgshow" style="margin-bottom:50px;"><div id = "popupcontentsmsg" class="popupcontentsmsg">$popupmsg$</div></div><div class="popupseperator"></div>' +
        '<div class="err-popup-btns popup-error-btn-1" >' +
        '<div id="0_221" class="back-button-wrapper popup-ok-button popup-error-btn-1-wraper"  onclick="PopupBox.PopupBoxClick(\'0_221\')"onmouseover= "PopupBox.PopupBoxMouseOver(\'0_221\')"> ' +
        '$button1$<span class="icons cancel-small" style="float:right;margin-top:-6px;margin-left: 8px;"></span></div></div>' +
        '<div class="err-popup-btns" style="font-weight: bold;color:#808285;position:absolute; right:0px; bottom:0;margin:20px;float: right;text-align: center;"> ' +
        '<div id="0_222"  class="back-button-wrapper popup-ok-button "  onclick="PopupBox.PopupBoxClick(\'0_222\')"onmouseover= "PopupBox.PopupBoxMouseOver(\'0_222\')"> ' +
        '$button2$<span class="icons close-small" style="float:right;margin-top:-6px;margin-left: 5px;"></span></div></div>' +
        '<div class="popupboxmsgup" id = "1" onclick="PopupBox.HandleArrow(\'1\')" onmouseover= "PopupBox.Arrowmouseover(\'1\')" onmouseout= "">' +
        '</div><div class="popupboxmsgdown" id = "2" onclick="PopupBox.HandleArrow(\'2\')"onmouseover= "PopupBox.Arrowmouseover(\'2\')" onmouseout= ""></div></div>',*/

    tpl: '<div class="popupcontents" style="z-index:9999"><div class="title1 popupcontenttitle">$title$</div>' +
        '<div class="popupcontentsmsgshow" style="margin-bottom:50px;"><div id = "popupcontentsmsg" class="popupcontentsmsg">$popupmsg$</div></div><div class="popupseperator"></div>' +
        '<div class="popup-btn-container"> <div class="popup-btn-set">' +
        '<div id="0_221" class="popup-cancel-btn"  onclick="PopupBox.PopupBoxClick(event)"onmouseover= "PopupBox.PopupBoxMouseOver(\'0_221\')"> ' +
        '$button1$<span class="icons cancel-small" style="float:right;margin-top:-6px;"></span></div></div>' +
        '<div class="popup-btn-set set2" > ' +
        '<div id="0_222"  class="popup-accept-btn"  onclick="PopupBox.PopupBoxClick(event)"onmouseover= "PopupBox.PopupBoxMouseOver(\'0_222\')"> ' +
        '$button2$<span class="icons close-small" style="float:right;margin-top:-6px;margin-left: 5px;"></span></div></div> </div>' +
        '<div class="popupboxmsgup" id = "1" onclick="PopupBox.HandleArrow(\'1\')" onmouseover= "PopupBox.Arrowmouseover(\'1\')" onmouseout= "">' +
        '</div><div class="popupboxmsgdown" id = "2" onclick="PopupBox.HandleArrow(\'2\')"onmouseover= "PopupBox.Arrowmouseover(\'2\')" onmouseout= ""></div></div>',

    AddCallBack: function (callback) {
        this.CallBack = callback;
    },
    Init: function (popupkey, $scope) {
        levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = 222;
        this.PopulateTemp(popupkey);
        this.tpltemp = this.tpl;
        var msg = {};
        msg.popupmsg = this.Message;
        this.tpltemp = PopulateTemplate(this.tpltemp, msg);

        var title = {};
        title.title = this.Title;
        this.tpltemp = PopulateTemplate(this.tpltemp, title);

        var button1 = {};
        button1.button1 = this.Button1;
        this.tpltemp = PopulateTemplate(this.tpltemp, button1);

        var button2 = {};
        button2.button2 = this.Button2;
        this.tpltemp = PopulateTemplate(this.tpltemp, button2);

        this.html = this.tpltemp;
        popupControllerScope = $scope;

        this.popupkey = popupkey;
        currentPopupKey = popupkey;
    },
    ExecuteCallback: function () {
        //helper.debugLog(this.CallBack);
    },
    Show: function (popupkey, $scope) {
        this.Init(popupkey, $scope);
        $(".popupboxouterdiv").show();

        document.getElementById('popupboxcontainer').innerHTML = this.html;
        //CurrentIndex = 222;

        var popupcontentsmsgHeight = $(".popupcontentsmsg").height();
        //Logger.Log("popupBox::popupcontentsmsgHeight::" + popupcontentsmsgHeight);

        if (popupcontentsmsgHeight > 325) {
            // total height of all other components of PopBox box.
            var otherContentHeight = 60;
            //To set height and all other properties of PopBox box dynamically
            var popupboxHeight = 370 + otherContentHeight;
            //helper.debugLog("popupcontentsmsgHeight.. "+popupcontentsmsgHeight);
            //var popupboxHeight = 500;
            $(".popupcontents").height(popupboxHeight);
            //$(".popupcontentsmsg").height(8000);
            updownmoveflag = true;

        } else if(popupcontentsmsgHeight > 100 && popupcontentsmsgHeight < 200){
			var popupboxHeight = 325;
            $(".popupcontents").height(popupboxHeight);
            $(".popupcontentsmsgshow").height(popupcontentsmsgHeight);
            $(".popupcontentsmsg").css('margin-top', '0px');
            $(".popupboxmsgup").hide();
            $(".popupboxmsgdown").hide();
            $(".popupcontentsmsgshow").css("overflow", "visible");
		}else {
            var popupcontentsmsgHeight = $(".popupcontentsmsg").height();
            //Logger.Log("popupBox::popupcontentsmsgHeight::" + popupcontentsmsgHeight);
            // total height of all other components of PopBox box.
            var otherContentHeight = 240;
            //To set height and all other properties of PopBox box dynamically
            var popupboxHeight = popupcontentsmsgHeight + otherContentHeight;
            $(".popupcontents").height(popupboxHeight);
            $(".popupcontentsmsgshow").height(popupcontentsmsgHeight);
            $(".popupcontentsmsg").css('margin-top', '0px');
            $(".popupboxmsgup").hide();
            $(".popupboxmsgdown").hide();
            $(".popupcontentsmsgshow").css("overflow", "visible");

        }
        //code to hide null button
        if (this.Button1 == '') {
            //helper.debugLog("SetButton1 is null");
            $("#0_221").css("display", "none");
            CurrentIndex = 222;
            SingleButton = true;

        } else {
            //helper.debugLog("SetButton1 is not null");
            SingleButton = false;
        }
        if (this.Button2 == '') {
            //helper.debugLog("SetButton1 is null");
            $("#0_222").css("display", "none");
            helper.SetFocus("0_221");
            CurrentIndex = 221;
            SingleButton = true;

        } else {
           	//helper.debugLog("SetButton1 is not null");
           if (this.Button1 != '')
             SingleButton = false;
        }
        //code to Hide Seperator
        if (!this.Seperator) {
            //helper.debugLog("inside"+this.Seperator);
            $(".popupseperator").css("visibility", "hidden");
        }
        
        // Add exit class to Upgrade pop up
        if(popupkey == "Popup_APP_UPGRADE_REQUIRED"){
        	$("#0_221").addClass('exit');	
        }
        
        $(".popupcontents").css('left', '0');
        $(".popupcontents").css('right', '0');
        $(".popupcontents").css('top', '0');
        $(".popupcontents").css('bottom', '0');
        $(".popupcontents").css('margin', 'auto');
        $(".popupcontents").css('margin', 'auto');
        $(".popupcontents").css('border-radius', '10');

        //Adding onclick event for Button 
        $("#0_221").click(function () {
            popupObj_Meta[popupkey].button_1_click(popupControllerScope);
        });
        $("#0_222").click(function () {
            popupObj_Meta[popupkey].button_2_click(popupControllerScope);
        });
        $("#accept_1").click(function () {
            popupControllerScope.eventHandler.handleKeyDownEvent();
        });
        this.html = '';
        this.tpltemp = '';
        //if(isDefined(popupControllerScope))
        POP_ALERT_BOX_VISIBLE = true;   // ZOE 25244 - need to make this independent of scope
      this.removeUnwantedFocus();
    },
    Hide: function () {
        $(".popupboxouterdiv").hide();
        alertVisible = 0;
        document.getElementById('popupboxcontainer').innerHTML = '';
        //if(isDefined(popupControllerScope))
        POP_ALERT_BOX_VISIBLE = false;  // ZOE 25244 - need to make this independent of scope
    },
    HideButton: function () {
        $(".popupboxbuttonclass").hide();
        //document.getElementById('popupboxcontainer').innerHTML = '';
    },

    Listener: function (args) {
        this.CallBack({
            src: 'popupbox',
            retval: args
        });
    },
    SetMessage: function (Message) {
        this.Message = Message;

    },
    SetTitle: function (Title) {
        this.Title = Title;

    },
    SetButton1: function (Button1) {
        this.Button1 = Button1;
    },
    SetButton2: function (Button2) {
        this.Button2 = Button2;
    },
    SetSeperator: function (Seperator) {
        this.Seperator = Seperator;
    },
    SetCheckbox: function (checkboxId) {
        if (typeof checkboxId != 'undefined') {
            this.checkboxId = checkboxId;
        }
    },

    HighlightCurrentElement: function () {
        popupcurrentIndex = levelPopupMap[PopupCurrentLevelIndex].CurrentIndex;
        popupcurrentFocusedEleId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;
        helper.SetFocus(popupcurrentFocusedEleId);
    },
PopupBoxClick : function(event){
    PopupBox.HandleKeyPress();
},

PopupBoxMouseOver: function (id) {
	this.removeUnwantedFocus();
    $('#restrictContentPassword').removeClass("textbox-highlight-highlight");
    $('#restrictContentPassword').removeClass("textbox-highlight");
    helper.RemoveFocus("restrictPurchasePassword");
    helper.RemoveFocus("restrictContentPassword");
	helper.SetFocus(id);
},
    HandleKeyPress: function (clickHandle)
        {
            popupcurrentIndex = levelPopupMap[PopupCurrentLevelIndex].CurrentIndex;
            popupcurrentFocusedEleId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;

            //Logger.Log("PopBoxBox::popupcurrentIndex in handlekey press::" + popupcurrentIndex);
            //Logger.Log("PopBoxBox::popupcurrentFocusedEleId in handlekey press::" + popupcurrentFocusedEleId);

            var msgheight = $(".popupcontentsmsg").height();
            //var msgheight = 8000; 
            //helper.debugLog("margine hieght....."+msgheight)
            if(clickHandle){
                popupObj_Meta[this.popupkey].button_2_click(popupControllerScope);
                return;
            }
            switch (event.keyCode) {

                case KEY_CODES.DPAD_RIGHT:
                    { // Right Arrow
                        if (this.checkboxId != '' &&  helper.checkboxHasFocus(this.checkboxId)) {
                            helper.removeCheckboxFocus(this.checkboxId);
                        }
                        else if (!SingleButton) {

                            var levelLastId = levelPopupMap[PopupCurrentLevelIndex].MaxElements;
                            popupcurrentIndex++;


                            if (popupcurrentIndex < levelLastId) {
                                helper.RemoveFocus(popupcurrentFocusedEleId);
                                var nextFocusId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;
                                helper.SetFocus(nextFocusId);
                                levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = popupcurrentIndex;
                            } else {
                                popupcurrentIndex--;
                                helper.RemoveFocus(popupcurrentFocusedEleId);
                                var nextFocusId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;
                                helper.SetFocus(nextFocusId);
                                levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = popupcurrentIndex;
                            }
                        } else {
                            helper.RemoveFocus("1");
                            helper.RemoveFocus("2");
                        }
                        break;
                    }
                case KEY_CODES.DPAD_LEFT:
                    { // Left Arrow
                        if (this.checkboxId != '' &&  popupcurrentIndex == 221) {
                            helper.setCheckboxFocus(this.checkboxId);
                        }
                        else if (!SingleButton) {
                            if (popupcurrentIndex > 221) {
                                helper.RemoveFocus(popupcurrentFocusedEleId);
                                var nextFocusId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;
                                helper.SetFocus(nextFocusId);
                                levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = popupcurrentIndex;
                            } else {
                                var levelLastId = levelPopupMap[PopupCurrentLevelIndex].MaxElements;
                                popupcurrentIndex++;


                                if (popupcurrentIndex < levelLastId) {
                                    helper.RemoveFocus(popupcurrentFocusedEleId);
                                    var nextFocusId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;
                                    helper.SetFocus(nextFocusId);
                                    levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = popupcurrentIndex;
                                }

                            }
                        } else {
                            helper.RemoveFocus("1");
                            helper.RemoveFocus("2");
                        }
                        break;
                    }
                case KEY_CODES.DPAD_UP:
                    { // Up Arrow

                        if (this.checkboxId != '') {
                            helper.setCheckboxFocus(this.checkboxId);
                        }
                        else {
                            helper.SetFocus("1");
                            helper.RemoveFocus("2");
                            if (updownmoveflag) {
                                var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));

                                if (margintopval != -20) {
                                    var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                                    //helper.debugLog("new margine top val"+margintopval);
                                    var margintopnew = margintopval + 217;
                                    $(".popupcontentsmsg").css('margin-top', margintopnew + 'px');
                                    $(".popupboxmsgup").show();
                                    $(".popupboxmsgdown").show();
                                    margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                                    if (margintopval == -20) { $(".popupboxmsgup").hide() }
                                } else {

                                    $(".popupboxmsgup").hide();
                                    $(".popupboxmsgdown").show();
                                    //helper.debugLog("cant go Up");
                                }
                            }
                        }

                        break;
                    }
                case KEY_CODES.DPAD_DOWN:
                    { // Down Arrow
                        if (this.checkboxId != '') {
                            helper.removeCheckboxFocus(this.checkboxId);
                        }
                        else {
                            helper.RemoveFocus("1");
                            helper.SetFocus("2");
                            if (updownmoveflag) {
                                $(".popupboxmsgdown").hide();
                                var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                                $(".popupboxmsgdown").show();
                                msgheight = msgheight - 317;
                                if (margintopval <= (-msgheight)) {

                                    $(".popupboxmsgdown").hide();
                                    $(".popupboxmsgup").show();
                                    margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                                    if (margintopval <= (-msgheight)) {
                                        $(".popupboxmsgdown").hide();
                                    }
                                    //helper.debugLog("Cant go Down");
                                } else {
                                    var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                                    //helper.debugLog("new margine top val"+margintopval);
                                    var margintopnew = margintopval - 217;
                                    $(".popupcontentsmsg").css('margin-top', margintopnew + 'px');
                                    $(".popupboxmsgup").show();
                                }
                            }
                        }

                        break;
                    }
                case KEY_CODES.X:
                case KEY_CODES.F:
                    {
                        helper.debugLog("TIM: HELPER POPUP CLICKED");
                        if (this.checkboxId != '' &&  helper.checkboxHasFocus(this.checkboxId)) {
                            helper.clickCheckbox(this.checkboxId);
                        }
                        else if (popupcurrentFocusedEleId == "0_221") {
                            popupObj_Meta[this.popupkey].button_1_click(popupControllerScope);
                        } else {
                            popupObj_Meta[this.popupkey].button_2_click(popupControllerScope);
                        }

                        break;
                    }
                case "VK_BACK":
                    {
                        //this.Hide();
                        break;
                    }
                    //close the pop up box on the back button clicked
                case KEY_CODES.CIRCLE:
                    {
                        if(this.popupkey != "Popup_PSN_LOGIN")
                        {
                            if (popupObj_Meta[this.popupkey].button_1_click != undefined || popupObj_Meta[this.popupkey].button_1_click != null) {
                                popupObj_Meta[this.popupkey].button_1_click(popupControllerScope);
                            }
                            helper.HidePopupBox();
                        }
                        break;
                    }
               }
		this.removeUnwantedFocus();
    },
    popupmouseover: function (id) {
        PopupBox.Arrowmouseout('1');
        PopupBox.Arrowmouseout('2');
        popupcurrentIndex = levelPopupMap[PopupCurrentLevelIndex].CurrentIndex;
        popupcurrentFocusedEleId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;

        //Logger.Log("PopBoxBox::popupcurrentIndex in Mouseover::" + popupcurrentIndex);
        //Logger.Log("PopBoxBox::popupcurrentFocusedEleId in Mouseover::" + popupcurrentFocusedEleId);
        if (popupcurrentFocusedEleId != null
				&& popupcurrentFocusedEleId != undefined) {
            helper.RemoveFocus(popupcurrentFocusedEleId);
            //helper.debugLog(popupcurrentFocusedEleId);
        }
        PopupCurrentLevelIndex = parseInt(id.split("_")[0]);
        levelPopupMap[PopupCurrentLevelIndex].CurrentIndex = parseInt(id.split("_")[1]);

        helper.SetFocus(id);
    },

    popupmouseout: function (id) {
        //helper.RemoveFocus(id);
    },
    removeUnwantedFocus: function () {
		 helper.RemoveFocus("0_222");
         helper.RemoveFocus("0_221");
         helper.RemoveFocus("accept_1");
    },

    PopulateTemp: function (popupkey) {
        this.SetTitle(popupObj_Meta[popupkey].title_text);
        this.SetMessage(popupObj_Meta[popupkey].msg_text);
        this.SetButton1(popupObj_Meta[popupkey].button_1_text);
        this.SetButton2(popupObj_Meta[popupkey].button_2_text);
        this.SetSeperator(popupObj_Meta[popupkey].seperator);
        this.SetCheckbox(popupObj_Meta[popupkey].checkboxId);
        button_1_callback = popupObj_Meta[popupkey].button_1_click;
        //helper.debugLog(button_1_callback);
        button_2_callback = popupObj_Meta[popupkey].button_2_click;
        //helper.debugLog(button_2_callback);

        /*		document.getElementById('0_221').onClick = 'helper.debugLog("document.getElementById 0_221")';
        document.getElementById('0_222').onClick = 'helper.debugLog("document.getElementById 0_222")';*/
    },

    HandleArrow: function (arrowVal) {
        if (updownmoveflag) {
            var msgheight = $(".popupcontentsmsg").height();
            if (arrowVal == 1) {

                var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                if (margintopval != -20) {
                    var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                    //helper.debugLog("new margine top val"+margintopval);
                    var margintopnew = margintopval + 217;
                    $(".popupcontentsmsg").css('margin-top', margintopnew + 'px');
                    $(".popupboxmsgup").css("visibility", "visible");
                    $(".popupboxmsgdown").css("visibility", "visible");
                    helper.SetFocus("1");
                    helper.RemoveFocus("2");
                    margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                    if (margintopval == -20) { $(".popupboxmsgup").hide(); }
                } else {

                    $(".popupboxmsgup").hide();
                    $(".popupboxmsgdown").show();
                    //helper.debugLog("cant go Up");
                }

            } else {
                $(".popupboxmsgdown").show();

                var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                $(".popupboxmsgdown").show();
                msgheight = msgheight - 317;
                if (margintopval <= (-msgheight)) {

                    $(".popupboxmsgdown").hide();
                    $(".popupboxmsgup").show();

                    //helper.debugLog("Cant go Down");
                } else {
                    var margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                    //helper.debugLog("new margine top val"+margintopval);
                    var margintopnew = margintopval - 217;
                    $(".popupcontentsmsg").css('margin-top', margintopnew + 'px');
                    $(".popupboxmsgup").show();
                    helper.SetFocus("2");
                    helper.RemoveFocus("1");
                    margintopval = parseInt($(".popupcontentsmsg").css("margin-top"));
                    if (margintopval <= (-msgheight)) {
                        $(".popupboxmsgdown").hide();
                    }
                }

            }
        }
    },

    Arrowmouseout: function (id) {
        helper.RemoveFocus(id);
    },

    Arrowmouseover: function (id) {
        if (id == '1') {
            helper.RemoveFocus('2');
        } else {
            helper.RemoveFocus('1');
        }
        popupcurrentIndex = levelPopupMap[PopupCurrentLevelIndex].CurrentIndex;
        popupcurrentFocusedEleId = PopupCurrentLevelIndex + "_" + popupcurrentIndex;

        //Logger.Log("PopBoxBox::popupcurrentIndex in Mouseover::" + popupcurrentIndex);
        //Logger.Log("PopBoxBox::popupcurrentFocusedEleId in Mouseover::" + popupcurrentFocusedEleId);

        helper.RemoveFocus(popupcurrentFocusedEleId);
        helper.SetFocus(id);
    }
};

function PopulateTemplate(tpl, data) {
	var content = '';
	for (key in data) {
		var t = "$" + key + "$";
		var d = data[key];
		tpl = tpl.replace(t, d);
	}
	return tpl;
}
