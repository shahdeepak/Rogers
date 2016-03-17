/**
 * Helper for titleDetail
 */

var titleDetailHelper = {
    /**
    * This method will be responsible to calculate the rating based on overallAverage rating
    * @param oriVal
    * @returns {string}
    * @constructor
    */
    CalculateRatingFraction: function (oriVal) {
        var ratingValue = (parseInt(oriVal) / 10);
        if (ratingValue == "NAN") {
            ratingValue = 0;
        }
        var ratingValueStirng = ratingValue.toString();
        var completeValue = ratingValueStirng.split(".")[0];
        var fractionValue = ratingValueStirng.split(".")[1];
        if (fractionValue == undefined) {
            fractionValue = 0;
        }
        if (parseInt(fractionValue) > 7 || parseInt(fractionValue) == 7) {
            fractionValue = 0;
            completeValue = parseInt(completeValue) + 1;
        } else if (parseInt(fractionValue) > 3 || parseInt(fractionValue) == 3) {
            fractionValue = 5;
        } else if (parseInt(fractionValue) < 3) {
            fractionValue = 0;
        }
        fractionValue = fractionValue + '';
        var finalValue = completeValue + '.' + fractionValue;
        //        $scope.ratingValue = finalValue;
        //        if (fractionValue > 0)
        //            $scope.ratingValueStr = completeValue + '-' + fractionValue;
        //        else
        //            $scope.ratingValueStr = completeValue;

        return {
            ratingValue: finalValue,
            ratingString: completeValue + (fractionValue > 0 ? "-" + fractionValue : "")
        };
    },

    /**
    * This function will be responsible to decide whether the preview trailer button should enable or not
    *
    */
    GetPreviewButtonVisibility: function (previewList) {
        var visiblity = false;
        var previewListLength = previewList.length;
        if (previewListLength != null && previewListLength != undefined
            && previewListLength != "") {

            if (previewListLength > 0) {
                if (previewList != null
                    && previewList.length > 0) {
                    for (var index = 0; index < previewList.length; ) {
                        var targetDevice = previewList[index].TargetDevice;
                        if (RBI.PlatformConfig.previewTargetDevice != undefined && RBI.PlatformConfig.previewTargetDevice.indexOf(targetDevice) != '-1') {
                            visiblity = true;
                            break;
                        } else {
                            visiblity = false;
                            index++;
                        }
                    }
                }

            } else {
                visiblity = false;
            }
        } else {
            visiblity = false;
        }
        return visiblity;

    },


    CheckInstantOptions: function ($scope, data) {
        var purchaseOptionsList = data.getPurchaseOptionsList();
        var missingTransactionIndex = -1;

        if (helper.isUserLoggedIn() && purchaseOptionsList.length > 0) {
            for (var i = 0; i < purchaseOptionsList.length; i++) {
                // ZOE 21351 - check if a subscription billing transaction is missing for a logged in user
                var billingTransaction = purchaseOptionsList[i].getBillingTransaction();
                if ((purchaseOptionsList[i].getPurchaseOptionType() == SUBSCRIPTION || purchaseOptionsList[i].getPurchaseOptionName() == SUBSCRIPTION) &&
                    (billingTransaction == null || typeof billingTransaction == 'undefined' || billingTransaction == '')) {
                    missingTransactionIndex = i;
                    helper.debugLog("TitleDetails - missing billing transaction; user logged in, transactionIndex: "  + missingTransactionIndex);
                    break;
                }
            }
        }
        return missingTransactionIndex;
    },

    /**
    * This method will populate the instant options and button text on title detail
    * @param $scope
    * @param data
    * @constructor
    */
    PopulateInstantOptions: function ($scope, data) {
        var purchaseLength = 0;
        var purchaseOptionsList = data.getPurchaseOptionsList();


        var popUpjsonObj = {
            instantoption: []
        };
        if (purchaseOptionsList.length > 0) {
            for (var i = 0; i < purchaseOptionsList.length; i++) {
                //This block of code is to push instock availability into popUpjsonObj for atkiosk formats(Blu-Ray, DVD).
				var InStock = undefined;
				var puchachaseOptionType = purchaseOptionsList[i].getPurchaseOptionType();
				if( puchachaseOptionType == BLURAY_RESERVATION || puchachaseOptionType == DVD_RESERVATION ){
					var FormatType = puchachaseOptionType.split(' ')[0];
					for(var j = 0; j <data.value.DeliveryTypes.length; j++){
						if(data.value.DeliveryTypes[j].MediaFormats[0].FormatType.toUpperCase() == FormatType.toUpperCase()){
							InStock = data.value.DeliveryTypes[j].MediaFormats[0].InStock;
							break;
						}
					}
				}
                popUpjsonObj.instantoption.push({
                    "PurchaseOptionType": purchaseOptionsList[i].getPurchaseOptionType(),
                    "PurchaseOptionName": purchaseOptionsList[i].getPurchaseOptionName(),
                    "PurchaseOptionID": purchaseOptionsList[i].getPurchaseOptionID(),
                    "Price": purchaseOptionsList[i].getPrice(),
                    "BillingTransaction": purchaseOptionsList[i].getBillingTransaction(),
					"InStock": InStock,
                    "id": i
                });
            }
        }
        $scope.popUpjsonObj = popUpjsonObj;
        var length = $scope.popUpjsonObj.instantoption.length;
        if (length > 0) {
            this.SeparateInstantOptionaAndATKiosk($scope);
            this.SortInstantOption($scope);
            this.CheckStatusOfMovie($scope);
            this.HandleButtonVisibility($scope);
        } else {
            this.HandleButtonVisibility($scope);
        }
    },
    /**
    * This method will populate the instant options and button text on title detail
    * @param $scope
    * @param data
    * @constructor
    */
    SeparateInstantOptionaAndATKiosk: function ($scope) {
        var length = $scope.popUpjsonObj.instantoption.length;
        var aTkioskPopUpjsonObj = {
            instantoption: []
        };
        var instantOptionPopUpjsonObjTemp = {
            instantoption: []
        };

        for (var i = 0; i < length; i++) {

            if ($scope.popUpjsonObj.instantoption[i].PurchaseOptionName == DVD_RESERVATION
                || $scope.popUpjsonObj.instantoption[i].PurchaseOptionName == BLURAY_RESERVATION) {

                var purchaseOptionNameTemp = $scope.popUpjsonObj.instantoption[i].PurchaseOptionName;

                var CurrKiosk = helper.GetCurrentKiosk();
                if ($scope.isFromKiosk) {

                    if (purchaseOptionNameTemp == DVD_RESERVATION) {
                        purchaseOptionNameTemp = RESERVE_DVD;
                    } else if (purchaseOptionNameTemp == BLURAY_RESERVATION) {
                        purchaseOptionNameTemp = RESERVE_BLURAY;

                    }
                } else {
                    if (purchaseOptionNameTemp == DVD_RESERVATION) {
                        purchaseOptionNameTemp = FIND_DVD;
                    } else if (purchaseOptionNameTemp == BLURAY_RESERVATION) {
                        purchaseOptionNameTemp = FIND_BLURAY;

                    }
                }
                aTkioskPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.popUpjsonObj.instantoption[i].PurchaseOptionName,
                        "PurchaseOptionName": purchaseOptionNameTemp,
                        "PurchaseOptionID": $scope.popUpjsonObj.instantoption[i].PurchaseOptionID,
                        "Incart": "no",
						"InStock":$scope.popUpjsonObj.instantoption[i].InStock
                    });

            } else {

                instantOptionPopUpjsonObjTemp.instantoption
                    .push({
                        "PurchaseOptionType": $scope.popUpjsonObj.instantoption[i].PurchaseOptionName,
                        "PurchaseOptionName": $scope.popUpjsonObj.instantoption[i].PurchaseOptionName,
                        "PurchaseOptionID": $scope.popUpjsonObj.instantoption[i].PurchaseOptionID,
                        "Price": $scope.popUpjsonObj.instantoption[i].Price,
                        "BillingTransaction": $scope.popUpjsonObj.instantoption[i].BillingTransaction,
                        "id": i
                    });
            }

        }
        $scope.instantOptionPopUpjsonObjTemp = instantOptionPopUpjsonObjTemp;
        //$scope.aTkioskPopUpjsonObj = this.AddInCartattributeToKisokJson($scope, aTkioskPopUpjsonObj);
        $scope.aTkioskPopUpjsonObj = aTkioskPopUpjsonObj;
    },
    /**
    *   Method to sort instant options list in order Rent,Rent HD,Buy, Buy HD.
    */
    SortInstantOption: function ($scope) {
        var length = $scope.instantOptionPopUpjsonObjTemp.instantoption.length;
        if (length > 0) {
            var j = 0;
            var instantOptionPopUpjsonObjRENT = {
                instantoption: []
            };
            for (var i = 0; i < length; i++) {
                if ($scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName == RENT) {

                    instantOptionPopUpjsonObjRENT.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].BillingTransaction

                        });

                    if (instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction != null
                        && instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction != undefined
                        && instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction != "") {

                        if (instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction == "True"
                            || instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction == "TRUE"
                            || instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction == "true"
                            || instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction) {

                            $scope.isRentBillingPresent = true;
                            $scope.title.watchNowPurchaseOptionId = instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionID;
                        }
                    }

                    $scope.isRentPresent = true;
                    break;

                }
            }
            $scope.instantOptionPopUpjsonObjRENT = instantOptionPopUpjsonObjRENT;

            var instantOptionPopUpjsonObjBUY = {
                instantoption: []
            };
            for (var i = 0; i < length; i++) {
                if ($scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName == BUY) {

                    instantOptionPopUpjsonObjBUY.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].BillingTransaction

                        });
                    if (instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction != null
                        && instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction != undefined
                        && instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction != "") {
                        if (instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction == "True"
                            || instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction == "TRUE"
                            || instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction == "true"
                            || instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction) {
                            $scope.isBuyBilllingPresent = true;
                            $scope.title.watchNowPurchaseOptionId = instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionID;

                        }
                    }
                    $scope.isBuyPresent = true;
                    break;
                }
            }
            $scope.instantOptionPopUpjsonObjBUY = instantOptionPopUpjsonObjBUY;

            var instantOptionPopUpjsonObjRENTHD = {
                instantoption: []
            };
            for (var i = 0; i < length; i++) {
                if ($scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName == RENT_HD) {

                    instantOptionPopUpjsonObjRENTHD.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].BillingTransaction

                        });

                    if (instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction != null
                        && instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction != undefined
                        && instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction != "") {

                        if (instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "True"
                            || instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "TRUE"
                            || instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "true"
                            || instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction) {

                            $scope.isRentHDBillingPresent = true;
                            $scope.title.watchNowPurchaseOptionId = instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionID;
                        }
                    }
                    $scope.isRentHDPresent = true;
                    break;
                }
            }
            $scope.instantOptionPopUpjsonObjRENTHD = instantOptionPopUpjsonObjRENTHD;

            var instantOptionPopUpjsonObjBUYHD = {
                instantoption: []
            };
            for (var i = 0; i < length; i++) {
                if ($scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName == BUY_HD) {

                    instantOptionPopUpjsonObjBUYHD.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].BillingTransaction

                        });

                    if (instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction != null
                        && instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction != undefined
                        && instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction != "") {
                        if (instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "True"
                            || instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "TRUE"
                            || instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "true"
                            || instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction) {
                            $scope.isBuyHDBillingPresent = true;
                            $scope.title.watchNowPurchaseOptionId = instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID;
                        }
                    }
                    $scope.isBuyHDPresent = true;
                    break;
                }
            }

            $scope.instantOptionPopUpjsonObjBUYHD = instantOptionPopUpjsonObjBUYHD;

            var instantOptionPopUpjsonObjSUBSCRIPTION = {
                instantoption: []
            };

            for (var i = 0; i < length; i++) {
                if ($scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName == SUBSCRIPTION) {

                    instantOptionPopUpjsonObjSUBSCRIPTION.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjTemp.instantoption[i].BillingTransaction

                        });
                    $scope.isSubscriptionPresent = true;
                    $scope.title.watchNowPurchaseOptionId = $scope.instantOptionPopUpjsonObjTemp.instantoption[0].PurchaseOptionID;
                    break;
                }
            }
            $scope.instantOptionPopUpjsonObjSUBSCRIPTION = instantOptionPopUpjsonObjSUBSCRIPTION;
        }

        if ($scope.isBuyHDBillingPresent || $scope.isRentHDBillingPresent) {
            $scope.isHD = true;
        }
        else if ($scope.isRentBillingPresent || $scope.isBuyBilllingPresent) {
            $scope.isHD = false;
        }
        if ($scope.isHD) {
            helper.debugLog("SortInstantOption: Media format - HD");
        } else {
            helper.debugLog("SortInstantOption: Media format - SD");
        }

    },

    //Check weather movie is puchased or rented
    CheckStatusOfMovie: function ($scope) {

        if ($scope.isBuyHDBillingPresent) {

            $scope.instantOptionPopUpjsonObj.instantoption.push({
                "PurchaseOptionType": "",
                "PurchaseOptionName": WATCH_NOW_LABEL,
                "PurchaseOptionID": "",
                "Price": "",
                "BillingTransaction": ""

            });

        } else if ($scope.isBuyBilllingPresent) {

            $scope.instantOptionPopUpjsonObj.instantoption.push({
                "PurchaseOptionType": "",
                "PurchaseOptionName": WATCH_NOW_LABEL,
                "PurchaseOptionID": "",
                "Price": "",
                "BillingTransaction": ""

            });

            if ($scope.isRentHDPresent) {

                if ($scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "True"
                    || $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "TRUE"
                    || $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction == "true"
                    || $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction) {
                    //remove from list
                } else {

                    $scope.instantOptionPopUpjsonObj.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction

                        });

                }
            }
            if ($scope.isBuyHDPresent) {
                //if billing transction not true
                if ($scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "True"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "TRUE"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "true"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction) {
                    //remove from list
                } else {
                    $scope.instantOptionPopUpjsonObj.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction

                        });
                }
            }

        } else if ($scope.isRentHDBillingPresent) {

            $scope.instantOptionPopUpjsonObj.instantoption.push({
                "PurchaseOptionType": "",
                "PurchaseOptionName": WATCH_NOW_LABEL,
                "PurchaseOptionID": "",
                "Price": "",
                "BillingTransaction": ""

            });

            if ($scope.isBuyPresent) {
                if (!$scope.isBuyBilllingPresent) {

                    $scope.instantOptionPopUpjsonObj.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction

                        });
                }
            }

            if ($scope.isBuyHDPresent) {

                //if billing transction not true
                if ($scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "True"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "TRUE"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction == "true"
                    || $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction) {
                    //remove from list
                } else {
                    $scope.instantOptionPopUpjsonObj.instantoption
                        .push({
                            "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                            "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID,
                            "Price": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].Price,
                            "BillingTransaction": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction

                        });

                }
            }

        } else if ($scope.isRentBillingPresent) {

            $scope.instantOptionPopUpjsonObj.instantoption.push({
                "PurchaseOptionType": "",
                "PurchaseOptionName": WATCH_NOW_LABEL,
                "PurchaseOptionID": "",
                "Price": "",
                "BillingTransaction": ""

            });

            if ($scope.isRentHDPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyHDPresent) {
                //if billing transction not true

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction

                    });
            }

        } else if ($scope.isSubscriptionPresent) {
            helper.debugLog("TitleDetails - subscription present");
            if ($scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != null
                && $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != undefined
                && $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != "") {
                helper.debugLog("TitleDetails - billing transaction: " + $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction);
                if ($scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction) {
                    $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionName = WATCH_NOW_LABEL;
                } else {
                    $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionName = "Subscribe Now";
                }
            }
            else {
                helper.debugLog("TitleDetails - billing transaction is null");
                $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionName = "Subscribe Now";
            }

            $scope.instantOptionPopUpjsonObj.instantoption
                .push({
                    "PurchaseOptionType": $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionName,
                    "PurchaseOptionName": $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionName,
                    "PurchaseOptionID": $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].PurchaseOptionID,
                    "Price": $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].Price,
                    "BillingTransaction": $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction

                });
            if ($scope.isRentPresent) {
                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isRentHDPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyHDPresent) {
                //if billing transction not true

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction

                    });

            }

        } else {
            // if billing transaction is not true for any option
            if ($scope.isRentPresent) {
                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjRENT.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isRentHDPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjRENTHD.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyPresent) {

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUY.instantoption[0].BillingTransaction

                    });
            }

            if ($scope.isBuyHDPresent) {
                //if billing transction not true

                $scope.instantOptionPopUpjsonObj.instantoption
                    .push({
                        "PurchaseOptionType": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionName": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionName,
                        "PurchaseOptionID": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].PurchaseOptionID,
                        "Price": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].Price,
                        "BillingTransaction": $scope.instantOptionPopUpjsonObjBUYHD.instantoption[0].BillingTransaction

                    });

            }

        }
    },
    //Method called to add incart attribute to kiosk json object if purchase option id is in cart
    AddInCartattributeToKisokJson: function ($scope, aTkioskPopUpjsonObj) {
        var CurrKiosk = helper.GetCurrentKiosk();
        var state = helper.GetPageState(KIOSK_CHECKOUT_KEY);

        if (state != null && state != "null") {
            var values = JSON.parse(state);
            ProductArray = values.PRODUCT_ARRAY;
        }
        if (aTkioskPopUpjsonObj.instantoption.length > 0) {
            for (var i = 0; i < aTkioskPopUpjsonObj.instantoption.length; i++) {

                if ($scope.isFromKiosk && isDefined(ProductArray)
                    && ProductArray.length != 0) {
                    for (var index = 0; index < ProductArray.length; index++) {
                        if (aTkioskPopUpjsonObj.instantoption[i].PurchaseOptionID == ProductArray[index].PURCHASE_OPTION_ID) {
                            aTkioskPopUpjsonObj.instantoption[i].Incart = "yes";
                        }
                    }
                }
            }
        }
        return aTkioskPopUpjsonObj;
    },

    HandleButtonVisibility: function ($scope) {
        var LEVEL_BUTTONS = 1;
        var LEVEL_LIST = 3;
        var popUpjsonObj = $scope.popUpjsonObj;
        var incartDVD = false;
        var incartBluRay = false;
        var length = popUpjsonObj.instantoption.length;
        var purchseOptionTypeTemp = [];
        for (var i = 0; i < length; i++) {
            purchseOptionTypeTemp[i] = popUpjsonObj.instantoption[i].PurchaseOptionName;
        }
        if (!$scope.title.blackoutIndicator) {
            var length = purchseOptionTypeTemp.length;
            var atKisokVisible = false;
            var instantOptionVisible = false;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if (purchseOptionTypeTemp[i] == DVD_RESERVATION
                        || purchseOptionTypeTemp[i] == BLURAY_RESERVATION) {
                        atKisokVisible = true;
                        if ($scope.aTkioskPopUpjsonObj.instantoption.length == 1) {
                            if (purchseOptionTypeTemp[i] == DVD_RESERVATION) {
                                if (($scope.aTkioskPopUpjsonObj.instantoption[0].Incart) == "yes") {
                                    incartDVD = true;
                                }
                                else {
                                    incartDVD = false;
                                }
                                $scope.onlyFindDVDPresent = true;
                            } else if (purchseOptionTypeTemp[i] == BLURAY_RESERVATION) {
                                if (($scope.aTkioskPopUpjsonObj.instantoption[0].Incart) == "yes") {
                                    incartBluRay = true;
                                } else {
                                    incartBluRay = false;
                                }
                                $scope.onlyFindBlueRayPresent = true;
                            }
                        }
                    } else {
                        instantOptionVisible = true;
                        if ($scope.instantOptionPopUpjsonObj.instantoption.length == 1) {

                            if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == WATCH_NOW_LABEL.toLowerCase()) {
                                $scope.onlyWatchNowPresent = true;
                            } else if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == SUBSCRIBE_NOW_LABEL.toLowerCase()) {
                                $scope.onlySubscribeNowPresent = true;
                            } else if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == RENT_HD_LABEL.toLowerCase()) {
                                $scope.onlyRentHDPresent = true;
                            } else if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == RENT_LABEL.toLowerCase()) {
                                $scope.onlyRentPresent = true;
                            } else if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == BUY_HD_LABEL.toLowerCase()) {
                                $scope.onlyBuyHDPresent = true;
                            } else if ($scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == BUY_LABEL.toLowerCase()) {
                                $scope.onlyBuyPresent = true;
                            }
                        }

                    }
                }
            } else {
                $scope.levelMap[LEVEL_BUTTONS].MaxElements = 0;
            }

            if (instantOptionVisible && atKisokVisible) {
                $scope.isInstantOptionVisible = true;
                $scope.isATKioskVisible = true;
                $scope.isInstantOptionListVisible = false;
                $scope.isATKioskListVisible = false;

                if ($scope.onlyWatchNowPresent) {
                    $scope.instantOptionLabel = WATCH_NOW_LABEL;
                } else if ($scope.onlySubscribeNowPresent) {
                    $scope.instantOptionLabel = SUBSCRIBE_NOW_LABEL;
                } else if ($scope.onlyRentHDPresent) {
                    $scope.instantOptionLabel = RENT_HD_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyRentPresent) {
                    $scope.instantOptionLabel = RENT_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyBuyHDPresent) {
                    $scope.instantOptionLabel = BUY_HD_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyBuyPresent) {
                    $scope.instantOptionLabel = BUY_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else {
                    $scope.isInstantOptionListVisible = true;
                }


                if ($scope.onlyFindDVDPresent) {
                    $scope.isATKioskListVisible = false;
                    var CurrKiosk = helper.GetCurrentKiosk();
                    if ($scope.isFromKiosk) {
                        $scope.atKioskLabel = $scope.title.isMovie ? "RESERVE DVD" : "RESERVE";
                    } else {
                        $scope.atKioskLabel = $scope.title.isMovie ? "FIND DVD" : "FIND DISC";
                    }
                } else if ($scope.onlyFindBlueRayPresent) {
                    $scope.isATKioskListVisible = false;

                    var CurrKiosk = helper.GetCurrentKiosk();
                    if ($scope.isFromKiosk) {
                        $scope.atKioskLabel = "RESERVE BLU-RAY";
                    } else {
                        $scope.atKioskLabel = "FIND BLU-RAY";
                    }
                } else {
                    $scope.isATKioskListVisible = true;
                }

                if (incartDVD || incartBluRay) {
                    //todo need to add logic to manage the instant options opacity if already in cart
                }
                $scope.levelMap[LEVEL_BUTTONS].MaxElements = 2;

            } else if (instantOptionVisible && !atKisokVisible) {
                $scope.isInstantOptionVisible = true;
                $scope.isATKioskVisible = false;
                $scope.isInstantOptionListVisible = false;
                if ($scope.onlyWatchNowPresent) {
                    $scope.instantOptionLabel = WATCH_NOW_LABEL;
                } else if ($scope.onlySubscribeNowPresent) {
                    $scope.instantOptionLabel = SUBSCRIBE_NOW_LABEL;
                } else if ($scope.onlyRentHDPresent) {
                    $scope.instantOptionLabel = RENT_HD_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyRentPresent) {
                    $scope.instantOptionLabel = RENT_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyBuyHDPresent) {
                    $scope.instantOptionLabel = BUY_HD_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else if ($scope.onlyBuyPresent) {
                    $scope.instantOptionLabel = BUY_LABEL + "\t$"+$scope.instantOptionPopUpjsonObj.instantoption[0].Price;
                } else {
                    $scope.isInstantOptionListVisible = true;
                }
                $scope.levelMap[LEVEL_BUTTONS].MaxElements = 1;

            } else if (!instantOptionVisible && atKisokVisible) {
                $scope.isInstantOptionVisible = false;
                $scope.isATKioskVisible = true;
                $scope.isATKioskListVisible = false;

                if ($scope.onlyFindDVDPresent) {
                    var CurrKiosk = helper.GetCurrentKiosk();
                    if ($scope.isFromKiosk) {
                        $scope.atKioskLabel = $scope.title.isMovie ? "RESERVE DVD" : "RESERVE";
                    } else {
                        $scope.atKioskLabel = $scope.title.isMovie ? "FIND DVD" : "FIND DISC";
                    }
                } else if ($scope.onlyFindBlueRayPresent) {
                    var CurrKiosk = helper.GetCurrentKiosk();
                    if ($scope.isFromKiosk) {
                        $scope.atKioskLabel = "RESERVE BLU-RAY";
                    } else {
                        $scope.atKioskLabel = "FIND BLU-RAY";
                    }
                } else {
                    $scope.isATKioskListVisible = true;
                    $scope.atKioskLabel = "At the Box";
                }
                if (incartDVD || incartBluRay) {
                    //todo need to add logic to manage the instant options opacity if already in cart
                }
                $scope.levelMap[LEVEL_BUTTONS].MaxElements = 1;
                $scope.levelMap[LEVEL_BUTTONS].CurrentIndex = 0;
            } else if (!instantOptionVisible && !atKisokVisible) {
                $scope.isInstantOptionVisible = false;
                $scope.isATKioskVisible = false;
				helper.SetFocus('1_Bookmark');
				$scope.bookmarkFocused = true;
                $scope.levelMap[LEVEL_BUTTONS].MaxElements = 0;
            }
          

        } else {
            $scope.isInstantOptionVisible = true;
            $scope.isInstantOptionListVisible = false;
            $scope.isATKioskVisible = false;
            $scope.isATKioskListVisible = false;
            $scope.instantOptionLabel = "NOT AVAILABLE";
            $scope.levelMap[LEVEL_BUTTONS].MaxElements = 1;
    
        }
    },
    /**
    * This method is added to get array of button
    * @param $scope
    * @param btnIndex
    * @returns {string}
    * @constructor
    */
    GetButtons: function ($scope) {
        var bttnArray = [];
        if ($scope.isInstantOptionVisible) {
            bttnArray.push({
                "BtnID": 0,
                "BtnName": $scope.instantOptionLabel,
                "showList": $scope.isInstantOptionListVisible,
                "BtnType": "I",
                "disabled": ""
            });
        }
        if ($scope.isInstantOptionVisible && $scope.isATKioskVisible) {
            bttnArray.push({
                "BtnID": 1,
                "BtnName": $scope.atKioskLabel.split(",")[0],
                "showList": $scope.isATKioskListVisible,
                "BtnType": "K",
                "disabled": $scope.atKioskLabel.split(",")[1]
            });
        } else if ($scope.isATKioskVisible) {
            bttnArray.push({
                "BtnID": 0,
                "BtnName": $scope.atKioskLabel.split(",")[0],
                "showList": $scope.isATKioskListVisible,
                "BtnType": "K",
                "disabled": $scope.atKioskLabel.split(",")[1]
            });
        }

       //        if ($scope.isInstantOptionVisible && $scope.isATKioskVisible && $scope.isDescriptionElipsised) {
		//            bttnArray.push({
		//                "BtnID": 2,
		//                "BtnName": $scope.fullSynopsisLabel,
		//                "showList": false,
		//                "BtnType": "S",
		//                "disabled": ""
		//            });
		//        } else if ((!$scope.isInstantOptionVisible && $scope.isATKioskVisible) || ($scope.isInstantOptionVisible && !$scope.isATKioskVisible)) {
		//            if ($scope.isDescriptionElipsised) {
		//                bttnArray.push({
		//                    "BtnID": 1,
		//                    "BtnName": $scope.fullSynopsisLabel,
		//                    "showList": false,
		//                    "BtnType": "S",
		//                    "disabled": ""
		//                });
		//            }
		//        } else if ($scope.isDescriptionElipsised) {
		//            bttnArray.push({
		//                "BtnID": 0,
		//                "BtnName": $scope.fullSynopsisLabel,
		//                "showList": false,
		//                "BtnType": "S",
		//                "disabled": ""
		//            });
		//        }
        $scope.bttnArray = bttnArray;
		$scope.isBookMark = true;
    },
    checkIfTitlePresentInCart: function ($scope) {
        var cartList = new RBI.Cart();
        if (cartList != undefined && helper.isDefined($scope.aTkioskPopUpjsonObj)) {
            for (var i = 0; i < $scope.aTkioskPopUpjsonObj.instantoption.length; i++) {
                var cart = cartList.getByPurchaseOptionId($scope.aTkioskPopUpjsonObj.instantoption[i].PurchaseOptionID);
                $scope.atKioskLabel = $scope.atKioskLabel + ",";
                if (cart != null) {
                    $scope.aTkioskPopUpjsonObj.instantoption[i].PurchaseOptionName = $scope.aTkioskPopUpjsonObj.instantoption[i].PurchaseOptionName + " (in cart)";
                    if (($scope.atKioskLabel.toUpperCase() == RESERVE_DVD.toUpperCase() + ",") || ($scope.atKioskLabel.toUpperCase() == RESERVE_BLURAY.toUpperCase() + ",")) {
                        $scope.atKioskLabel = $scope.atKioskLabel + "disablediv";
                    }
                }
            }


        }
    },
    PopulateBadgeLabels: function ($scope) {
        if ($scope.isInstantOptionVisible) {
            if ($scope.isSubscriptionPresent && !helper.isUserLoggedIn()) {
                $scope.instantOptionBadgeLabel = WATCH_NOW_LABEL_WITH_SUB;
                $scope.subscriptionBadge = true;
            } else if ($scope.instantOptionPopUpjsonObjSUBSCRIPTION!= undefined && $scope.instantOptionPopUpjsonObj.instantoption[0].PurchaseOptionName.toLowerCase() == WATCH_NOW_LABEL.toLowerCase() && $scope.instantOptionPopUpjsonObj.instantoption.length==1) {
            	  $scope.instantOptionBadgeLabel = WATCH_NOW_LABEL;
                  $scope.subscriptionBadge = true;
            } else if (($scope.isRentPresent || $scope.isRentHDPresent) && ($scope.isBuyPresent || $scope.isBuyHDPresent)) {
                $scope.instantOptionBadgeLabel = RENT_BUY_LABEL;
                $scope.rentBadge = true;
            } else if (($scope.isRentPresent || $scope.isRentHDPresent) && !($scope.isBuyPresent || $scope.isBuyHDPresent)) {
                $scope.instantOptionBadgeLabel = RENT_LABEL;
                $scope.rentBadge = true;
            } else if (!($scope.isRentPresent || $scope.isRentHDPresent) && ($scope.isBuyPresent || $scope.isBuyHDPresent)) {
                $scope.instantOptionBadgeLabel = BUY_LABEL;
                $scope.rentBadge = true;
            } else if ($scope.isSubscriptionPresent && helper.isUserLoggedIn()) {
                if ($scope.instantOptionPopUpjsonObjSUBSCRIPTION!= undefined && $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != null && $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != undefined && $scope.instantOptionPopUpjsonObjSUBSCRIPTION.instantoption[0].BillingTransaction != "")
                    $scope.instantOptionBadgeLabel = WATCH_NOW_LABEL;
                else
                    $scope.instantOptionBadgeLabel = WATCH_NOW_LABEL_WITH_SUB;
                $scope.subscriptionBadge = true;
            }
        }
        if ($scope.isATKioskVisible) {
            if ($scope.onlyFindDVDPresent) {
                $scope.kioskOptionBadgeLabel = ON_DVD_LABEL;
                $scope.showIioskOptionBadge = true;
            } else if ($scope.onlyFindBlueRayPresent) {
                $scope.kioskOptionBadgeLabel = ON_BLU_RAY_LABEL;
                $scope.showIioskOptionBadge = true;
            } else if ($scope.isATKioskListVisible) {
                $scope.kioskOptionBadgeLabel = ON_DVD_AND_BLU_RAY_LABEL;
                $scope.showIioskOptionBadge = true;
            }
        }
    }, // to check whether the user has came from the browse kiosk
    SetKioskDetails: function ($scope) {
        var CurrKiosk = helper.GetCurrentKiosk(SELECTED_KOISK_KEY);
        if ($scope.isFromKiosk) {

            $scope.selectedKiosk.Address1 = CurrKiosk.Address1;
            $scope.selectedKiosk.City = CurrKiosk.City;
            $scope.selectedKiosk.Displayname = CurrKiosk.Displayname;
            $scope.selectedKiosk.Distance = CurrKiosk.Distance;
            $scope.selectedKiosk.KioskID = CurrKiosk.KioskID;
            $scope.selectedKiosk.Label = CurrKiosk.Label;
            $scope.selectedKiosk.Location = CurrKiosk.Location;
            $scope.selectedKiosk.Latitude = CurrKiosk.Latitude;
            $scope.selectedKiosk.State = CurrKiosk.State;
            $scope.selectedKiosk.Status = CurrKiosk.Status;
            $scope.selectedKiosk.Vendor = CurrKiosk.Vendor;
            $scope.selectedKiosk.ZipCode = CurrKiosk.ZipCode;

            //populate display name as suggested in requirements
            $scope.kioskName = CurrKiosk.Displayname;

            $scope.kioskAddressLine1 = isDefined(CurrKiosk.Address1) ? CurrKiosk.Address1 : "";
            if ($scope.kioskAddressLine1 == "") {
                $scope.kioskAddressLine1 = isDefined(CurrKiosk.City)
                    ? (isDefined(CurrKiosk.State) ? CurrKiosk.City + ", " + CurrKiosk.State : CurrKiosk.City)
                    : CurrKiosk.State;
            } else {
                $scope.kioskAddressLine2 = isDefined(CurrKiosk.City)
                    ? (isDefined(CurrKiosk.State) ? CurrKiosk.City + ", " + CurrKiosk.State : CurrKiosk.City)
                    : CurrKiosk.ZipCode;
            }
        }
    },
    populateTitleDetailData: function ($scope, data) {

        // if title or platform contain PS3 then add TradeMark superscript...this should be done in DB
        if(data.value.Title.indexOf(' PS3') == (data.value.Title.length - 4))
        {
            data.value.Title = data.value.Title + RBI.PlatformConfig.brandTM;
        }
        if(data.value.Platform == 'PS3')
        {
            data.value.Platform = data.value.Platform + RBI.PlatformConfig.brandTM;
        }

        $scope.product = data;

        try {
            if (($scope.product.getAvailabilityBadges().indexOf(RBI.Product.Defines.BADGE_AVAILABILITY_COMING_SOON) >= 0)) {
                var puchaseOptions = data.getPurchaseOptionsList();
                for (var i = 0; i < puchaseOptions.length; i++) {
                    if (puchaseOptions[i].value.PurchaseOptionName == DVD_RESERVATION || puchaseOptions[i].value.PurchaseOptionName == BLURAY_RESERVATION) {
                        data.value.PurchaseOptionList.splice(i, 1);
                        puchaseOptions = data.getPurchaseOptionsList();
                        i = 0;
                    }
                }
            }
        }
        catch (object) {
        }

        if (data.type == "Movie") {
            $scope.title.isMovie = true;
        } else {
            $scope.title.isMovie = false;
        }

        

        $scope.title.titleDetail = data;
        $scope.title.isBookmarked = data.getIsBookmarked();
        $scope.title.longDescription = data.getLongDescription();
             


        //Populate preview
        var previewList = data.getPreviewList();
        $scope.showPreview = this.GetPreviewButtonVisibility(previewList);
        for (var index = 0; index < previewList.length; index++) {
            var preview = previewList[index];
            if (RBI.PlatformConfig.previewTargetDevice.indexOf(preview.TargetDevice) != '-1') {
                $scope.title.previewURL = preview.URL;
                $scope.title.previewMediaFormat = preview.MediaFormat;
            }
        }

        var posterUrl = data.getImageOfType('poster');
        //update missing porter 
        if (posterUrl == undefined || posterUrl == "") {
            posterUrl = "images/missing-poster.png";
        }
        $scope.title.posterImage = posterUrl;


        if (data.getBadgesForTitleDetails() && data.getBadgesForTitleDetails() != "") $scope.title.ratingsJson = data.getBadgesForTitleDetails();

        $scope.title.titleName = data.getTitle();
        if (data.getGenres() && data.getGenres() != "") $scope.title.titleDetailJson.push({ id: "Genre", value: (data.getGenres()).join(", ") });
        if (data.getActors() && data.getActors() != "") $scope.title.titleDetailJson.push({ id: "Starring", value: (data.getActors()).join(", ") });
        if (data.getDirectors() && data.getDirectors() != "") $scope.title.titleDetailJson.push({ id: "Director", value: (data.getDirectors()).join(", ") });
        if (data.getStudio() && data.getStudio() != "") $scope.title.titleDetailJson.push({ id: "Studio", value: data.getStudio() });
        if (data.getSubtitleList() && data.getSubtitleList() != "") $scope.title.titleDetailJson.push({ id: "Subtitles", value: (data.getSubtitleList()).join(", ") });
        if (data.getFormat() && data.getFormat() != "") $scope.title.titleDetailJson.push({ id: "Format", value: data.getFormat() });
        if (data.getReleaseYear() && data.getReleaseYear() != "") $scope.title.titleDetailJson.push({ id: "Release Year", value: (data.getReleaseYear()).toString() });
        if (data.getPlatform() && data.getPlatform() != "") $scope.title.titleDetailJson.push({ id: "Platform", value: data.getPlatform() });

        var titleDescr = data.getLongDescription();
        if (titleDescr != "" && titleDescr != undefined && titleDescr.length > 240) {
            titleDescr = titleDescr.substring(0, 239);
            titleDescr += "...";
            $scope.isDescriptionElipsised = true;
        }

        $scope.title.isMatureTitle = data.getRating();

        $scope.title.description = titleDescr;
        //var rateObj = this.CalculateRatingFraction(data.value.AverageUserRating);
        //$scope.title.ratingValue = rateObj.ratingValue;
        //$scope.title.ratingValueStr = rateObj.ratingString;
        
        // Get Rental Expiry date if avaialable and convert it to local String
        if (helper.isDefined(data.value.Expires))
        	$scope.title.expiresOn = data.value.Expires;
        if (helper.isDefined(data.getProgressWatched()) && helper.isDefined(data.getRunningTime())) {
            var progressWatched = parseInt(data.getProgressWatched());
            $scope.title.progressWatched = helper.GetProgressWatchedPercentage(progressWatched, data.getRunningTime(), isDefined(data.value.DateComplete));
            //helper.debugLog("progress watched: " + progressWatched + " ms ("+ $scope.title.progressWatched + "%)");
        }

        // Get product URL for ratings and reviews API
        $scope.title.productUrl = data.getSEOURL();


        //$scope.ratingText = this.GetRatingText()
        this.PopulateInstantOptions($scope, data);

        this.checkIfTitlePresentInCart($scope);

        this.GetButtons($scope);
        if(helper.isDefined($scope.instantOptionPopUpjsonObj)){
          $scope.levelMap[$scope.LEVEL_INSTANT_LIST].MaxElements = $scope.instantOptionPopUpjsonObj.instantoption.length + 1;
        }else{
          $scope.levelMap[$scope.LEVEL_INSTANT_LIST].MaxElements = 0 ;
        }
        
        if(helper.isDefined( $scope.aTkioskPopUpjsonObj)){
          $scope.levelMap[$scope.LEVEL_AT_KIOSK_LIST].MaxElements = $scope.aTkioskPopUpjsonObj.instantoption.length;
        }else{
          $scope.levelMap[$scope.LEVEL_AT_KIOSK_LIST].MaxElements = 0;
        }

        this.PopulateBadgeLabels($scope);
        $scope.title.altCode = data.getAltCode();
		$(".bookmarks-div").css("display","block");
		if (!$scope.isDescriptionElipsised) {
			//$("#Preview").css("left", '784px');
		}
    }
};