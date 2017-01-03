var arrayDevice=[], aryHum=[], aryTemp=[], aryGas=[], aryLat=[], aryLong=[], markers=[],aryLoc=[],aryTstamp=[],userID=[],userDname=[],userName=[],userUname=[],userPname=[],userInfo=[],userEmail=[],userCnum=[],userGender=[],userDob=[],userAddress=[];
var ctx = document.getElementById("myChart");
var marker, i, vicon, mydate, myChart, directionsDisplay, directionsService, start = "", end = "", request, latlong, contentString;
var color = Chart.helpers.color;
var chartColors = window.chartColors;

$(document).ready(function()
{ 
	getDevices(); //Get Devices Info
	getDeviceStatus(); //Get Status from Dweet.io   
	getUserStatus();
    getChartData(); //Get and Display Chart Data
    document.getElementById("userFname").innerHTML = userName; 
    document.getElementById("userEmail").innerHTML = userEmail; 
    document.getElementById("userCnum").innerHTML = userCnum; 
    document.getElementById("userAddress").innerHTML = userAddress; 
});

//setInterval(function(){startRefresh()}, 10000); //Refresh all data every 10 seconds

function startRefresh(){// Start of startRefresh function
  arrayDevice=[];
  aryHum=[];
  aryTemp=[];
  aryGas=[];
  aryLat=[];
  aryLong=[];
  markers=[];
  aryTstamp=[];
  //document.getElementById("dEnd").value = "";
  clearMarkers()
  getDevices();
  getDeviceStatus();
  getChartData();
  addMarker();
}//End of startRefresh function

//Get Name of devices
function getDevices(){//Start of getDevices function
    $.ajax({
    type: "GET",
    url: "http://iligtas.ph/deviceapi/index.php",
    async: false,
      	success: function(deviceData){
          	for(var i=0; i<=deviceData.length-1; i++){
          		dvcId = deviceData[i].deviceid;
          		arrayDevice.push(deviceData[i].devicename);
          		aryLoc.push(deviceData[i].owneraddress);
          	}
      	}
    }); //end of ajax function
}//End of getDevices function

//Get Device Status
function getDeviceStatus(){//Start of getDeviceStatus function
    $.ajax({
        type: "GET",
        url: "https://dweet.io:443/get/dweets/for/gerrybarrontest1",
        async: false,
        success: function(myData){
          console.log(myData);
          for (var i=4; i>=0;  i--) {
            aryHum.push(myData.with[i].content.Humidity);
            aryTemp.push(myData.with[i].content.Temperature);
            aryGas.push(myData.with[i].content.Gas);
            aryLat.push(myData.with[i].content.Latitude);
            aryLong.push(myData.with[i].content.Longitude);
            mydate = new Date(myData.with[i].created);
            //aryTstamp.push(mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds());
            aryTstamp.push(mydate.getHours()+':'+mydate.getMinutes());
          };
        }
    }); //end of ajax function  
    //}//end of for loop
}//end of getDeviceStatus function

//Get Users Information
function getUserStatus(){//Start of getUserStatus function
    $.ajax({
      	type: "GET",
      	url: "http://localhost/firefinal/api.php",
      	async: false,
      	success: function(userData){
          	console.log(userData);
          	for(var i=0; i<=userData.length-1; i++){
		        userID.push(userData[i].userID);
		        userDname.push(userData[i].userDname);
		        userName.push(userData[i].userName);
		        userUname.push(userData[i].userUname);
		        userPname.push(userData[i].userPname);
		        userEmail.push(userData[i].userEmail);
		        userCnum.push(userData[i].userCnum);
		        userAddress.push(userData[i].userAddress);
		        userGender.push(userData[i].userGender);
		        userDob.push(userData[i].userDob);
		        arycount = userData.length;
        	}
      	}
    }); //end of ajax function
    console.log(arycount);
}//End of getUserStatus function

//Display chart data
function getChartData(){//Start of getChartData function
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: aryTstamp,
            datasets: [{
                label: 'Hum',
                data: aryHum,
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                borderWidth: 1,
                    fill: false
            },
            {
                label: 'Temp',
                data: aryTemp,
                backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
                borderColor: window.chartColors.green,
                borderWidth: 1,
                    fill: false
            },
            {
                label: 'Gas',
                data: aryGas,
                backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
                borderColor: window.chartColors.yellow,
                borderWidth: 1,
                    fill: false
            }]
        },
        options: {
            responsive:true,
            tooltips: {
                    mode: 'index',
                    intersect: false,
            },
            hover: {
                    mode: 'nearest',
                    intersect: true
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    display:true,
                }],
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }]
            }
        }
    });//end of myChart
}//End of getChartData function

//Initialize the Map
function initMap() {// Start of initMap function
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
            {name: 'Retro Map'});
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: dlocation,
        mapTypeId: 'terrain',
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
        },
        disableDefaultUI: true
    });
        
    map.mapTypes.set('styled_map', styledMapType);
    
    // Adds a marker at the center of the map.
    addMarkerFD(firedept);
    addMarker();
    
    map.setMapTypeId('styled_map');

    
}//end of initMap function

//Add Fire Department Marker
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
	    }
	    else if(aryHum[i]<=60 && aryTemp[i]<=30 && aryGas[i]<=50){
	        vicon = "img/alert-small-size.png";
	    }
	    else if(aryHum[i]<=60 && aryTemp[i]>=30 && aryGas[i]<=50){
	        vicon = "img/danger-small-size.png";
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
