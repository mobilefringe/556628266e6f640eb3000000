$('document').ready(function() {
    if ($('#instafeed').length > 0) {
        var feed = new Instafeed({
            get: 'user',
            userId: '349157082',
            clientId: 'da5cf03899eb49a496424d9a76bafa0d',
            template: '<a class="ig-image" target=_blank href="{{link}}" title="{{caption}}" ><img src="{{image}}" /></a>',
            limit : 6,
            resolution:'low_resolution'
        });
        feed.run();
    }
});

function renderStoreList(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each(collection, function(key, val) {
        if(type == "stores" || type == "category_stores"){
            if(!val.store_front_url_abs ||  val.store_front_url_abs.indexOf('missing.png') > -1 || val.store_front_url_abs.length === 0){
                val.store_front_url_abs = default_image.image_url;
            } 
            if(!val.store_front_alt_url_abs ||  val.store_front_alt_url_abs.indexOf('missing.png') > -1 || val.store_front_alt_url_abs.length === 0){
                val.hover_img = val.store_front_url_abs;    
            } else {
                val.hover_img = val.store_front_alt_url_abs;
            }
        }
        
        if(val.categories != null){
            val.cat_list = val.categories.join(',')
        }
        
        var current_initial = val.name[0];
        if(isInt(current_initial)){
            current_initial = "7";
        }
        
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial.toUpperCase();
            store_initial = current_initial;
        }
        
        if(val.is_coming_soon_store == true){
            val.coming_soon_store = "display: block";
        } else {
            val.coming_soon_store = "display:none";
        }
        
        if(val.is_new_store == true){
            val.new_store = "display: block";
        } else {
            val.new_store = "display: none";
        }
        
        if(val.phone != ""){
            val.phone_exist = "display: inline";
            if(val.phone.indexOf('ext') > -1) {
                val.phone = val.phone.split('ext')[0];
            }
        } else {
            val.phone_exist = "visibility: hidden";
        }
        
        if(val.total_published_promos != null){
            val.promotion_exist = "display: inline";
            val.promotion_list = val.total_published_promos;
        } else {
            val.promotion_exist = "display: none";
        }
        
        if (val.total_published_jobs != null){
            val.job_exist = "display: inline";
            val.job_list = val.total_published_jobs;
        } else {
            val.job_exist = "display: none";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        item_rendered.push(rendered);
    });

    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "property_details"){
        item_list.push(collection);
        collection = [];
        collection = item_list;
    }
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                case 0:
                    val.day = "Sunday";
                    break;
                case 1:
                    val.day = "Monday";
                    break;
                case 2:
                    val.day = "Tuesday";
                    break;
                case 3:
                    val.day = "Wednesday";
                    break;
                case 4:
                    val.day = "Thursday";
                    break;
                case 5:
                    val.day = "Friday";
                    break;
                case 6:
                    val.day = "Saturday";
                    break;
            }
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                var new_open = "";
                var new_close = "";
                if(open_time.format("mm") == "00") {
                    new_open =  open_time.format("ha");
                }
                else {
                    new_open =  open_time.format("h:mma");
                }
                if(close_time.format("mm") == "00") {
                    new_close =  close_time.format("ha");
                }
                else {
                    new_close =  close_time.format("h:mma");
                }
                // val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
                val.h =  new_open + " - " + new_close;
            } else {
                "Closed";
            }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("MMMM D");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    // val.h = open_time.format("h:mm A") + " - " + close_time.format("h:mm A");
                    var new_open = "";
                    var new_close = "";
                    if(open_time.format("mm") == "00") {
                        new_open =  open_time.format("ha");
                    }
                    else {
                        new_open =  open_time.format("h:mma");
                    }
                    if(close_time.format("mm") == "00") {
                        new_close =  close_time.format("ha");
                    }
                    else {
                        new_close =  close_time.format("h:mma");
                    }
                    // val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
                    val.h =  new_open + " - " + new_close;
                } else {
                    val.h = "Closed";
                }
                // if (val.h != "Closed"){
                    item_list.push(val);
                // }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "closed_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("dddd, MMM D, YYYY");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());   
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM";
                    }
                     if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM";
                    }
                    val.h = open_time.format("h:mm A") + " - " + close_time.format("h:mm A");
                } else {
                    val.h = "Closed";
                }
                if (val.h == "Closed"){
                    item_list.push(val);
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);

    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}


function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

function renderInstaFeed(container, template){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var feed_obj = {}
    Mustache.parse(template_html); 
    $.getJSON("https://baycentre.mallmaverick.com/api/v4/baycentre/social.json").done(function(data) {
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
            if (i<6){
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
        // val.day = get_day(val.day_of_week);
        // var d = new Date();
        // val.month = get_month(d.getMonth());
        // val.weekday = addZero(d.getDate());
        // if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
        //     var open_time = new Date (val.open_time);
        //     var close_time = new Date (val.close_time);
        //     val.open_time = convert_hour(open_time);
        //     val.close_time = convert_hour(close_time);    
        //     val.h = val.open_time+ " - " + val.close_time;
        // } else {
        //     val.h = "Closed";
        // }
        val.day = moment().format("ddd");
        var d = moment();
        val.month = moment().month();
        val.weekday = moment().date();
        
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());
            val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderMapPDF(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
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

function getSearchResults(search_string,max_results,trim_description_length){
    var search_results = {};
    var all_stores = getStoresList();
    var store_ids = [];
    var stores =[];
    var count = 0;
    $.each( all_stores , function( key, val ) {
        localizeObject(val);
        if(store_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                stores.push(val);
                store_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(store_ids.indexOf(val.id) == -1){
            var tags_string = "";
            if(val.tags != null){
                tags_string = val.tags.join();
            }
            var keywords_string = "";
            if(val.keywords != null){
                keywords_string  = val.keywords.join();
            }

            if((tags_string.toLowerCase().indexOf(search_string.toLowerCase()) > -1 || keywords_string.toLowerCase().indexOf(search_string.toLowerCase()) > -1)){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                stores.push(val);
                store_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['stores'] = stores;
    if(stores.length === 0){
        search_results['stores_header_style'] = "display:none";
    }
    
    //we only want to keep checking promos, events or jobs descriptions if there is more that 2 search string characters, otherwise too many results
    if(count >= max_results || search_string.length < 3){
        search_results['summary'] = {"count":count};
        search_results['promotions_header_style'] = "display:none";
        search_results['events_header_style'] = "display:none";
        search_results['jobs_header_style'] = "display:none";
        return search_results;
    }
    
    var all_promotions = getPromotionsList();
    var promotion_ids = [];
    var promotions =[];
    $.each( all_promotions , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(promotion_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                promotions.push(val);
                promotion_ids.push(val.id);
                count++;
                added = true;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                promotions.push(val);
                promotion_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['promotions'] = promotions;
    if(promotions.length === 0){
        search_results['promotions_header_style'] = "display:none";
    }
    
    var all_events = getEventsList();
    var event_ids = [];
    var events =[];
    $.each( all_events , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(event_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                events.push(val);
                event_ids.push(val.id);
                added = true;
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                events.push(val);
                event_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['events'] = events;
    if(events.length === 0){
        search_results['events_header_style'] = "display:none";
    }
    
    var all_jobs = getJobsList();
    var job_ids = [];
    var jobs =[];
    $.each( all_jobs , function( key, val ) {
        localizeObject(val);
        var added = false;
        if(job_ids.indexOf(val.id) == -1){
            if(val.name.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                jobs.push(val);
                job_ids.push(val.id);
                added = true;
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
        if(!added){
            if(val.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1){
                val.description_trim = val.description.substring(0, trim_description_length) + "..";
                jobs.push(val);
                job_ids.push(val.id);
                count++;
            }
            if(count >= max_results){
                return false;
            }
        }
    });
    search_results['jobs'] = jobs;
    if(jobs.length === 0){
        search_results['jobs_header_style'] = "display:none";
    }
    
    search_results['summary'] = {"count":count};
    
    return search_results;
}