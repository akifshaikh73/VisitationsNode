var visitation = $('#visitation');
var masjid_list = $('#masjid_list');

$(document).ready(
    ()=> {
        $.ajax({
            "url": "http://localhost:8080/visitations/metadata/",
            "type": "get",
            "dataType": "json",
            "success":response=>{
                console.log(response);
                //allMasjids = JSON.parse(response);
                allMasjids = response;
            },
            "error":error => {
                console.log(error);
            }
        });

        visitation = $('#visitation');
        console.log("vis:"+visitation.innerHTML);
        console.log(visitation.innerHTML);
        console.log(window.location.hash);
        router(window.location.hash);
});    

$(window).on('hashchange',()=>{
    console.log("route:"+window.location.hash);
    router(window.location.hash);
});

function toggle(element) {
    if(element.hidden == false)
        element.hide();
    else    
        element.show();
}

function showMasjids(filter) {
    $("#masjids").show();
    $("#units").hide();
    $("#areas").hide();
    //toggle($("#units"));
    console.log("showMasjids:");
    $('#masjid_list').html('');
    allMasjids.forEach(masjid => {
        if(filter == null)
            $("<ul><a href=#units?masjid="+encodeURI(masjid.masjid)+">"+masjid.masjid+",unit="+masjid.unit+"</a></ul>").appendTo("#masjid_list");
        else
            if(masjid.masjid == filter)
                $("<ul><a href=#units?masjid="+encodeURI(masjid.masjid)+">"+masjid.masjid+",unit="+masjid.unit+"</a></ul>").appendTo("#masjid_list");

    });
}

function showUnits(masjidfilter) {
    $("#masjids").hide();
    $("#units").show();
    $("#areas").hide();
    $("#unit_list").html(``);
    if(masjidfilter == null)
        masjidfilter='Masjid Uthman';
    allMasjids.forEach(masjid => {
        if(masjid.masjid == decodeURI(masjidfilter))
            $("<ul><a href=#areas?unit="+masjidfilter+":"+masjid.unit+">"+masjid.masjid+"_"+masjid.unit+"</a></ul>").appendTo("#unit_list");
    });

}
function showAreas(filter) {
    var words = filter.split(":");
    const masjidfilter= words[0];
    const unitfilter=words[1];
    $("#masjids").hide();
    $("#units").hide();
    $("#areas").show();
    $("#area_list").html(``);
    allMasjids.forEach(masjid => {
        if(masjid.masjid == decodeURI(masjidfilter) && masjid.unit == unitfilter) {
            masjid.areas.forEach(area => {
                $("<ul><a href=#visitations?area="+encodeURI(area)+">"+decodeURI(masjidfilter)+":"+unitfilter+":"+area+"</a></ul>").appendTo("#area_list");
            });

        }
    });

}

function pageNotFound() {
    visitation.html( `<b> Couldn't find the page </b>`);
}

function showLandingPage() {
    $("#units").hide();
    $("#masjids").hide();
    $("#areas").hide();
}
function router(hash) {
    console.log("router:"+hash);
    var uri_words = hash.split('?');
    var query=null;
    if (uri_words.length > 1) {
        query = uri_words[1];
        if(query.indexOf('=') >0)
            query=query.split('=')[1];
    }
    switch(uri_words[0]) {
        case '#masjids':
            showMasjids(query);
            break;
        case '#units':
            showUnits(query);
            break;
        case '#areas':
            showAreas(query);
            break;
        case '':
            showLandingPage();
            break;
        default:
            pageNotFound();
            break;
    }
}
