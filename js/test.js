var vLat=0, vLong=0, map;
var arrayDevice=[], aryHum=[], aryTemp=[], aryGas=[], aryLat=[], aryLong=[], markers=[],aryLoc=[],aryTstamp=[];
var ctx = document.getElementById("myChart");
var ctx2 = document.getElementById("myChart2");
var marker, i, vicon, mydate, myChart, myChart2, directionsDisplay, directionsService, start = "", end = "", request, latlong, contentString;
var color = Chart.helpers.color;
var chartColors = window.chartColors;
var shwdvcstatus="";
var idd = getUrlParameter('usrID');
var valpass;
//var contentString;
var counter = 1;
var homenamestatus,usrzip,usrTemp,userWdecs,userWicon, userGicon;


function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown(e) {
  e.preventDefault();
}

$(document).ready(function()
{   
    //for Home
    //$.getJSON("server/view.php?uID="+idd, function(result){
    $.getJSON("http://www.grand-pillar.com/uploads/fire/view.php?uID="+idd, function(result){
        //$.each(result, function(i, field){
            homenamestatus = result.fld_homename;
            $("#txtChange").text(result.fld_homename);
            $("#h-name").text(result.fld_homename);
            $("#h-address").text(result.fld_zipcode+" "+result.fld_city);
            $("#h-nname").val(result.fld_homename);
            $("#address").val(result.fld_address);
            $("#province").val(result.fld_province);
            $("#city").val(result.fld_city);
            $("#zipcode").val(result.fld_zipcode);
            $("#hddnval").val(idd);
            usrzip = result.fld_zipcode;
            console.log(result);
        //});
    });

    //for Users
    //$.getJSON("server/view.php?uID2="+idd, function(result){
    $.getJSON("http://www.grand-pillar.com/uploads/fire/view.php?uID2="+idd, function(result){
            $("#uemail").text(result.fld_email);
            $("#u-email").text(result.fld_email);
            $("#u-name").text(result.fld_name);
            valpass = result.fld_password;
            //$('#stu_pic').attr('src', "http://www.grand-pillar.com/uploads/fire/img/"+result.fld_pic);
            //$('#user_pic').attr('src', "http://www.grand-pillar.com/uploads/fire/img/"+result.fld_pic);
            //if (result.fld_pic == null || result.fld_pic == ""){
              //  $('#stu_pic').attr('src', "img/user-add.png");
                //$('#user_pic').attr('src', "img/user-add.png");
            //}
    });

    //for Contacts
    //$.getJSON("server/view.php?uCon="+idd, function(result){
    $.getJSON("http://www.grand-pillar.com/uploads/fire/view.php?uCon="+idd, function(result){
            for (var i = 0; i<=result.length - 1; i++) {
                $("#contactAppend").append("<li><div class='collapsible-header'><a href='tel:"+result[i].fld_cnum+"'>"+result[i].fld_cname+" "+result[i].fld_cnum+"</a></div></li>");
                //$("#c-contact").text(result.fld_cname+" "+result.fld_cnum);
                //var a = document.getElementById('c-contact');
                //var cnum = result.fld_cnum;
                //if (a) {
                    //a.href = "tel:"+cnum;
                //}
            }
    });

    //for Family
    //$.getJSON("server/view.php?uFam="+idd, function(result){
    $.getJSON("http://www.grand-pillar.com/uploads/fire/view.php?uFam="+idd, function(result){
           console.log(result)
        for (var i = 0; i<=result.length - 1; i++) {
            $("#parentDiv").append("<li id='removethis'><div class='collapsible-header'>"+result[i].fld_fmname
                +"<span class='badge grey-text text-lighten-1 hide-on-xsmall-only'>"+result[i].fld_femail+"</span></div></li>");
            //<div class='collapsible-body'><div class='row'><div class='col s12'><a id='removeIt' class='red btn block waves-effect waves-light'><i class='fa fa-times right red-text' aria-hidden='true'></i></a></div></div></div>
        };
    });
    getDevices();
    getDeviceName();
    getDeviceStatus(); //Get Status from Dweet.io   
    //getUserStatus();
    getChartData(); //Get and Display Chart Data
    tabledata();
    getWeatherUpdate();
    showDeviceStatus();

});
setInterval(function(){startRefresh()}, 30000);
function startRefresh(){
    aryHum=[];
    aryTemp=[];
    aryGas=[];
    aryTstamp=[];
    aryLat=[];
  aryLong=[];
  markers=[];
   clearMarkers();
    $('#thisTable tbody').html('');
    getDeviceStatus();   
    getChartData();
    tabledata();
    showDeviceStatus();
    addMarker();
}

function tabledata(){
    for (i = 0; i < aryHum.length; i++) { 
      $("#weather_report").append('<tr><td>'+aryHum[i]+'%'+'</td><td>'+aryTemp[i]+'°C'+'</td><td>'+aryGas[i]+'</td><td>'+aryTstamp[i]+'</td></tr>');
    }
}
//function myFunction() {
  //  var item = document.getElementById("removethis"+counter);
    //var aux=item.parentNode;
   // aux.removeChild(item);
   // console.log(item);
//}

setInterval(function(){
  $('#txtChange').fadeOut(500, function() {
        var $this = $(this);
        $this.text($this.text() == homenamestatus ? usrTemp+'°C '+userWdecs : homenamestatus);        
        $this.toggleClass('first second');        
        $this.fadeIn(500);
    });
}, 3000);


function getWeatherUpdate(){
    $.ajax({
        type: "GET",
        //url: "http://api.openweathermap.org/data/2.5/weather?zip="+usrzip+",ph&units=metric&appid=ec11da8b21d69761a2f7c9d1beec865f",
        url: "http://api.openweathermap.org/data/2.5/weather?zip=2200,ph&units=metric&appid=ec11da8b21d69761a2f7c9d1beec865f",
        async: false,
        success: function(myData){
          console.log(myData);
          userWdecs = myData.weather[0].description;
          userWicon = myData.weather[0].icon;
          $('#weather-logo').attr('src', "http://openweathermap.org/img/w/"+userWicon+".png");
          usrTemp = myData.main.temp;

          console.log(usrzip);
        }
    }); //end of ajax function 
}
function getDevices(){
      $.ajax({
      type: "GET",
      url: "http://www.grand-pillar.com/uploads/fire/api.php",
      async: false,
      success: function(deviceData){
          //console.log(deviceData);
          for(var i=0; i<=deviceData.length-1; i++){
          dvcId = deviceData[i].deviceid;
          arrayDevice.push(deviceData[i].devicename);
          }

      }
    }); //end of ajax function
}

function getDeviceName(){
    $.ajax({//for devices
        type: "GET",
        //url: "server/view.php?uDevice="+idd,
        url: "http://www.grand-pillar.com/uploads/fire/view.php?uDevice="+idd,
        async: false,
        dataType: 'json',
        success: function(udevice){
          console.log(udevice);
            shwdvcstatus = udevice.fld_devicename;
            if (udevice.fld_devicename == null || udevice.fld_devicename =="") {
                $('#hsetup1').modal('open');
            }
        }
    }); //end of ajax function  
}

function getDeviceStatus(){//Start of getDeviceStatus function
    
    $.ajax({
        type: "GET",
        url: "https://dweet.io:443/get/dweets/for/"+shwdvcstatus,
        async: false,
        success: function(myData){
          //console.log(myData);
          for (var i=4; i>=0;  i--) {
            aryHum.push(myData.with[i].content.Humidity);
            aryTemp.push(myData.with[i].content.Temperature);
            aryGas.push(myData.with[i].content.Gas);
            aryLat.push(myData.with[i].content.Latitude);
            aryLong.push(myData.with[i].content.Longitude);
            mydate = new Date(myData.with[i].created);
            //aryTstamp.push(mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds());
            aryTstamp.push(mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds());

            
          }
          //}//end of for loop
            if (0 < aryHum.length) {
                $( "#dvcstatus" ).removeClass( "grey-text" ).addClass( "green-text" );
                
            }
            else{
                $( "#dvcstatus" ).removeClass( "green-text" ).addClass( "grey-text" );
            }
        }
    }); //end of ajax function  
    
}//end of getDeviceStatus function

function showDeviceStatus(){
    if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]<=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "green-text fa-check-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "green-text" );
                
            }
            if (aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]<=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "amber-text fa-bell" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "amber-text" );
                
            }
            if (aryHum[4]>=50 && aryTemp[4]>=32 && aryGas[4]<=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "amber-text fa-bell" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "amber-text" );
                
            }
            if (aryHum[4]<=50 && aryTemp[4]>=32 && aryGas[4]<=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                
                $( "#dvcDngrTtl" ).text("Danger: Intense Heat");
                $( "#dvcDngrBdy" ).text("We've detected low in humidity and an increase of temperature.");
                $('#dvcDanger').modal('open');
                
            }
            if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]>=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                
                $( "#dvcDngrTtl" ).text("Danger: Smoke Detected");
                $( "#dvcDngrBdy" ).text("We've detected a small amount of smoke.");
                $('#dvcDanger').modal('open');
                
            }
            if (aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]>=65) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                
                $( "#dvcDngrTtl" ).text("Danger: Smoke Detected");
                $( "#dvcDngrBdy" ).text("We've detected a small amount of smoke.");
                $('#dvcDanger').modal('open');
                
            }
            
}

//Display data on the chart
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
            mapTypeIds: ['styled_map']
        },
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false
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
  //for(i=0; i<arrayDevice.length; i++){
    if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]<=65) {
          vicon = "img/normal-small-size.png";
          //directionsDisplay.setMap(null);
      }
      else if(aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]<=65){
          vicon = "img/alert-small-size.png";
      }
      else if (aryHum[4]>=50 && aryTemp[4]>=32 && aryGas[4]<=65) {
        vicon = "img/alert-small-size.png";
      }
      else if(aryHum[4]<=50 && aryTemp[4]>=32 && aryGas[4]<=65){
          vicon = "img/danger-small-size.png";
      }
      else if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]>=65) {
        vicon = "img/danger-small-size.png";
      }
      else if (aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]>=65) {
        vicon = "img/danger-small-size.png";
      }
      //console.log(aryLat);
    var marker = new google.maps.Marker({
          position: new google.maps.LatLng(aryLat[4],aryLong[4]),
          map: map,
          icon:vicon  
      });
      markers.push(marker); 

      //var infowindow = new google.maps.InfoWindow({
          //content: contentString
       // });

      //marker.addListener('click', function() {
        //  infowindow.open(map, marker);
        //});
  //}//forloop
    
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

contentString= "";