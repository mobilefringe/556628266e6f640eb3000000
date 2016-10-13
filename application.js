$('document').ready(function() {
    if ($('#instafeed').length > 0) {
        var feed = new Instafeed({
            get: 'user',
            userId: '349157082',
            clientId: 'da5cf03899eb49a496424d9a76bafa0d',
            template: '<a class="ig-image" target=_blank href="{{link}}" title="{{caption}}" ><img src="{{image}}" /></a>',
            limit : 5,
            resolution:'low_resolution'
    
        });
    
        feed.run();
    }
});

function renderInstaFeed(container, template){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var feed_obj = {}
    Mustache.parse(template_html); 
    $.getJSON("https://baycentre.mallmaverick.com/api/v2/baycentre/social.json").done(function(data) {
        var insta_feed = data.social.instagram
        $.each(insta_feed, function(i,v){
            if(v.caption != null){
                feed_obj.caption = v.caption.text
            }
            else{
                feed_obj.caption = ""
            }
            feed_obj.image = v.images.low_resolution.url
            feed_obj.link = v.link
            if (i<5){
                var ig_rendered = Mustache.render(template_html,feed_obj);
                item_rendered.push(ig_rendered.trim());
            }
        })
        $(container).show();
        $(container).html(item_rendered.join(''));
    });
}

function send_ga_event(name){
    ga('send', 'event', 'button', 'click', name, 1);
}


function mailchimp_subscribe(email){
    $("#mce-EMAIL").val($('#popup_email').val())
    $.ajax({
        type: $("#mc-embedded-subscribe-form-pop").attr('method'),
        url: $("#mc-embedded-subscribe-form-pop").attr('action'),
        data: $("#mc-embedded-subscribe-form-pop").serialize(),
        cache       : false,
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        error       : function(err) { alert("Could not connect to the registration server. Please try again later.") },
        success     : function(data) {
        }
    })
}

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        val.day = get_day(val.day_of_week);
        var d = moment();
        val.month = get_month(d.getMonth());
        val.weekday = addZero(d.getDate());
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = in_my_time_zone(moment(val.open_time), "h:mmA");
            var close_time = in_my_time_zone(moment(val.close_time), "h:mmA");
            // val.open_time = convert_hour(open_time);
            // val.close_time = convert_hour(close_time);    
            val.h = open_time + " - " + close_time;
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function get_day(id){
    switch(id) {
        case 0:
            return ("Sunday");
            break;
        case 1:
            return ("Monday");
            break;
        case 2:
            return ("Tuesday");
            break;
        case 3:
            return ("Wednesday");
            break;
        case 4:
            return ("Thursday");
            break;
        case 5:
            return ("Friday");
            break;
        case 6:
            return ("Saturday");
            break;
    }
}


function convert_hour(d){
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "pm"
    } else {
        i = "am"
    }
    return h+":"+m+i;
}



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function get_month (id){
    var month = "";
    switch(id) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "Jun";
            break;
        case 6:
            month = "Jul";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
            
    }
    return month;
}