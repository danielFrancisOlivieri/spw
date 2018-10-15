var locationNumber = -1; // helps cycle through locations
var locations = 20; // array of all points
var numberOfPoints = 19;
var pointsLayer; // holds the layer for the points so we can open the info windows programattically


$(document).click(function(event) {
    var className = $(event.target).attr('class');;
    console.log(className);
});

// set info modal to display correctly
function setModal(glossaryEntryObject) {

console.log(glossaryEntryObject);

  //set header to name of the entry
  $( ".modalHeader" ).text(glossaryEntryObject.name);

  // sets quote
  $( ".quote" ).text(glossaryEntryObject.quote);

  // sets quote
  $( ".citation" ).text(glossaryEntryObject.citation);

  //set description to the appropriate description
  $( ".short" ).text(glossaryEntryObject.short);

  //set description to the appropriate description
  $( ".long" ).text(glossaryEntryObject.long);

  //set anecdote to the appropriate description
  $( ".anecdote" ).text(glossaryEntryObject.anecdote);

  //set reference to the appropriate description
  $( ".reference" ).text(glossaryEntryObject.reference);

  //set reference to the appropriate description
  $( ".reference" ).attr("href", glossaryEntryObject.url);

  // set image to correct image
  var source = "images/" + glossaryEntryObject.image;
  $(".modalImage").attr("src", source);
}

function openGlossaryModal(glossaryEntryObject) {
  // I want to set modal inside this function so that you don't
  // switch the content of the modal just by rolling over different figures
  setModal(glossaryEntryObject);

  // trigger modal
  $('.ui.modal.glossary').modal('show');

}

function openInfoModal(glossaryEntryObject) {
//  setModal(glossaryEntryObject);

  // trigger modal
  $('.ui.modal.info').modal('show');

}

// toggles info modal, mostly used to close it with top right close icon
function toggleInfoModal(){
  $('.ui.modal.info').modal('toggle');

}


$.getJSON("data/points.json", function(json) {

    console.log("punic points coming in");
    createPlaceArray(json);
});


// callback function for the getJSON that gets the json data
function createPlaceArray(json) {

    locations = json;

}

// callback function that sets the layer into pointsLayer
function setPointsLayer(layerFromLayerArray) {
    pointsLayer = layerFromLayerArray;

}


// Choose center and zoom level
var options = {
    center: [36.8529, 10.3217], // Saguntum 39.6799° N, 0.2784° W
    zoom: 5
}

// Instantiate map on specified DOM element
var map_object = new L.Map(map, options);


window.onload = function() {


    // trigger modal
    $('.ui.basic.modal.start').modal('show');


    // tabs
    $('.top.menu .item').tab();

    // Add a basemap to the map object just created
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
    }).addTo(map_object);

    var vizjson = 'https://olivierid.carto.com/api/v2/viz/39700a42-a611-4a19-855a-5f77b220dd9c/viz.json';
    cartodb.createLayer(map_object, vizjson).addTo(map_object).done(function(layers) {
        // layer 0 is the base layer, layer 1 is cartodb layer

    }).on('featureClick', function(e, latlng, pos, data, layer) {
  console.log("mouse clicked polygon with data: " + data);
  });


//sidebar
var sidebar = L.control.sidebar({ container: 'sidebar' })
            .addTo(map)
            .open('home');
}


// when span link is clicked switch to figures tab
$('.ui.button')
    .on('click', function() {
        // programmatically activating tab
        $.tab('change tab', 'tab-name');
    });


// takes us to Philly
// used in case of an error
// because it's always sunny in Philadelphia

zoomToPhiladelphia = function() {

    map_object.setView([41.9028, 75.1652], 7);
    console.log("City of Brotherly love");

}

// takes us to Rome
// used in case of an error
// because it's always a good idea to go to Rome when things aren't working out

zoomToRome = function() {

    map_object.setView([39.9526, 12.4964], 7);
    console.log("the Eternal city");

}

function displayOrRemoveButtons(locationValue) {

    if (locationValue <= 0) {

    }

}

// checks if it already has a hidden class on it
function hasCertainClass(classToCheckFor, elementId) {
    var classList = $('#' + elementId).attr('class').split(/\s+/); // gets classes
    $.each(classList, function(index, item) {
        if (item === classToCheckFor) {
            //do something
            return true;
        }
    });
    return false;
}

// triggers on the next button
// first runs the navigate forward to move to the next location
// then opens the appropriate popup at the new location
function next() {
    locationNumber++; // increment so it will be the next place next time

    console.log("next " + locationNumber);

    navigateLocationsForward();


    var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

    var title = locations[locationNumber].title;
    var text = locations[locationNumber].text;
    var year = locations[locationNumber].year;
    var citation = locations[locationNumber].source;
    var link = locations[locationNumber].link;

  //  year = year * -1;
    year = year + " BCE";

    $(".date").text(year);

    //popup options
    var popupOptions = {
        maxWidth: 300,
        maxHeight: 300,
        autoPan: false,
        keepInView: false
    }


   // holds the html for the link
fullLink = "<a class='citationLink' href='" + link + "' target='_blank'>" + citation + "</a>";

console.log(fullLink);

    map_object.openPopup("<h3><center>" + title + "</center></h3>" + "<p class='popupText'>" + text + "<br>" + fullLink + "</p>", latlng, popupOptions);

}

function previous() {

    locationNumber -= 1; // decrement so it will be the next place next time

    console.log("previous " + locationNumber);
    navigateLocationsBackward();


    var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

    var title = locations[locationNumber].title;
    var text = locations[locationNumber].text;
    var year = locations[locationNumber].year;
    var citation = locations[locationNumber].source;
    var link = locations[locationNumber].link;

  //  year = year * -1;
    year = year + " BCE";

    $(".date").text(year);

    //popup options
    var popupOptions = {
        maxWidth: 300,
        maxHeight: 300,
        autoPan: false,
        keepInView: false
    }

   // holds the html for the link
   fullLink = "<a class='citationLink' href='" + link + "' target='_blank'>" + citation + "</a>";

    map_object.openPopup("<h3><center>" + title + "</center></h3>" + "<p class='popupText'>" + text + "</p>" + fullLink, latlng, popupOptions);


}

// for when they click the next button
// tries to cycle through the places given to it by the json object
function navigateLocationsForward() {



    // if we don't have data from locations, just go to Rome
    if (locations == null) {
        zoomToRome();
    } else {


        if (locationNumber >= locations.length) {
            // do nothing
        } else {

            // makes the back button visible as soon as there is a previous point to return to
            if (locationNumber >= 0) {

                $("#forwardText").text("Next");
            }
            if (locationNumber === 1) {
                $("#back").removeClass("hidden");
            }
            if (locationNumber === 23) {
                $("#forward").addClass("hidden");
            }


            $('.progress')
                .progress('increment');


            let latitude = locations[locationNumber].latitude;
            let longitude = locations[locationNumber].longitude;


            //map_object.setView([latitude, longitude], 7);
            map_object.panTo([latitude, longitude], 7);

            // this takes you back to the beginning once you've finished


        }
    }

}


// for when they click the back button
// tries to cycle backwards through the places given to it by the json object
function navigateLocationsBackward() {
    // if we don't have data from locations, just go to Rome
    if (locations == null) {
        zoomToRome();
    } else {

        if (locationNumber === 0) {

            // change next button to say "start" instead
            $("#forwardText").text("Start");

            // f() checks if there is already a hidden class on it
            // if there isn't we can add that class to the back button
            var className = "hidden",
                elementId = "back";

            var whetherClassIsPresent = hasCertainClass(className, elementId);

            console.log("present " + whetherClassIsPresent);

            if (whetherClassIsPresent === false) {
                $("#back").addClass("hidden");
            }
        }

        if (locationNumber === 11) {
            $("#forward").removeClass("hidden");
        }
        // decrement progress bar
        $('.progress')
            .progress('decrement');

        let latitude = locations[locationNumber].latitude;
        let longitude = locations[locationNumber].longitude;

        //  map_object.setView([latitude, longitude], 7);
        map_object.panTo([latitude, longitude], 7);
    }


}


// share to facebook

console.log(numberOfPoints);

// initialize progress bar
$('.progress').progress({
    total: numberOfPoints,
});

// tabs
$('.top.menu .item').tab();

$('.forMap').popup({
    on: 'hover'
});

//for titles (likely just for testing)
$('h3').popup({
    on: 'hover'
});

// to toggle the sidebar
$('.ui.sidebar').sidebar('toggle');

// make accordians functional
$('.ui.accordion').accordion();
