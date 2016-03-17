/**
 * Created by Amit.Srivastava1 on 10/18/13.
 */

var Omniture = {
    pageName: "",
    previousPageName: "",
    InvokeType: {
        load: "load",
        click: "click"
    },
    s: new AppMeasurement(),

    Init: function () {
        //s = new AppMeasurement();
        this.s.account = RBI.omnitureConfig.omnitureAccount;
        /************************** CONFIG SECTION **************************/
        /* You may add or alter any code config here. */
        this.s.charSet = RBI.omnitureConfig.charSet;
        /* Conversion Config */
        this.s.currencyCode = RBI.omnitureConfig.currencyCode;
        /* Link Tracking Config */
        this.s.trackDownloadLinks = RBI.omnitureConfig.trackDownloadLinks;
        this.s.trackExternalLinks = RBI.omnitureConfig.trackExternalLinks;
        this.s.trackInlineStats = RBI.omnitureConfig.trackInlineStats;
        this.s.linkDownloadFileTypes = RBI.omnitureConfig.linkDownloadFileTypes;
        this.s.linkInternalFilters = RBI.omnitureConfig.linkInternalFilters; //optional: add your internal domain here
        this.s.linkLeaveQueryString = RBI.omnitureConfig.linkLeaveQueryString;
        this.s.linkTrackVars = RBI.omnitureConfig.linkTrackVars;
        this.s.linkTrackEvents = RBI.omnitureConfig.linkTrackEvents;

        /* WARNING: Changing any of the below variables will cause drastic
         changes to how your visitor data is collected.  Changes should only be
         made when instructed to do so by your account manager.*/
        this.s.trackingServer = RBI.omnitureConfig.trackingServer;
        this.s.extraSearchEngine = RBI.omnitureConfig.extraSearchEngine;
        this.s.channelDomain = RBI.omnitureConfig.channelDomain;
        this.s.channelPattern = RBI.omnitureConfig.channelPattern;
    },
    Variables: {
        products: "",
        //scPurchase:"",
        //pageName: "",
        //linktracking:"",
        //previousPageName: "",
        eVar3: "",
        eVar8: "",
        eVar9: "",
        eVar10: "",
        eVar26: "",
        eVar33: "",
        eVar37: "",
        eVar39: "",
        eVar40: "",
        eVar42: "",
        eVar44: "",
        eVar47: "",
        eVar51: "",
        eVar54: "",
        eVar55: "",
        eVar58: "",
        eVar67: "",
        eVar68: "",
        //event3:"",
        //event12:"",
        //event34:"",
        //event35:"",
        //event36:"",
        //event51:"",
        //event55:"",
        prop1: "",
        prop2: "",
        prop3: "",
        prop4: "",
        prop7: "",
        prop8: "",
        prop9: "",
        prop12: "",
        prop14: "",
        prop23: "",
        prop26: "",
        prop27: "",
        events: []},

    Clear: function () {
        Omniture.Variables.products = "";
        //Omniture.Variables.scPurchase="";
        //Omniture.Variables.pageNames="";
        //Omniture.Variables.previousPageName="";
        Omniture.Variables.eVar3 = "";
        Omniture.Variables.eVar8 = "";
        Omniture.Variables.eVar9 = "";
        Omniture.Variables.eVar10 = "";
        Omniture.Variables.eVar26 = "";
        Omniture.Variables.eVar33 = "";
        Omniture.Variables.eVar37 = "";
        Omniture.Variables.eVar39 = "";
        Omniture.Variables.eVar40 = "";
        Omniture.Variables.eVar42 = "";
        Omniture.Variables.eVar44 = "";
        Omniture.Variables.eVar47 = "";
        Omniture.Variables.eVar51 = "";
        Omniture.Variables.eVar54 = "";
        Omniture.Variables.eVar55 = "";
        Omniture.Variables.eVar58 = "";
        Omniture.Variables.eVar67 = "";
        Omniture.Variables.eVar68 = "";
        //Omniture.Variables.event3="";
        //Omniture.Variables.event12="";
        //Omniture.Variables.event34="";
        //Omniture.Variables.event35="";
        //Omniture.Variables.event36="";
        //Omniture.Variables.event51="";
        //Omniture.Variables.event55="";
        Omniture.Variables.prop1 = "";
        Omniture.Variables.prop2 = "";
        Omniture.Variables.prop3 = "";
        Omniture.Variables.prop4 = "";
        Omniture.Variables.prop7 = "";
        Omniture.Variables.prop8 = "";
        Omniture.Variables.prop9 = "";
        Omniture.Variables.prop12 = "";
        Omniture.Variables.prop14 = "";
        Omniture.Variables.prop23 = "";
        Omniture.Variables.prop26 = "";
        Omniture.Variables.prop27 = "";
        Omniture.Variables.events = [];
    },

    InvokeOmniture: function (invokeType) {//load or click
        this.s.clearVars();
        if(!internetConnected) return;  // if there is no connection do not invoke Omniture

        helper.debugLog("Omniture variables: " + JSON.stringify(Omniture.Variables));
        if (Omniture.Variables.products !== "") {this.s.products = Omniture.Variables.products;}
        //if(Omniture.Variables.scPurchase!==""){this.s.scPurchase=Omniture.Variables.scPurchase;}
        if (Omniture.pageName !== "") {this.s.pageName = Omniture.pageName.toLowerCase();}
        //if (Omniture.previousPageName !== "") {this.s.previousPageName = Omniture.previousPageName;}
        if (Omniture.Variables.eVar3 !== "") {this.s.eVar3 = Omniture.Variables.eVar3.toLowerCase();}
        if (Omniture.Variables.eVar8 !== "") {this.s.eVar8 = Omniture.Variables.eVar8.toLowerCase();}
        if (Omniture.Variables.eVar9 !== "") {this.s.eVar9 = Omniture.Variables.eVar9.toLowerCase();}
        if (Omniture.Variables.eVar10 !== "") {this.s.eVar10 = Omniture.Variables.eVar10.toLowerCase();}
        if (Omniture.Variables.eVar26 !== "") {this.s.eVar26 = Omniture.Variables.eVar26.toLowerCase();}
        if (Omniture.Variables.eVar33 !== "") {this.s.eVar33 = Omniture.Variables.eVar33.toLowerCase();}
        if (Omniture.Variables.eVar37 !== "") {this.s.eVar37 = Omniture.Variables.eVar37.toLowerCase();}
        if (Omniture.Variables.eVar39 !== "") {this.s.eVar39 = Omniture.Variables.eVar39.toLowerCase();}
        if (Omniture.Variables.eVar40 !== "") {this.s.eVar40 = Omniture.Variables.eVar40.toLowerCase();}
        if (Omniture.Variables.eVar42 !== "") {this.s.eVar42 = Omniture.Variables.eVar42.toLowerCase();}
        if (Omniture.Variables.eVar44 !== "") {this.s.eVar44 = Omniture.Variables.eVar44.toLowerCase();}
        if (Omniture.Variables.eVar47 !== "") {this.s.eVar47 = Omniture.Variables.eVar47.toLowerCase();}
        if (Omniture.Variables.eVar51 !== "") {this.s.eVar51 = Omniture.Variables.eVar51.toLowerCase();}
        if (Omniture.Variables.eVar54 !== "") {this.s.eVar54 = Omniture.Variables.eVar54.toLowerCase();}
        if (Omniture.Variables.eVar55 !== "") {this.s.eVar55 = Omniture.Variables.eVar55.toLowerCase();}
        if (Omniture.Variables.eVar58 !== "") {this.s.eVar58 = Omniture.Variables.eVar58.toLowerCase();}
        if (Omniture.Variables.eVar67 !== "") {this.s.eVar67 = Omniture.Variables.eVar67.toLowerCase();}
        if (Omniture.Variables.eVar68 !== "") {this.s.eVar68 = Omniture.Variables.eVar68.toLowerCase();}
        //if(Omniture.Variables.event3!==""){this.s.event3=Omniture.Variables.event3;}
        //if(Omniture.Variables.event12!==""){this.s.event12=Omniture.Variables.event12;}
        //if(Omniture.Variables.event34!==""){this.s.event34=Omniture.Variables.event34;}
        //if(Omniture.Variables.event35!==""){this.s.event35=Omniture.Variables.event35;}
        //if(Omniture.Variables.event36!==""){this.s.event36=Omniture.Variables.event36;}
        //if(Omniture.Variables.event51!==""){this.s.event51=Omniture.Variables.event51;}
        //if(Omniture.Variables.event55!==""){this.s.event55=Omniture.Variables.event55;}
        if (Omniture.Variables.prop1 !== "") {this.s.prop1 = Omniture.Variables.prop1.toLowerCase();}
        if (Omniture.Variables.prop2 !== "") {this.s.prop2 = Omniture.Variables.prop2.toLowerCase();}
        if (Omniture.Variables.prop3 !== "") {this.s.prop3 = Omniture.Variables.prop3.toLowerCase();}
        if (Omniture.Variables.prop4 !== "") {this.s.prop4 = Omniture.Variables.prop4.toLowerCase();}
        if (Omniture.Variables.prop7 !== "") {this.s.prop7 = Omniture.Variables.prop7.toLowerCase();}
        if (Omniture.Variables.prop8 !== "") {this.s.prop8 = Omniture.Variables.prop8.toLowerCase();}
        if (Omniture.Variables.prop9 !== "") {this.s.prop9 = Omniture.Variables.prop9.toLowerCase();}
        if (Omniture.Variables.prop12 !== "") {this.s.prop12 = Omniture.Variables.prop12.toLowerCase();}
        if (Omniture.Variables.prop14 !== "") {this.s.prop14 = Omniture.Variables.prop14.toLowerCase();}
        if (Omniture.previousPageName !== "") {this.s.prop23 = Omniture.previousPageName.toLowerCase();}
        if (Omniture.Variables.prop26 !== "") {this.s.prop26 = Omniture.Variables.prop26.toLowerCase();}
        if (Omniture.Variables.prop27 !== "") {this.s.prop27 = Omniture.Variables.prop27.toLowerCase();}
        // event names should not be converted to lower case
        if (Omniture.Variables.events.length > 0) {this.s.events = Omniture.Variables.events.join(","); helper.debugLog("Omniture events: " + this.s.events); }

        if (invokeType == Omniture.InvokeType.load) {
            this.s.t();
        }
        if (invokeType == Omniture.InvokeType.click) {
            this.s.tl(true,"o",this.s.eVar51);
        }
        Omniture.Clear();
    },

    getDeliveryTypes: function (str) {
        str = str.replace(/kiosk,kiosk/gi, "ondisc")
            .replace(/kiosk/gi, "ondisc")
            .replace(/subscription/gi, "instant")
            .replace(/VOD/gi, "ondemand")
            .replace(/EST/gi, "ondemand")
            .replace(/ondemand,ondemand/gi,"ondemand");
        return str;
    },

    getNewRepeat: function (d, cn) {
        var e = new Date(),
            cval, sval, ct = e.getTime();
        d = d ? d : 30;
        cn = cn ? cn : 's_nr';
        e.setTime(ct + d * 24 * 60 * 60 * 1000);
        cval = this.s.c_r(cn);
        if (cval.length == 0) {
            this.s.c_w(cn, ct + '-New', e);
            return 'New';
        }
        sval = Omniture.split(cval, '-');
        if (ct - sval[0] < 30 * 60 * 1000 && sval[1] == 'New') {
            this.s.c_w(cn, ct + '-New', e);
            return 'New';
        } else {
            this.s.c_w(cn, ct + '-Repeat', e);
            return 'Repeat';
        }
    },

    split: function(l,d){
        var i,x=0,a=new Array;
        while(l){
            i=l.indexOf(d);
            i=i>-1?i:l.length;
            a[x++]=l.substring(0,i);
            l=l.substring(i+d.length);
        }
        return a;
    }



//    //Following Code taken from Old Omniture file from 1.3 LG code.
//
//    //Setup Clickmap
//    function s_getObjectID(o)
//    {
//        return o.href;
//    }
//    s.getObjectID=s_getObjectID;
//
//    s.usePlugins=true;
//
//    function s_doPlugins(s)
//    {
//        //Determine bounce rate for all visits
//        s.visitstart=s.getVisitStart('s_vs');
//        if(s.visitstart&&s.visitstart==1) {
//            s.firstPage='firstpage';
//            s.eVar9 = "rbismsgapp";
//        }
//        s.clickPast(s.firstPage,'event49','event50');
//
//        s.channelManager('refcode','','cmgvo','','s_dl','');
//
//        /* Automate Campaign Tracking Code Extraction based on the refcode parameter*/
//        if(!s.campaign)
//        {
//            s.campaign=s.getQueryParam('refcode');
//            s.getValOnce(s.campaign,'s_campaign',0);
//
//            // RBI CHANGE BEGIN
//            if (s.campaign) {
//                s.eVar11 = s.campaign;
//
//                // Get campaign partner code.
//                var campaignPartner = s.campaign.substring(0, 3).toUpperCase();
//
//                var campaignPartners = [ "RBI", "VZT", "VZW", "RBC", "MXB", "VZF", "SMG", "LGT", "PS3" ];
//                if (campaignPartners.indexOf(campaignPartner) > -1) {
//                    s.eVar24 = campaignPartner;
//                }
//            }
//            // RBI CHANGE END
//            //R2 B
//            if(!s.eVar13 && s.campaign)s.eVar13=s.crossVisitParticipation(s.campaign,'s_cstk','30','5',' > ','','1');
//            if(s._channel)s.eVar21=s.crossVisitParticipation(s._channel,'s_chsk','30','5',' > ','','1');
//            //R2 E
//        }
//
//        /* Automate Internal Campaign Code Extraction based on icid parameter*/
//        if(!s.eVar28)
//        {
//            s.eVar28=s.getQueryParam('icid');
//            s.eVar28=s.getValOnce(s.eVar28,'s_ev28',0);
//            //R2 B
//            if(!s.eVar27 && s.eVar28)s.eVar27=s.crossVisitParticipation(s.eVar28,'s_28stk','30','5',' > ','','1');
//            //R2 E
//        }
//
//        //stack merchandising
//        if(s.eVar14)s.eVar15=s.crossVisitParticipation(s.eVar14,'s_merchstk','30','5',' > ','','1');
//
//        /* Automate Search Keyword Variables and Events*/
//        if(s.prop4)
//        {
//            s.eVar1=s.prop4;
//            s.events=s.apl(s.events,'event1',',',2);
//            if(s.prop14&&(s.prop14=='0'||s.prop14=='zero'))
//            {
//                s.prop14='zero';
//                s.events=s.apl(s.events,'event2',',',2);
//            }
//            //R2 B
//            if(s.events.indexOf('event1')>-1){
//                s.eVar33="+1";
//            }
//            //R2 E
//        }
//        /* Do not refire search event if the same search term passed in twice in a row */
//        var t_search=s.getValOnce(s.eVar1,'s_stv',0);
//        if(t_search=='')
//        {
//            var a=s.split(s.events,',');
//            var e="";
//            for(var i = 0; i < a.length ; i++ )
//            {
//                if(a[i]=='event1'||a[i]=='event2'){}
//                    //continue;
//                else
//                    e += a[i]?a[i]+',':a[i];
//            }
//            s.events=e.substring(0,e.length-1);
//        }
//
//        /* Automate Custom ProdView Event */
//        if(s.events&&s.events.indexOf('prodView')>-1)
//            s.events=s.apl(s.events,'event3',',',2);
//
//        /*  Automate OrderID eVar */
//        if(s.purchaseID)
//            s.eVar64=s.purchaseID;
//        //R2 B
//        s.transactionID=s.purchaseID;
//        //R2 E
//
//        /* Determine Search Location, Add-to-Cart Location and Percentage of Page Viewed via previous page name*/
//        s.prop23=s.getPreviousValue(s.pageName,'gpv','');
//        if(s.events&&s.events.indexOf('scAdd')>-1)
//        {
//            s.linkTrackVars=s.apl(s.linkTrackVars,'eVar31',',',2);
//            if(s.prop23)
//                s.eVar31=s.prop23;
//        }
//
//        /* Determine whether visitor is New or a Repeat visitor within the last 365 days */
//        //s.eVar10=s.getNewRepeat(365);
//
//        /* Automate Finding Method eVar */
//        var internalFlag = false;
//        if(document.referrer)
//        {
//            var filters = s.split(s.linkInternalFilters,',');
//            var docRef = s.split(document.referrer,'/');
//            docRef = docRef[2];
//            for(var f in filters)
//            {
//                if(docRef.indexOf(filters[f])>-1)
//                    internalFlag = true;
//            }
//        }
//
//        /* create productmerch product for merchandising eVar binding */
//        if(s.eVar3&&(!s.products||(s.products&&s.products.indexOf(';productmerch')>-1)||s.newProduct=='true')&&(s.p_fo('onemerch')==1||(s.linkType!=''&&s.linkTrackVars.indexOf('eVar3')>-1)))
//        {
//            if(!s.c_r('productnum'))
//                s.productNum=1;
//            else
//                s.productNum=parseInt(s.c_r('productnum'))+1;
//            s.products=';productmerch' + s.productNum;
//            var e=new Date();
//            e.setTime(e.getTime()+(30*86400000));
//            s.c_w('productnum',s.productNum,e);
//            s.linkTrackVars=s.apl(s.linkTrackVars,'events,products',',',2);
//            s.linkTrackEvents=s.apl(s.linkTrackEvents,'event33',',',2);
//            s.events=s.apl(s.events,'event33',',',2);
//        }
//        if(s.eVar3&&s.events.indexOf('prodView')>-1)
//        {
//            s.events=s.apl(s.events,'event33',',',2);
//        }
//        if(s.c_r('productnum')&&s.events.indexOf('purchase')>-1)
//            s.c_w('productnum','0',0);
//
//        /* Blank out products if events isn't set so that we don't inflate prodViews */
//        /* if(s.products&&!s.events) */
//        /*	s.products=''; */
//
//        //Lowercase all variables
//        s.manageVars('lowercaseVars');
//
//        //Setup Clickmap Object IDs
//        s.setupDynamicObjectIDs();
//
//        //Get rid of browser plugins.  Not used in SC15/not needed
//        s.plugins='';
//
//        if(s.eVar48)s.prop21=s.eVar48;
//        if(s.eVar28)s.prop16=s.eVar28;
//
//    }
//    s.doPlugins=s_doPlugins;
//    /************************** PLUGINS SECTION *************************/
//    /* You may insert any plugins you wish to use here.                 */
//
//    /*
//     * Utility manageVars v1.4 - clear variable values (requires split 1.5)
//     */
//    s.manageVars=new Function("c","l","f",""
//        +"var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa"
//        +"geName,purchaseID,channel,server,pageType,campaign,state,zip,events"
//        +",products,transactionID';for(var n=1;n<76;n++){vl+=',prop'+n+',eVar"
//        +"'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl"
//        +"it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l"
//        +"a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}"
//        +"}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0"
//        +");return true;}else{return false;}");
//    s.clearVars=new Function("t","var s=this;s[t]='';");
//    s.lowercaseVars=new Function("t",""
//        +"var s=this;if(s[t]&&t!='events'){s[t]=s[t].toString();if(s[t].index"
//        +"Of('D=')!=0){s[t]=s[t].toLowerCase();}}");
//
//    /*
//     * Plugin: getQueryParam 2.4
//     */
//    s.getQueryParam=new Function("p","d","u","h",""
//        +"var s=this,v='',i,j,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.loca"
//        +"tion);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0"
//        +"?p.length:i;t=s.p_gpv(p.substring(0,i),u+'',h);if(t){t=t.indexOf('#"
//        +"')>-1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substrin"
//        +"g(i==p.length?i:i+1)}return v");
//    s.p_gpv=new Function("k","u","h",""
//        +"var s=this,v='',q;j=h==1?'#':'?';i=u.indexOf(j);if(k&&i>-1){q=u.sub"
//        +"string(i+1);v=s.pt(q,'&','p_gvf',k)}return v");
//    s.p_gvf=new Function("t","k",""
//        +"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
//        +"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
//        +"epa(v)}return''");
//
//    /*
//     * Plugin: getValOnce v1.1
//     */
//    s.getValOnce=new Function("v","c","e","t",""
//        +"var s=this,a=new Date,v=v?v:'',c=c?c:'s_gvo',e=e?e:0,i=t=='m'?6000"
//        +"0:86400000;k=s.c_r(c);if(v){a.setTime(a.getTime()+e*i);s.c_w(c,v,e"
//        +"==0?0:a);}return v==k?'':v");
//
//    /*
//     * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
//     */
//    s.split=new Function("l","d",""
//        +"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
//        +"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");
//
//    /*
//     * Plugin Utility: apl v1.1
//     */
//    s.apl=new Function("l","v","d","u",""
//        +"var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a."
//        +"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
//        +"e()));}}if(!m)l=l?l+d+v:v;return l");
//
//    /*
//     * Function - read combined cookies v 0.35
//     */
//    if(!s.__ccucr)
//    {
//        s.c_rr=s.c_r;
//        s.__ccucr = true;
//        function c_r(k)
//        {
//            var s=this,d=new Date,v=s.c_rr(k),c=s.c_rr('s_pers'),i,m,e;
//            if(v)return v;k=s.ape(k);i=c.indexOf(' '+k+'=');c=i<0?s.c_rr('s_sess'):c;
//            i=c.indexOf(' '+k+'=');m=i<0?i:c.indexOf('|',i);e=i<0?i:c.indexOf(';',i);
//            m=m>0?m:e;v=i<0?'':s.epa(c.substring(i+2+k.length,m<0?c.length:m));
//            if(m>0&&m!=e)if(parseInt(c.substring(m+1,e<0?c.length:e))<d.getTime())
//            {d.setTime(d.getTime()-60000);s.c_w(s.epa(k),'',d);v='';}return v;
//        }
//        s.c_r=c_r;
//    }
//    /*
//     * Function - write combined cookies v 0.36
//     */
//    if(!s.__ccucw)
//    {
//        s.c_wr=s.c_w;
//        s.__ccucw = true;
//        function c_w(k,v,e)
//        {
//            var s=this,d=new Date,ht=0,pn='s_pers',sn='s_sess',pc=0,sc=0,pv,sv,c,i,t;
//            d.setTime(d.getTime()-60000);if(s.c_rr(k)) s.c_wr(k,'',d);k=s.ape(k);
//            pv=s.c_rr(pn);i=pv.indexOf(' '+k+'=');if(i>-1)
//        {pv=pv.substring(0,i)+pv.substring(pv.indexOf(';',i)+1);pc=1;}sv=s.c_rr(sn);
//            i=sv.indexOf(' '+k+'=');if(i>-1){sv=sv.substring(0,i)+sv.substring(sv.indexOf(';',i)+1);
//            sc=1;}d=new Date;if(e){if(e.getTime()>d.getTime()){pv+=' '+k+'='+s.ape(v)+'|'+e.getTime()+';';
//            pc=1;}}else{sv+=' '+k+'='+s.ape(v)+';';sc=1;}sv=sv.replace(/%00/g,'');
//            pv=pv.replace(/%00/g,'');if(sc) s.c_wr(sn,sv,0);if(pc){t=pv;while(t&&t.indexOf(';')!=-1){
//            var t1=parseInt(t.substring(t.indexOf('|')+1,t.indexOf(';')));
//            t=t.substring(t.indexOf(';')+1);ht=ht<t1?t1:ht;}d.setTime(ht);s.c_wr(pn,pv,d);}
//            return v==s.c_r(s.epa(k));
//        }
//        s.c_w=c_w;
//    }
//
//    /*
//     * DynamicObjectIDs v1.5: Setup Dynamic Object IDs based on URL
//     */
//    s.setupDynamicObjectIDs=new Function(""
//        +"var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"
//        +">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"
//        +" if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"
//        +"lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"
//        +"re=1}");
//    s.setOIDs=new Function("e",""
//        +"var s=s_c_il["+s._in+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"
//        +",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"
//        +"{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"
//        +"=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"
//        +"objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"
//        +"pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"
//        +"if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"
//        +")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."
//        +"s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"
//        +"]=new Function('e',x)}}}s.wd.s_semaphore=0;return true");
//
//    /*
//     * Plugin Utility: Replace v1.0
//     */
//    s.repl=new Function("x","o","n",""
//        +"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
//        +"substring(i+o.length);i=x.indexOf(o,i+l)}return x");
//
//    /*
//     * Plugin: getNewRepeat 1.2 - Returns whether user is new or repeat
//     */
//    s.getNewRepeat=new Function("d","cn",""
//        +"var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:"
//        +"'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length="
//        +"=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct"
//        +"-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N"
//        +"ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}");
//
//    /*
//     * Plugin: getPreviousValue_v1.0 - return previous value of designated
//     *   variable (requires split utility)
//     */
//    s.getPreviousValue=new Function("v","c","el",""
//        +"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
//        +"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
//        +"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
//        +":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
//        +"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");
//
//    /*
//     * Plugin Utility - first only
//     */
//    s.p_fo=new Function("n",""
//        +"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
//        +"new Object;return 1;}else {return 0;}");
//
//    /*
//     * Plugin: getTimeParting 2.1
//     */
//    s.getTimeParting=new Function("t","z","y","l","j",""
//        +"var s=this,d,A,U,X,Z,W,B,C,D,Y;d=new Date();A=d.getFullYear();Y=U=S"
//        +"tring(A);if(s.dstStart&&s.dstEnd){B=s.dstStart;C=s.dstEnd}else{;U=U"
//        +".substring(2,4);X='090801|101407|111306|121104|131003|140902|150801"
//        +"|161306|171205|181104|191003';X=s.split(X,'|');for(W=0;W<=10;W++){Z"
//        +"=X[W].substring(0,2);if(U==Z){B=X[W].substring(2,4);C=X[W].substrin"
//        +"g(4,6)}}if(!B||!C){B='08';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;}D"
//        +"=new Date('1/1/2000');if(D.getDay()!=6||D.getMonth()!=0){return'Dat"
//        +"a Not Available'}else{z=z?z:'0';z=parseFloat(z);B=new Date(B);C=new"
//        +" Date(C);W=new Date();if(W>B&&W<C&&l!='0'){z=z+1}W=W.getTime()+(W.g"
//        +"etTimezoneOffset()*60000);W=new Date(W+(3600000*z));X=['Sunday','Mo"
//        +"nday','Tuesday','Wednesday','Thursday','Friday','Saturday'];B=W.get"
//        +"Hours();C=W.getMinutes();D=W.getDay();Z=X[D];U='AM';A='Weekday';X='"
//        +"00';if(C>30){X='30'}if(j=='1'){if(C>15){X='15'}if(C>30){X='30'}if(C"
//        +">45){X='45'}}if(B>=12){U='PM';B=B-12};if(B==0){B=12};if(D==6||D==0)"
//        +"{A='Weekend'}W=B+':'+X+U;if(y&&y!=Y){return'Data Not Available'}els"
//        +"e{if(t){if(t=='h'){return W}if(t=='d'){return Z}if(t=='w'){return A"
//        +"}}else{return Z+', '+W}}}");
//
//    /*
//     * Plugin: getPercentPageViewed v1.3
//     */
//    s.getPercentPageViewed=new Function("ext",""
//        +"var s=this,ext=(arguments.length>0)?ext:0;if(typeof(s.linkType)=='u"
//        +"ndefined'||s.linkType=='e'){var v=s.c_r('s_ppv');s.c_w('s_ppv','');"
//        +"var a=(v.indexOf(',')>-1)?v.split(',',3):[];if(ext){return a;}else{"
//        +"return(a.length>0)?a[0]:'';}}");
//    s.getPPVCalc=new Function (""
//        +"var s=s_c_il["+s._in+"],dh=Math.max(Math.max(s.d.body.scrollHeight,"
//        +"s.d.documentElement.scrollHeight),Math.max(s.d.body.offsetHeight,s."
//        +"d.documentElement.offsetHeight),Math.max(s.d.body.clientHeight,s.d."
//        +"documentElement.clientHeight)),vph=s.wd.innerHeight||(s.d.documentE"
//        +"lement.clientHeight||s.d.body.clientHeight),st=s.wd.pageYOffset||(s"
//        +".wd.document.documentElement.scrollTop||s.wd.document.body.scrollTo"
//        +"p),vh=st+vph,pv=Math.min(Math.round(vh/dh*100),100),c=s.c_r('s_ppv'"
//        +"),a=(c.indexOf(',')>-1)?c.split(',',3):[],cv=(a.length>0)?parseInt("
//        +"a[0]):0,p0=(a.length>1)?parseInt(a[1]):pv,cy=(a.length>2)?parseInt("
//        +"a[2]):0;if(pv>0){s.c_w('s_ppv',((pv>cv)?pv:cv)+','+p0+','+((vh>cy)?"
//        +"vh:cy));}else{s.c_w('s_ppv','');}");
//    s.getPPVSetup = new Function(""
//        +"var s=this;if(s.wd.addEventListener){s.wd.addEventListener('load',s"
//        +".getPPVCalc,false);s.wd.addEventListener('scroll',s.getPPVCalc,fals"
//        +"e);s.wd.addEventListener('resize',s.getPPVCalc,false);}else if(s.wd"
//        +".attachEvent){s.wd.attachEvent('onload',s.getPPVCalc);s.wd.attachEv"
//        +"ent('onscroll',s.getPPVCalc);s.wd.attachEvent('onresize',s.getPPVCa"
//        +"lc);}");
//    s.getPPVSetup();
//
//    /*
//     * Plugin: getVisitStart v2.0 - returns 1 on first page of visit
//     * otherwise 0
//     */
//    s.getVisitStart=new Function("c",""
//        +"var s=this,v=1,t=new Date;t.setTime(t.getTime()+1800000);if(s.c_r(c"
//        +")){v=0}if(!s.c_w(c,1,t)){s.c_w(c,1,0)}if(!s.c_r(c)){v=0}return v;");
//
//    /*
//     * Plugin: clickPast - version 1.0
//     */
//    s.clickPast=new Function("scp","ct_ev","cp_ev","cpc",""
//        +"var s=this,scp,ct_ev,cp_ev,cpc,ev,tct;if(s.p_fo(ct_ev)==1){if(!cpc)"
//        +"{cpc='s_cpc';}ev=s.events?s.events+',':'';if(scp){s.events=ev+ct_ev"
//        +";s.c_w(cpc,1,0);}else{if(s.c_r(cpc)>=1){s.events=ev+cp_ev;s.c_w(cpc"
//        +",0,0);}}}");
//
//    /*
//     *	Plug-in: crossVisitParticipation v1.7 - stacks values from
//     *	specified variable in cookie and returns value
//     */
//    s.crossVisitParticipation=new Function("v","cn","ex","ct","dl","ev","dv",""
//        +"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
//        +" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
//        +"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
//        +"f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
//        +"v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()"
//        +";if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length; q++){z=a"
//        +"rry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\", '');"
//        +"arry[q] = s.split(z, ',');}}var e=new Date();e.setFullYear(e.getFul"
//        +"lYear()+5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry["
//        +"arry.length-1]=[v,new Date().getTime()];else arry[arry.length]=[v,n"
//        +"ew Date().getTime()];var start=arry.length-ct<0?0:arry.length-ct;va"
//        +"r td=new Date();for(var x=start;x<arry.length;x++){var diff=Math.ro"
//        +"und((td.getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(a"
//        +"rry[x][0]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{de"
//        +"lim:',',front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.jo"
//        +"in(h,{delim:dl});if(ce)s.c_w(cn,'');return r;");
//
//    /*
//     * s.join: 1.0 - Joins an array into a string
//     */
//    s.join = new Function("v","p",""
//        +"var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
//        +":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
//        +";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
//        +"se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");
//
//    /*
//     * channelManager v2.8 - Tracking External Traffic
//     */
//    s.channelManager=new Function("a","b","c","d","e","f","g",""
//        +"var s=this,h=new Date,i=0,j,k,l,m,n,o,p,q,r,t,u,v,w,x,y,z,A,B,C,D,E"
//        +",F,G,H,I,J,K,L,M,N,O,P,Q,R,S;h.setTime(h.getTime()+1800000);if(e){i"
//        +"=1;if(s.c_r(e))i=0;if(!s.c_w(e,1,h))s.c_w(e,1,0);if(!s.c_r(e))i=0;i"
//        +"f(f&&s.c_r('s_tbm'+f))i=0;}j=s.referrer?s.referrer:document.referre"
//        +"r;j=j.toLowerCase();if(!j)k=1;else {l=j.indexOf('?')>-1?j.indexOf('"
//        +"?'):j.length;m=j.substring(0,l);n=s.split(j,'/');o=n[2].toLowerCase"
//        +"();p=s.linkInternalFilters.toLowerCase();p=s.split(p,',');for(q=0;q"
//        +"<p.length;q++){r=o.indexOf(p[q])==-1?'':j;if(r)break;}}if(!r&&!k){t"
//        +"=j;u=v=o;w='Other Natural Referrers';x=s.seList+'>'+s._extraSearchE"
//        +"ngines;if(d==1){m=s.repl(m,'oogle','%');m=s.repl(m,'ahoo','^');j=s."
//        +"repl(j,'as_q','*');}y=s.split(x,'>');for(z=0;z<y.length;z++){A=y[z]"
//        +";A=s.split(A,'|');B=s.split(A[0],',');for(C=0;C<B.length;C++){D=m.i"
//        +"ndexOf(B[C]);if(D>-1){if(A[2])E=v=A[2];else E=o;if(d==1){E=s.repl(E"
//        +",'#',' - ');j=s.repl(j,'*','as_q');E=s.repl(E,'^','ahoo');E=s.repl("
//        +"E,'%','oogle');}F=s.split(A[1],',');for(G=0;G<F.length;G++){if(j.in"
//        +"dexOf(F[G]+'=')>-1||j.indexOf('https://www.google.')==0)H=1;I=s.get"
//        +"QueryParam(F[G],'',j).toLowerCase();if(H||I)break;}}if(H||I)break;}"
//        +"if(H||I)break;}}if(!r||g!='1'){r=s.getQueryParam(a,b);if(r){v=r;if("
//        +"E)w='Paid Search';else w='Unknown Paid Channel';}if(!r&&E){v=E;w='N"
//        +"atural Search';}}if(k==1&&!r&&i==1)t=u=v=w='Typed/Bookmarked';J=s._"
//        +"channelDomain;if(J&&o){K=s.split(J,'>');for(L=0;L<K.length;L++){M=s"
//        +".split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++){Q="
//        +"N[P].toLowerCase();R=o.indexOf(Q);if(R>-1){w=M[0];break;}}if(R>-1)b"
//        +"reak;}}J=s._channelParameter;if(J){K=s.split(J,'>');for(L=0;L<K.len"
//        +"gth;L++){M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0"
//        +";P<O;P++){R=s.getQueryParam(N[P]);if(R){w=M[0];break;}}if(R)break;}"
//        +"}J=s._channelPattern;if(J){K=s.split(J,'>');for(L=0;L<K.length;L++)"
//        +"{M=s.split(K[L],'|');N=s.split(M[1],',');O=N.length;for(P=0;P<O;P++"
//        +"){Q=N[P].toLowerCase();R=r.toLowerCase();S=R.indexOf(Q);if(S==0){w="
//        +"M[0];break;}}if(S==0)break;}}S=w?r+u+w+I:'';c=c?c:'c_m';if(c!='0')S"
//        +"=s.getValOnce(S,c,0);if(S){s._campaignID=r?r:'n/a';s._referrer=t?t:"
//        +"'n/a';s._referringDomain=u?u:'n/a';s._campaign=v?v:'n/a';s._channel"
//        +"=w?w:'n/a';s._partner=E?E:'n/a';s._keywords=H?I?I:'Keyword Unavaila"
//        +"ble':'n/a';if(f&&w!='Typed/Bookmarked'){h.setTime(h.getTime()+f*864"
//        +"00000);s.c_w('s_tbm'+f,1,h);}}");
//
//    /* Top 130 Search Engines - Grouped */
//    s.seList="google.,googlesyndication.com|q,as_q|Google>yahoo.com,yahoo"
//        +".co.jp|p,va|Yahoo!>bing.com|q|Bing>altavista.co,altavista.de|q,r|Al"
//        +"taVista>.aol.,suche.aolsvc.de|q,query|AOL>ask.jp,ask.co|q,ask|Ask>w"
//        +"ww.baidu.com|wd|Baidu>daum.net,search.daum.net|q|Daum>icqit.com|q|i"
//        +"cq>myway.com|searchfor|MyWay.com>naver.com,search.naver.com|query|N"
//        +"aver>netscape.com|query,search|Netscape Search>reference.com|q|Refe"
//        +"rence.com>seznam|w|Seznam.cz>abcsok.no|q|Startsiden>tiscali.it,www."
//        +"tiscali.co.uk|key,query|Tiscali>virgilio.it|qs|Virgilio>yandex|text"
//        +"|Yandex.ru>search.cnn.com|query|CNN Web Search>search.earthlink.net"
//        +"|q|Earthlink Search>search.comcast.net|q|Comcast Search>search.rr.c"
//        +"om|qs|RoadRunner Search>optimum.net|q|Optimum Search";
}