fw.connector={
    request:function(msg, callback){
        console.log("%cREQUEST: "+JSON.stringify(msg) ,"background:black;color:orange;font-size:14px;");
        $.ajaxSetup({cache:false});
        $.ajax({
          type: "POST",
          url: "https://secure.1mk.org/rest/api/tictactoe/request?_="+Date.now(),
          data: msg,
          success: function(response){
              if(callback){
                callback(JSON.parse(response));
              }
          },
          error: function(){
              if(callback){
                callback(false);
              }
          },
          cache: false
        });
    },
    onMessage:function(cb){
        $.ajaxSetup({cache:false});
        $.ajax({ 
                url: "https://secure.1mk.org/rest/api/tictactoe/call", 
                success: function(data){
                    if(cb){
                        console.log("%cRESPONSE: "+JSON.stringify(data) ,"background:black;color:lightgreen;font-size:14px;");
                        cb(data);
                    }
                },
                error:function(){
                    cb(false);
                },
                dataType: "json",
                timeout: 3000000,
                cache: false
        });
    }
};  