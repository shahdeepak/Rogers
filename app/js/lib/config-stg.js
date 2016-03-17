hostName = "stg.redboxinstant.net";
var whr = "STGRedbox:e";
var wtrealm = "urn:RBI:Web:STG2";


RBI.Config.proxyBase = "http://"+hostName;
RBI.Config.proxyBaseSecure ="https://"+hostName;
RBI.Config.olBase = "https://api-stg.redboxinstant.com/orch-stg1/zoetrope/";
RBI.Config.openApiOAuthUrl ="http://redbox-np-stage3.lb.apidn.net/",
RBI.Config.openApiOAuthClientId = "70b45b884a1cdd64be8cde1deb7227ff";

RBI.Config.licenseServerUrl = RBI.Config.proxyBaseSecure + "/rbproxy/api/GetLicense";
RBI.Config.sessionShiftUrl = "https://api-stg.redboxinstant.com/orch-stg1/session_shift?access_token={TOKEN}";
RBI.Config.loginUrl = "https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/issue/wstrust/mixed/username";
   
RBI.Config.SSOConfig.action ="https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
RBI.Config.SSOConfig.whr = whr;
RBI.Config.SSOConfig.wreply = "https://redbox-rbi.accesscontrol.windows.net/v2/wsfederation";
RBI.Config.SSOConfig.wctx.rm = wtrealm;
RBI.Config.SSOConfig.wctx.ry = "https://" + hostName + "/rbproxy/login2";

RBI.Config.LogoutConfig.action = "https://stg-auth.accessredbox.net/IdentityProvider-Encrypted/wsfed/issue";
RBI.Config.LogoutConfig.whr = whr;
RBI.Config.LogoutConfig.wtrealm = wtrealm;
RBI.Config.LogoutConfig.wreply = "https://" + hostName + "/rbproxy/logout";

RBI.Config.scrubberMedium = "320x168";

RBI.Config.clientId = "af79f7091903e1d1b8ac65d5e745ade8"; //93040871d531b12b5d892d19fec2e0fa
RBI.Config.clientSecret = "0aadf8d5213fb566"; //d1223dc2166547aa
 

