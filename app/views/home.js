var home={
    show:function(callback){
        $.get('themes/default/home.html',function(htmlData){
           $('#wrap').before(htmlData); 
           if(callback){
               callback();
           }
        });
    }
};