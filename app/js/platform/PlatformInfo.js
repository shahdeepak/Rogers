/**
* @author bhushan.balki
* platformInfo have the helper interfaces for calling the underlying platform api. 
*/

var platformInfo ={
	platform:"SAM",
	modelName:"Samsung",
	firmware:"Samsung",
	deviceId:"JVPSAMSUNG",
	transactionDeviceID:"Web",
	deviceModelType:"Samsung",
	manufacturer: "Samsung",
    // Title truncation - depends on font size
    // If title has no badges allow 16 characters
    // If title has 1 badge, allow 12 characters
    // If title has 2 badges, allow 9 characters
    // If title has 3 badges, allow 6 characters
    MAX_TITLE_LENGTH: [ 16, 12, 9, 6],

	init:function(){
		try{
		platformInfo.platform = platformInfo.getPlatform();
		platformInfo.modelName = platformInfo.getModelName();
		platformInfo.firmware = platformInfo.getFirmware();
		platformInfo.deviceId = platformInfo.getDeviceID();
		platformInfo.transactionDeviceID = platformInfo.getTransactionDeviceID();
		platformInfo.deviceModelType = platformInfo.getDeviceModelType();
		}catch(err){
		////alert("err:"+err);	
		platformInfo.platform = "SAM";
		platformInfo.modelName = "Samsung";
		platformInfo.firmware = "Samsung";
		platformInfo.deviceId = "JVPSAMSUNG";
		platformInfo.transactionDeviceID = "web";
		platformInfo.deviceModelType = "Samsung";
		}
	},
	
	getPlatform:function(){
		return "SAM";
	},
	getModelName:function(){
       try{
    	   return document.getElementById("pluginTV").GetProductCode(0);
       }catch(e){
    	   return platformInfo.modelName;
       }
	},	
	getFirmware:function(){
		if(NNaviPlugin.GetFirmware != undefined)
			return NNaviPlugin.GetFirmware();
		return platformInfo.firmware;
	},
	getDeviceManufacturer:function(){
    return platformInfo.manufacturer;
   },
	getDeviceID:function () {
			var deviceId;
		 try {
             var nnavi = document.getElementById("pluginObjectNNavi");
             var ntwk = document.getElementById("pluginObjectNetwork");
             deviceId = nnavi.GetDUID(ntwk.GetMAC());             
         } catch (excptn) {
             //alert("platformInfo:getDeviceID" + excptn);             
         } 	
         if(deviceId == undefined ){
        	 deviceId = "JVPSAMSUNG";
         }
		 
         return deviceId;
	},	
	printHtml:function(){
		var markup = document.documentElement.innerHTML;
		
	},
	getTransactionDeviceID:function(){
		
		var transactionDeviceID;
		try {
			transactionDeviceID = platformInfo.getModelName() +"_"+ platformInfo.getDeviceID();            
        } catch (excptn) {
        	//alert("platformInfo:getTransactionDeviceID exep" + excptn);               
        } 	
		
        return transactionDeviceID;
	},
	getDeviceModelType: function () {
		return "Samsung";
	},
	exitApp:function(keyCode){
		 //Helper.Cleanup();
		if(keyCode != undefined && keyCode == KEY_CODES.EXIT){
			curWidget.setPreference("exit", "true");
		}else{
			curWidget.setPreference("return", "true");
		}
	},
	playbackResumeSupported:function(){ 
		var playbackResumeSupported = false;

        // Removed per ZOE-36855
		// Devices which does nor support ResumePlay API
		/*var playbackResumeNotSupportedDevices = ["E5900","EM59C","F5500","E6100","E7100",
		                                         "F8000","EH5300","E6500","EM59","ES7500",
		                                         "ES7100","ES6100","ES8000"];
		var deviceModel = this.getModelName();
		
		for(var i = 0; i < playbackResumeNotSupportedDevices.length; i++){
			if(deviceModel.indexOf(playbackResumeNotSupportedDevices[i]) != -1){
				playbackResumeSupported = false;
				break;
			}
		}*/
		return playbackResumeSupported;		
	}
};
platformInfo.init();