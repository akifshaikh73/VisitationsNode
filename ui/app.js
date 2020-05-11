var visitation = $('#visitation');
var masjid_list = $('#masjid_list');
var allMasjids = []    ;

var hostname=location.hostname;
const wsport = 8081;

$(document).ready(
    ()=> {
        $.ajax({
            "url": "http://"+hostname+":"+wsport+"/visitations/metadata/",
            "type": "get",
            "dataType": "json",
            "success":response=>{
                console.log(response);
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
            $("<ul><a href=#units?masjid="+encodeURI(masjid.masjid)+">"+masjid.masjid+"</a></ul>").appendTo("#masjid_list");
        else
            if(masjid.masjid == filter)
                $("<ul><a href=#units?masjid="+encodeURI(masjid.masjid)+">"+masjid.masjid+"</a></ul>").appendTo("#masjid_list");

    });
}

function showUnits(masjidfilter) {
    $("#masjids").hide();
    $("#units").show();
    $("#areas").hide();
    $("#unit_list").html(``);
    if(masjidfilter == null)
        masjidfilter=encodeURI('Masjid Uthman');
    console.log(masjidfilter);
    var masjid = allMasjids.filter(m => m.masjid == decodeURI(masjidfilter));
    console.log(masjid);
    masjid[0].units.forEach(unit=>{
        $("<ul><a href=#areas?unit="+(masjidfilter)+":"+encodeURI(unit.name)+">"+masjid[0].masjid+"_"+unit.name+"</a></ul>").appendTo("#unit_list");
    });

}
function showAreas(filter) {
    var words = filter.split(":");
    const masjidfilter= decodeURI(words[0]);
    const unitfilter=decodeURI(words[1]);
    $("#masjids").hide();
    $("#units").hide();
    $("#areas").show();
    $("#area_list").html(``);
    
    var masjid = allMasjids.filter(masjid =>  masjid.masjid == masjidfilter);
    var unit = masjid[0].units.filter(unit => unit.name == unitfilter);
    unit[0].areas.forEach(area => {
        $("<ul><a href=#visitations?area="+encodeURI(masjidfilter)+":"+encodeURI(unitfilter)+":"+encodeURI(area)+">"+masjidfilter+":"+unitfilter+":"+area+"</a></ul>").appendTo("#area_list");
    });
}

function showVisitations(filter) {
    var words = filter.split(":");
    const masjidfilter= decodeURI(words[0]);
    const unitfilter=decodeURI(words[1]);
    const areafilter=decodeURI(words[2]);
    var visitations = [];
    $("#masjids").hide();
    $("#units").hide();
    $("#areas").show();
    $.ajax({
        "url": "http://"+hostname+":"+wsport+"/visitations/masjid/"+masjidfilter+"/unit/"+unitfilter+"/area/"+areafilter,

        "type": "get",
        "dataType": "json",
        "success":response=>{
            console.log(response);
            visitations = response;
            $("#master_list tr").remove(); 
            visitations.forEach(entry => {
                $("<tr><td>"+entry.FirstName+"</td><td>"+entry.Address+"</td>"+"</tr>").appendTo("#master_list");
            });
        },
        "error":error => {
            console.log(error);
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
        case '#visitations':
            showVisitations(query);
            break;
        case '':
            showLandingPage();
            break;
        default:
            pageNotFound();
            break;
    }
}
