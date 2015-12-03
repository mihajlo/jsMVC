fw.config={
    
    //START CONFIG LOADING LIBRARIES
    libs:[
        
        //Load jQuery library
        {
            src:window.location.protocol+'//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
            callback:function(){
                fw.lib.jQuery=jQuery;
                fw.jQuery=jQuery;
            }
        },
        //Load webcam lib
        /*how to use:
         * 
         * var kamera=fw.lib.webcam.init('#fw',320,240);
         * var picture_content=fw.lib.webcam.picture(kamera);
         * picture_content has base64 content of image
         */
        {
            src:'system/libs/webcam.js',
            callback:function(){
                fw.lib.webcam=webcam;
                fw.webcam=webcam;
                webcam=null;
            }
        },
        {
            src:'//connect.facebook.net/en_US/sdk.js',
            callback:function(){
                
            }
        }
        
    ],
    //END CONFIG LOADING LIBRARIES
    
    //START CONFIG LOADING HELPERS
    helpers:[
        
        //phpjs helper for easy getting parametars from url
        {
            name:'$_GET',
            global:true
        }
    ],
    //END CONFIG LOADING HELPERS
    
    //START CONFIG LOADING models
    models:[
        'settings'
    ],
    //END CONFIG LOADING models
    
    //LOAD default controller
    default_controller:'home',
    //run default method from default controller
    ready_method:'run()'
    
    
};