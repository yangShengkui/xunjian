"use strict";

var line = document.getElementById("line-chart");
var area = document.getElementById("area-chart");
var bar = document.getElementById("bar-chart");
var pie = document.getElementById("pie-chart");
var polar = document.getElementById("polar-chart");
var radar = document.getElementById("radar-chart");

var options ={
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
};

//LINE CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataLine = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "Data 1",
            fill: false,
            backgroundColor: "#37d177",
            borderColor: "#37d177",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "343d3e",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 66],
            spanGaps: false
        },
        {
            label: "Data 2",
            fill: false,
            backgroundColor: "#FFCE56",
            borderColor: "#FFCE56",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#FFCE56",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [55, 79, 70, 75, 88],
            spanGaps: false
        }
    ]
};
var lineChart = new Chart(line, {
    type: 'line',
    data: dataLine
});

//AREA CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataArea = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "Data 1",
            fill: true,
            backgroundColor: "rgba(55, 209, 119, 0.45)",
            borderColor: "rgba(55, 209, 119, 0.45)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "343d3e",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: [12, 13, 11, 6, 9]
        },
        {
            label: "Data 2",
            fill: true,
            backgroundColor: "rgba(175, 175, 175, 0.26)",
            borderColor: "rgba(175, 175, 175, 0.26)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointHoverBackgroundColor: "#343d3e",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            data: [14, 6, 9, 13, 12],
        }
    ],
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
};

var areaChart = new Chart(area, {
    type: 'line',
    data: dataArea,
    options: options

});

//BAR CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataBars = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "Data 1",
            fill: true,
            backgroundColor: "rgba(55, 209, 119, 0.45)",
            borderColor: "rgba(55, 209, 119, 0.45)",
            data: [12, 13, 11, 6, 9]
        },
        {
            label: "Data 2",
            fill: true,
            backgroundColor: "rgba(175, 175, 175, 0.26)",
            borderColor: "rgba(175, 175, 175, 0.26)",
            data: [14, 6, 9, 13, 12],
        }
    ],
    options: {
        scales: {
            yAxes: [{
                stacked: true
            }]
        }
    }
};

var barChar = new Chart(bar, {
    type: 'bar',
    data: dataBars,
    options: options

});

//PIE  & POLAR CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataPie = {
    labels: [
        "Data 1",
        "Data 2",
        "Data 3"
    ],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "rgba(55, 209, 119, 0.45)",
                "#FFCE56",
                "rgba(175, 175, 175, 0.26)"
            ],
            hoverBackgroundColor: [
                "rgba(55, 209, 119, 0.6)",
                "#FFCE56",
                "rgba(175, 175, 175, 0.4)"
            ]
        }]
};

var pieChar = new Chart(pie, {
    type: 'pie',
    data: dataPie

});

var polarChar = new Chart(polar, {
    type: 'polarArea',
    data: dataPie

});

//RADAR CHART EXAMPLE
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
var dataRadar = {
    labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "Data 1",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "Data 2",
            backgroundColor: "rgba(55, 209, 119, 0.45)",
            borderColor: "rgba(55, 209, 119, 1)",
            pointBackgroundColor: "rgba(55, 209, 119, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(55, 209, 119, 1)",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};

var radarChar = new Chart(radar, {
    type: 'radar',
    data: dataRadar

});