var vLat=0, vLong=0, map;
var arrayDevice=[], aryHum=[], aryTemp=[], aryGas=[], aryLat=[], aryLong=[], markers=[],aryLoc=[];
var marker, i, vicon;
var directionsDisplay, directionsService;
var start = "";
var end = "";
var request;
var latlong;
var contentString;
$(document).ready(function()
{
    //vLat =aryLat[0]; vLong =aryLong[0];
    
   
    getDevices(); //use to get Devices from API
    getDeviceStatus(); //use to get Status of devices from dweet.io
    //start = aryLat[0]+", "+aryLong[0];
    //document.getElementById("dStart").value = start;
   //startRefresh();
    //console.log(start);
});

function startRefresh(){
  arrayDevice=[];
  aryHum=[];
  aryTemp=[];
  aryGas=[];
  aryLat=[];
  aryLong=[];
  markers=[];
  //document.getElementById("dEnd").value = "";
  clearMarkers()
  getDevices();
  getDeviceStatus();
  addMarker();
}  


//setInterval(function(){startRefresh()}, 10000);

function getDeviceStatus(){
    //var ndevice = arrayDevice.length;
    //for(var i=0; i<=arrayDevice.length-1; i++){
      $.ajax({
        type: "GET",
        url: "https://dweet.io:443/get/latest/dweet/for/gerrybarrontest1",
        async: false,
        success: function(myData){
          //console.log(myData);
          aryHum.push(myData.with[0].content.Humidity);
          aryTemp.push(myData.with[0].content.Temperature);
          aryGas.push(myData.with[0].content.Gas);
          aryLat.push(myData.with[0].content.Latitude);
          aryLong.push(myData.with[0].content.Longitude);
        }
      }); //end of ajax function  
    //}//end of for loop
}

//Get status of devices
function getDevices(){
      $.ajax({
      type: "GET",
      url: "http://iligtas.ph/deviceapi/index.php",
      async: false,
      success: function(deviceData){
          //console.log(deviceData);
          for(var i=0; i<=deviceData.length-1; i++){
          dvcId = deviceData[i].deviceid;
          arrayDevice.push(deviceData[i].devicename);
          aryLoc.push(deviceData[i].owneraddress);
          }

      }
    }); //end of ajax function
}

function initMap() {
    var firedept = {lat: 14.818181, lng: 120.283168}; 
    var dlocation = {lat: aryLat[0], lng: aryLong[0]};
    var styledMapType = new google.maps.StyledMapType(
            [
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ],
            {name: 'Styled Map'});
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: dlocation,
        mapTypeId: 'terrain',
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
        }
    });
    //map.setTilt(45);
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    
    map.mapTypes.set('styled_map', styledMapType);
    addMarkerFD(firedept);
    addMarker();
    
    map.setMapTypeId('styled_map');

    // Adds a marker at the center of the map.
}//end of initMap

 function addMarkerFD(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: "img/fs-small-size.png"
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
  for(i=0; i<arrayDevice.length; i++){
    if (aryHum[i]>=60 && aryTemp[i]<=30 && aryGas[i]<=50) {
          vicon = "img/normal-small-size.png";
          //directionsDisplay.setMap(null);
      }
      else if(aryHum[i]<=60 && aryTemp[i]<=30 && aryGas[i]<=50){
          vicon = "img/alert-small-size.png";
      }
      else if(aryHum[i]<=60 && aryTemp[i]>=30 && aryGas[i]<=50){
          vicon = "img/danger-small-size.png";
   
            //document.getElementById("dEnd").value = '14.818181, 120.283168';
            //directionsDisplay.setMap(map);
            //setDirection();
            //document.getElementById("mHead").innerHTML = "Fire threat in " + aryLoc[i];
            //directionsDisplay.setPanel(document.getElementById('panel'));
            //$("#trigmode").trigger("click");
      }

    var marker = new google.maps.Marker({
          position: new google.maps.LatLng(aryLat[i],aryLong[i]),
          map: map,
          icon:vicon  
      });
      markers.push(marker); 

      var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

      marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
  }
    
}//end of addMarkers

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function setDirection(){
    calculateAndDisplayRoute(directionsService, directionsDisplay);  
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('dStart').value,
        destination: document.getElementById('dEnd').value,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
}

contentString= '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';
//contentString = '<div id="humidity" style="width:200px;height:200px; margin-left: auto;margin-right: auto;">'+'</div>';