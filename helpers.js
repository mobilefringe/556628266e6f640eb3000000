function show_dd(id){
        // console.log(this)
        if ($("#s_sub_"+id).is(":visible")){
            
            $("#triangle_"+id).hide();
            $(".submenu_bar").slideUp()
            $("#s_sub_"+id).hide();
            $("#m"+id).css({"background":"white", "color":"#4d4d4f"});
        } else {
            if ($(".submenu_bar").is(":visible")){
                $(".main_menu li").css({"background":"white", "color":"#4d4d4f"});
                $(".triangle_down").hide();
                $("#triangle_"+id).show();
                $(".dd_submenu").hide();
                $("#s_sub_"+id).show();
                $("#m"+id).css({"background":"#7b929d", "color":"white"});
            } else {
                $("#triangle_"+id).show();
                $("#s_sub_"+id).show();
                $(".submenu_bar").slideDown()
                $("#m"+id).css({"background":"#7b929d", "color":"white"});
                
            }
            
        }
    }
    
    function get_day(id){
        switch(id) {
            case 0:
                return ("Sunday")
                break;
            case 1:
                return ("Monday")
                break;
            case 2:
                return ("Tuesday")
                break;
            case 3:
                return ("Wednesday")
                break;
            case 4:
                return ("Thursday")
                break;
            case 5:
                return ("Friday")
                break;
            case 6:
                return ("Saturday")
                break;
        }
    }
    
    function convert_hour(d){
            var h = addZero(d.getUTCHours());
            var m = addZero(d.getUTCMinutes());
            var s = addZero(d.getUTCSeconds());
            if (h >= 12) {
                if ( h != 12) {
                    h = h - 12;    
                }
                
                i = "PM"
            } else {
                if (h == 0) {
                    h = 12
                }
                i = "AM"
            }
            
            return h+":"+m+" "+i;
        }
        
        
        
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    
    
    function check_email (){
        var email = $("#fieldEmail").val();
        if( !validateEmail(email)) {
            return false
        } else {
            return true
        }
    }
    
    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if( !emailReg.test( $email ) ) {
        return false;
      } else {
        return true;
      }
    }