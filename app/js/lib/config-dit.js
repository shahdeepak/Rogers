hostName = "dit.redboxinstant.net";
var wtrealm = "urn:RBI:Web:DIT2";
var wreply = "https://"+hostName+"/rbproxy/login2";

RBI.Config.proxyBase = "http://"+hostName;
RBI.Config.proxyBaseSecure = "https://" + hostName;

RBI.Config.licenseServerUrl = RBI.Config.proxyBaseSecure + "/rbproxy/api/GetLicense";

RBI.Config.SSOConfig.wctx.rm = wtrealm;
RBI.Config.SSOConfig.wctx.ry = wreply;

RBI.Config.LogoutConfig.wtrealm = wtrealm;
RBI.Config.LogoutConfig.wreply = "https://" + hostName + "/rbproxy/logout";

RBI.Config.myAccountPage = "https://" + hostName + "/myAccount.html";
