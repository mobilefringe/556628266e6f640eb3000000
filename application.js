$('document').ready(function() {
    if ($('#instafeed').length > 0) {
        var feed = new Instafeed({
            get: 'user',
            userId: '349157082',
            clientId: 'da5cf03899eb49a496424d9a76bafa0d',
            template: '<a href="{{link}}" target="_blank" title="{{caption_short}}"><div class="ig-image" style="background-image:url({{image}})"></div></a>',
            limit : 6,
            resolution:'low_resolution'
    
        });
    
        feed.run();
    }
});
// <a class="ig-image" target=_blank href="{{link}}" title="{{caption}}" ><img src="{{image}}" /></a>
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