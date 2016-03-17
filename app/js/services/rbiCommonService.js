'use strict';
rbi.service('rbiCommonService', function (customerService) {
    var commonService = {};

    //shared items for sharing data between two controllers.
    commonService.shareItems = new Object();

    commonService.setSharedItem = function (key, value) {
        this.shareItems[key] = value;
    };
    commonService.getSharedItem = function (key) {
        return this.shareItems[key];
    };
    commonService.isSharedItemExist = function (key) {
	      return this.shareItems[key] != null ? true : false;
    };
    commonService.removeSharedItem = function (key) {
      delete this.shareItems[key];
     };
    return commonService;
});