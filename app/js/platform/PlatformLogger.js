var console = window.console;
if(navigator.userAgent.match('Maple')){
	console.log = function(msg){
		alert(msg);
	};
}	


var platformLogger = 
{
		log:function(msg){
		   if(config.debug){
            console.log(msg);              
		   }
		}
};		