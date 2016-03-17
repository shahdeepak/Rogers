var storage ={
	shareItems:  new Object(),
	
	// save state on basis of key value pair
    SaveData: function (key, value) {
        if (typeof (localStorage) !== "undefined") {
            platformStorage.setItem(key, value);
        }
    },

    //gets stored data on the basis of given key
    GetData: function (key) {
        if (typeof (localStorage) !== "undefined") {
            data = platformStorage.getItem(key);

            return data;
        }
    },	
    setGlobalSharedItem: function (key, value) {
        this.shareItems[key] = value;
    },
    getGlobalSharedItem: function (key) {
        return this.shareItems[key];
    }
};