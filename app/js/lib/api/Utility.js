/**
*
* @filename: Utility.js 
*
* Description: Various utilities
*
* @author rohan.fating
*/

var Utility = {

};

Utility.getCurrentTime = function() {
    var timeDifference = 0; //Time Difference b/w Server and Local time which is set in Device.
    var timeZoneOffset = -5;
	var curTime = new Date((new Date).getTime() + (timeDifference + timeZoneOffset * 3600) * 1000);

	var milliSec = curTime.getTime();
	var seconds = curTime.getUTCSeconds();
	var minutes = curTime.getUTCMinutes();
	var hours = curTime.getUTCHours();
	var strDay = curTime.getUTCDay();
	var strMonth = curTime.getUTCMonth() + 1;
	var strYear = curTime.getUTCFullYear();
	var strDate = curTime.getUTCDate();
	var strMer = (hours >= 12) ? "PM" : "AM";
	hours = ((hours > 12) ? (hours - 12) : hours);
	if (0 == hours)
		hours = 12;
	var strTime = "" + hours;
	strTime += ((minutes < 10) ? ":0" : ":") + minutes;

	return {
		strTime: strTime, /* In HH:MM format */
		time: milliSec,
		mer: strMer,
		ndate: strDate,
		day: strDay,
		month: strMonth,
		year: strYear,
		hr: hours,
		min: minutes,
		sec: seconds
	};
};

Utility.pad = function(n) {
	return n<10 ? '0'+n : n;
};

// Convert to ISO
Utility.ISODateString = function (setD) {
    var milliSeconds = "" + Utility.getCurrentTime().time + "";
    milliSeconds = milliSeconds.slice(0, 3);
    /*
    return Utility.getCurrentTime().year+'-'
    + Utility.pad(Utility.getCurrentTime().month)+'-'
    + Utility.pad(Utility.getCurrentTime().ndate)+'T'
    + Utility.pad(setD.getUTCHours())+':'
    + Utility.pad(setD.getUTCMinutes())+':'
    + Utility.pad(Utility.getCurrentTime().sec)+'.'
    + Utility.pad(milliSeconds)+'Z';
    */
    return setD.getUTCFullYear() + '-'
              + Utility.pad(setD.getUTCMonth()+1) + '-'
              + Utility.pad(setD.getUTCDate()) + 'T'
              + Utility.pad(setD.getUTCHours()) + ':'
              + Utility.pad(setD.getUTCMinutes()) + ':'
              + Utility.pad(setD.getUTCSeconds()) + '.'
              + Utility.pad(setD.getUTCMilliseconds()) + 'Z';
};

Utility.putInnerHTML = function(parentDiv, content) {
    if (parentDiv != null) {
		while (parentDiv.firstChild) {
            if (parentDiv.deleteChild)
                parentDiv.deleteChild(parentDiv.firstChild);
            else
                parentDiv.removeChild(parentDiv.firstChild);
        }
        parentDiv.innerHTML = content;
    }
};

Utility.httpFix = function(URL) {
	var imgURL = URL;
	if (-1 == imgURL.indexOf("http://")) {
		imgURL = "http://" + URL;
	}
	return imgURL;
};

// this function return the device id
Utility.DeviceID = function () {
    var deviceID = "JVPPS3"; // default
    if (typeof vod !== 'undefined') {
        deviceID = vod.udid();
    }
    else {
        var device = document.getElementById("device");
        if (typeof device != 'undefined' && device != null) {
            macAddress = device.net_macAddress;
            if (isDefined(macAddress)) {
                deviceID = macAddress;
            }
        }
    }

    return deviceID;

};

//TransactionDeviceId Should be <Model_Name>_<MAC_ADRESS> which need the call to underline api
Utility.GetTransactionDeviceID = function() {
    return RBI.PlatformConfig.deviceType + '_' + Utility.DeviceID();
};

Utility.isValidEmail = function(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
};

Utility.isValidFirstName = function(fName) {
	var regex = /^[a-zA-Z\\-\\' ]*$/;
	return regex.test(fName);
};

Utility.isValidLastName = function(lName) {
	var regex = /^[a-zA-Z\\-\\' ]*$/;
	return regex.test(lName);
};

Utility.isValidZipCode = function(zip) {
	var regex = /^$|^\d{{5}}$|^\d{{5}}-\d{{4}}$|^\d{{9}}$/;
	return regex.test(zip);
};

var Base64 = {

		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// public method for encoding
		encode : function (input) {
		    var output = "";
		    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		    var i = 0;

		    input = Base64._utf8_encode(input);

		    while (i < input.length) {

		        chr1 = input.charCodeAt(i++);
		        chr2 = input.charCodeAt(i++);
		        chr3 = input.charCodeAt(i++);

		        enc1 = chr1 >> 2;
		        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		        enc4 = chr3 & 63;

		        if (isNaN(chr2)) {
		            enc3 = enc4 = 64;
		        } else if (isNaN(chr3)) {
		            enc4 = 64;
		        }

		        output = output +
		        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
		        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		    }

		    return output;
		},

		// public method for decoding
		decode : function (input) {
		    var output = "";
		    var chr1, chr2, chr3;
		    var enc1, enc2, enc3, enc4;
		    var i = 0;

		    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		    while (i < input.length) {

		        enc1 = this._keyStr.indexOf(input.charAt(i++));
		        enc2 = this._keyStr.indexOf(input.charAt(i++));
		        enc3 = this._keyStr.indexOf(input.charAt(i++));
		        enc4 = this._keyStr.indexOf(input.charAt(i++));

		        chr1 = (enc1 << 2) | (enc2 >> 4);
		        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		        chr3 = ((enc3 & 3) << 6) | enc4;

		        output = output + String.fromCharCode(chr1);

		        if (enc3 != 64) {
		            output = output + String.fromCharCode(chr2);
		        }
		        if (enc4 != 64) {
		            output = output + String.fromCharCode(chr3);
		        }

		    }

		    output = Base64._utf8_decode(output);

		    return output;

		},

		// private method for UTF-8 encoding
		_utf8_encode : function (string) {
		    string = string.replace(/\r\n/g,"\n");
		    var utftext = "";

		    for (var n = 0; n < string.length; n++) {

		        var c = string.charCodeAt(n);

		        if (c < 128) {
		            utftext += String.fromCharCode(c);
		        }
		        else if((c > 127) && (c < 2048)) {
		            utftext += String.fromCharCode((c >> 6) | 192);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }
		        else {
		            utftext += String.fromCharCode((c >> 12) | 224);
		            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }

		    }

		    return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode : function (utftext) {
		    var string = "";
		    var i = 0;
		    var c = c1 = c2 = 0;

		    while ( i < utftext.length ) {

		        c = utftext.charCodeAt(i);

		        if (c < 128) {
		            string += String.fromCharCode(c);
		            i++;
		        }
		        else if((c > 191) && (c < 224)) {
		            c2 = utftext.charCodeAt(i+1);
		            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
		            i += 2;
		        }
		        else {
		            c2 = utftext.charCodeAt(i+1);
		            c3 = utftext.charCodeAt(i+2);
		            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		            i += 3;
		        }

		    }

		    return string;
		}

};