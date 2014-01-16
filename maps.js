var data = {};

var default_coords = new google.maps.LatLng(52.3722499, 4.907800400000042);
var zoom_level = 3;
var map = null;

var info_box_template = "";
var active_info_window = null;

function initInfoBoxTemplate() {
	$.get("infobox.hbs").done(function(text) {
		info_box_template = text;
	});
}

function initMap() {
	var mapOptions = {
		center: default_coords,
		zoom: zoom_level
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);	
}

function getData() {
	$.getJSON("data.json").done(function(json) {
		data = json;
		placeMarkers();
	}).fail(function() {
		alert("Could not fetch the data!");
	});
}

function placeMarkers() {
	$.each(data, function(index, project) {
		placeMarker(project);
	});
}

function placeMarker(project){
	
	var template = Handlebars.compile(info_box_template);
	var html    = template(project);

	var info_window = new google.maps.InfoWindow({
		content: html
	});

	var latLng = new google.maps.LatLng(project.lat, project.lng);
	
	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		title: project.name,
		icon: "marker.png"
	});
	
	google.maps.event.addListener(marker, 'click', function() {
		if (active_info_window) {
			active_info_window.close();
		}
		info_window.open(map, marker);
		active_info_window = info_window;
	});
}

function initialize() {
	initInfoBoxTemplate();
	initMap();
	getData()
}

$(window).load(initialize);
