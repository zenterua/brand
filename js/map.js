jQuery(function($) {

	var maps = [];

        
	var styles = [
		[{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
	];

	function Map(id, mapOptions){
		this.map = new google.maps.Map(document.getElementById(id), mapOptions);
		this.markers = [];
		this.infowindows = [];
	}

	function addMarker(mapId,location,index,contentstr,image){
        maps[mapId].markers[index] = new google.maps.Marker({
            position: location,
            map: maps[mapId].map,
			icon: {
				url: image
			}
        });

		maps[mapId].infowindows[index] = new google.maps.InfoWindow({
			content:contentstr
		});
		
		google.maps.InfoWindow.prototype.opened = true;
		google.maps.event.addListener(maps[mapId].markers[index], 'click', function() {

			if(infoWindow.opened){
			   infoWindow.opened = false;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
			else{
			   maps[mapId].infowindows[0].close();
			   infoWindow.opened = true;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
		});

		google.maps.InfoWindow.prototype.opened = false;
		infoWindow = new google.maps.InfoWindow();


    }

	function initialize(mapInst) {

		var lat = mapInst.attr("data-lat"),
			lng = mapInst.attr("data-lng"),
			newLat,
			newLang,
			myLatlng = new google.maps.LatLng(lat,lng),
			setZoom = parseInt(mapInst.attr("data-zoom")),
			mapId = mapInst.attr('id');

		var mapStyle = styles[parseInt(mapInst.data('style'),10)];
		var styledMap = new google.maps.StyledMapType(mapStyle,{name: "styledmap"});

		var mapOptions = {
			zoom: setZoom,
			disableDefaultUI: true,
			scrollwheel: false,
			zoomControl: true,
			streetViewControl: true,
			center: myLatlng
		};

		maps[mapId] = new Map(mapId, mapOptions);

		maps[mapId].map.mapTypes.set('map_style', styledMap);
  		maps[mapId].map.setMapTypeId('map_style');

		var i = 0;

		$('.marker[data-rel="'+mapId+'"]').each(function(){
			var loc = new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),
				text = $(this).data('string'),
				image = $(this).data('image');
			$(this).data('i', i).data('map',mapId);
			addMarker(mapId,loc,i,text,image);
			i++;
		});

		// Change map location
		$(".city1").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
		$(".city2").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
	 
	}

	$(window).load(function(){

		$('#map-locations').each(function(){
			initialize($(this));
		});

		var tempInfowindow;

		$('.marker').on('click', function(){
			var thisMapId = $(this).data('map'),
				thisIndex = $(this).data('i');
			if(tempInfowindow) tempInfowindow.close();
			tempInfowindow = maps[thisMapId].infowindows[thisIndex];
			maps[thisMapId].infowindows[thisIndex].open(maps[thisMapId].map, maps[thisMapId].markers[thisIndex]);
			maps[thisMapId].map.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lng')));

		});

	});

});