$LAB.script("../app/js/lib/config.js")
	.wait(function() {
		config.environment = config.environment.toLowerCase();
		if (config.environment == RBI.Config.Defines.DEV) {
			//ssoLoginTest();
		} 
		if (config.environment == RBI.Config.Defines.DIT) {
			$LAB.script("../app/js/lib/config-dit.js")
			.wait(function() {
				helper.debugLog("Config file loaded - config-dit.js");
			});
		}
		if (config.environment == RBI.Config.Defines.LOCAL ) {
			$LAB.script("../app/js/lib/config-local.js")
			.wait(function() {
				helper.debugLog("Config file loaded - config-local.js");
			});
		}
		if (config.environment == RBI.Config.Defines.STG) {
			$LAB.script("../app/js/lib/config-stg.js")
			.wait(function() {
				helper.debugLog("Config file loaded - config-stg.js");
			});

		}
	});