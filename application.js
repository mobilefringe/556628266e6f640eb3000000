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

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        val.day = get_day(val.day_of_week);
        var d = new Date();
        val.month = get_month(d.getMonth());
        val.weekday = addZero(d.getDate());
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = new Date (val.open_time);
            var close_time = new Date (val.close_time);
            val.open_time = convert_hour(open_time);
            val.close_time = convert_hour(close_time);    
            val.h = val.open_time+ " - " + val.close_time;
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}