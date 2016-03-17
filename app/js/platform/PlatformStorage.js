/**
 * @author bhushan.balki platformSecureStorage for implementing platform
 *         specific securestorage if any.
 */
 var fileStorage = {}; 
(function() {
	try{
	if (FileSystem != null && FileSystem != 'undefined' && FileSystem != undefined) {
		platformLogger.log("Initializing file storage");
		var fileSysObj = new FileSystem();
		var commonDir = fileSysObj.isValidCommonPath(curWidget.id);
		if(!commonDir) {
			fileSysObj.createCommonDir(curWidget.id);
		}
		var fileName = curWidget.id + "/localStorage.db";
		var changed = false;

		// load or init fileStorage file
		var fileObj = fileSysObj.openCommonFile(fileName, "r+");
		if (fileObj !== null) {
			try {
				fileStorage = JSON.parse(fileObj.readAll());
			} catch(e) {
				platformLogger.log("fileStorage>>Init:"+e);
			}
		} else {
			fileObj = fileSysObj.openCommonFile(fileName, "w");
			fileObj.writeAll("{}");
		}
		fileSysObj.closeCommonFile(fileObj);
		platformLogger.log("fileStorage Initialished");
		// Save storage
		fileStorage.saveFile = function(delay) {
			if (changed && typeof JSON == 'object') {
				var $this = this;
				var save  = function() {
					fileObj = fileSysObj.openCommonFile(fileName, "w");
					fileObj.writeAll(JSON.stringify($this));
					fileSysObj.closeCommonFile(fileObj);
					changed = false;
				};
				if (typeof delay != 'undefined' && delay){
					//setTimeout(save, 100);
					save();
				}else{
					save();
				}					
			}
		};

		fileStorage.setItem = function(key, value) {
			changed = true;
			this[key] = value;
			this.saveFile(true);
			return this[key];
		};

		fileStorage.getItem = function(key) {
			if(this[key] == undefined || this[key] == "undefined" || this[key] == "null")
				{
				return null;
				}
			else{
				return this[key];
			}	
		};
		fileStorage.removeItem = function(key) {
			changed = true;
			this[key] = undefined;
			this.saveFile(false);
			return undefined;
		};
	}
	}catch(e){
		platformLogger.log("Error :" +e);
	}
})();


var platformStorage = {

	setItem : function(key, value) {
		if (key == "CURRENT_LOGGEDIN_USER" || key == "CURRENT_LOGGEDIN_USER_PWD" || key == "RBI_EULA_ACCEPTED"
				|| key == "isLoggedIn" || key == "PCN" || 
				key == "PREFERENCES_RESTRICT_PURCHASE_KEY" + "_" +helper.GetUserId() || 
				key == "PREFERENCES_RESTRICT_CONTENT_KEY" + "_" +helper.GetUserId() ||
				key == "IsFreeTrialUsed" || key == APP_VERSION) {
			try {
				//platformLogger.log("Save Data:" + key + " " + value);
				fileStorage.setItem(key, value);
				} catch (e) {
				// Use localStorage for Emulator
				localStorage.setItem(key, value);
			}
		} else {
			localStorage.setItem(key, value);
		}
	},
	getItem : function(key) {
		if (key == "CURRENT_LOGGEDIN_USER" || key == "CURRENT_LOGGEDIN_USER_PWD" || key == "RBI_EULA_ACCEPTED"
				|| key == "isLoggedIn" || key == "PCN" || 
				key == "PREFERENCES_RESTRICT_PURCHASE_KEY" + "_" +helper.GetUserId() || 
				key == "PREFERENCES_RESTRICT_CONTENT_KEY" + "_" +helper.GetUserId() ||
				key == "IsFreeTrialUsed" || key == APP_VERSION) {
			try {
				//platformLogger.log("Get Data:" + key +"Value :" +fileStorage.getItem(key));
				return fileStorage.getItem(key);
			} catch (e) {
				// Use localStorage for Emulator
				return localStorage.getItem(key);
			}
		} else {
			return localStorage.getItem(key);
		}
	},
	removeItem : function(key) {
		if (key == "CURRENT_LOGGEDIN_USER" || key == "CURRENT_LOGGEDIN_USER_PWD" || key == "RBI_EULA_ACCEPTED"
				|| key == "isLoggedIn" || key == "PCN" || 
				key == "PREFERENCES_RESTRICT_PURCHASE_KEY" + "_" +helper.GetUserId() || 
				key == "PREFERENCES_RESTRICT_CONTENT_KEY" + "_" +helper.GetUserId() ||
				key == "IsFreeTrialUsed" || key == APP_VERSION) {
			try {
				//platformLogger.log("Remove Data:" + key);
				fileStorage.removeItem(key);
			} catch (e) {
				// Use localStorage for Emulator
				localStorage.removeItem(key);
			}
		} else {
			localStorage.removeItem(key);
		}
	}
};