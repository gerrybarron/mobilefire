var arrayDevice=[], aryHum=[], aryTemp=[], aryGas=[], aryLat=[], aryLong=[], markers=[],aryLoc=[],aryTstamp=[];
var ctx = document.getElementById("myChart");
var ctx2 = document.getElementById("myChart2");
var marker, i, vicon, mydate, myChart, myChart2, directionsDisplay, directionsService, start = "", end = "", request, latlong, contentString;
var color = Chart.helpers.color;
var chartColors = window.chartColors;
var shwdvcstatus="";
var idd = getUrlParameter('usrID');
var valpass;
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

$(document).ready(function()
{   
    //$("#removeIt").click(function() {
        //var idrmv = $("#removeIt").closest("li").prop("id");
        //alert(idrmv);
        //alert(this.id);
    //});
        
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
            $('#stu_pic').attr('src', "img/"+result.fld_pic);
            $('#user_pic').attr('src', "img/"+result.fld_pic);
            if (result.fld_pic == null || result.fld_pic == ""){
                $('#stu_pic').attr('src', "img/user-add.png");
                $('#user_pic').attr('src', "img/user-add.png");
            }
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
                +"<span class='badge grey-text text-lighten-1'>"+result[i].fld_femail+"</span></div></li>");
            //<div class='collapsible-body'><div class='row'><div class='col s12'><a id='removeIt' class='red btn block waves-effect waves-light'><i class='fa fa-times right red-text' aria-hidden='true'></i></a></div></div></div>
        };
    });
    getDeviceStatus(); //Get Status from Dweet.io   
    //getUserStatus();
    getChartData(); //Get and Display Chart Data
    tabledata();
    getWeatherUpdate()
});

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
function getDeviceStatus(){//Start of getDeviceStatus function
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
            if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]<=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "green-text fa-check-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "green-text" );
                $( "#hdvcstatus" ).text("Normal");
            }
            if (aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]<=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "amber-text fa-bell" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "amber-text" );
                $( "#hdvcstatus" ).text("Alert");
            }
            if (aryHum[4]>=50 && aryTemp[4]>=32 && aryGas[4]<=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "amber-text fa-bell" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "amber-text" );
                $( "#hdvcstatus" ).text("Alert");
            }
            if (aryHum[4]<=50 && aryTemp[4]>=32 && aryGas[4]<=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                $( "#hdvcstatus" ).text("Danger");
                $( "#dvcDngrTtl" ).text("Danger: Intense Heat");
                $( "#dvcDngrBdy" ).text("We've detected low in humidity and an increase of temperature.");
                $('#dvcDanger').modal('open');
            }
            if (aryHum[4]>=50 && aryTemp[4]<=32 && aryGas[4]>=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                $( "#hdvcstatus" ).text("Danger");
                $( "#dvcDngrTtl" ).text("Danger: Smoke Detected");
                $( "#dvcDngrBdy" ).text("We've detected a small amount of smoke.");
                $('#dvcDanger').modal('open');
            }
            if (aryHum[4]<=50 && aryTemp[4]<=32 && aryGas[4]>=50) {
                $( "#hdvcstatusicon" ).removeClass( "red-text green-text amber-text fa-check-circle fa-bell fa-exclamation-circle" ).addClass( "red-text fa-exclamation-circle" );
                $( "#hdvcstatus" ).removeClass( "red-text green-text amber-text" ).addClass( "red-text" );
                $( "#hdvcstatus" ).text("Danger");
                $( "#dvcDngrTtl" ).text("Danger: Smoke Detected");
                $( "#dvcDngrBdy" ).text("We've detected a small amount of smoke.");
                $('#dvcDanger').modal('open');
            }
        }
    }); //end of ajax function  
    if (0 < aryHum.length) {
        $( "#dvcstatus" ).removeClass( "red-text" ).addClass( "green-text" );
        $( "#dvcstatus" ).text("Connected");
    }
    else{
        $( "#dvcstatus" ).removeClass( "green-text" ).addClass( "red-text" );
        $( "#dvcstatus" ).text("Disconnected");
    }
}//end of getDeviceStatus function

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
