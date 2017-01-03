var arrayDevice=[], aryHum=[], aryTemp=[], aryGas=[], aryLat=[], aryLong=[], markers=[],aryLoc=[],aryTstamp=[];
var ctx = document.getElementById("myChart");
var ctx2 = document.getElementById("chart-area");
var datetime;
//var mydate = new Date();
var mydate;
//var mytime = mydate.getTime();
var myChart;
var chartColors = window.chartColors;
    var color = Chart.helpers.color;
    var config;

$(document).ready(function()
{
    
    getDeviceStatus(); //use to get Status of devices from dweet.io   
    getChartData();
    getChartPolarAria()
    console.log(aryHum);
});
//setInterval(function(){startRefresh()}, 10000);
function startRefresh(){
    aryHum=[];
    aryTemp=[];
    aryGas=[];
    aryTstamp=[];
    getDeviceStatus();   
    getChartData();
}

function getChartPolarAria(){
    config = {
        data: {
            datasets: [{
                data: [
                    aryHum[4],
                    aryTemp[4],
                    aryGas[4],
                ],
                backgroundColor: [
                    color(chartColors.green).alpha(0.5).rgbString(),
                    color(chartColors.green).alpha(0.5).rgbString(),
                    color(chartColors.green).alpha(0.5).rgbString(),
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                "Hum",
                "Temp",
                "Gas"
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'center',
            },
            title: {
                display: true,
                text: 'Chart.js Polar Area Chart'
            },
            scale: {
              ticks: {
                beginAtZero: true
              },
              reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        }
    };
    window.myPolarArea = Chart.PolarArea(ctx2, config);
}

function getChartData(){
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: aryTstamp,
            datasets: [{
                label: 'Humidity',
                data: aryHum,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1,
                    fill: false
            },
            {
                label: 'Temperature',
                data: aryTemp,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1,
                    fill: false
            },
            {
                label: 'Gas',
                data: aryGas,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1,
                    fill: false
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });//end of myChart
}

function getDeviceStatus(){
    //var ndevice = arrayDevice.length;
    //for(var i=0; i<=arrayDevice.length-1; i++){
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
            aryTstamp.push(mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds());
          };
        }
      }); //end of ajax function  
    //}//end of for loop
}
