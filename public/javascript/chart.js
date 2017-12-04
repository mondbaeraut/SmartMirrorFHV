var steps = 0;
var chart = Highcharts.chart('chart', {
    chart: {
        type: 'bar',
        backgroundColor: null
    },
    title: {
        text: '',
        style: {
            color: '#FFFFFF'
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#FFFFFF'
            }
        },
    },
    yAxis: {
        lineColor: '#FFFFFF',
        min: 0,
        max: 150,
        labels: {
            style: {
                color: '#FFFFFF'
            }
        },
        plotLines: [{
            value: 100,
            color: '#ff0000',
            width: 10,
            zIndex: 4,
            label: {
                text: 'Ziel', style: {
                    color: '#FFFFFF'
                }
            }
        }]
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        enabled: false
    },

    series: [{
        data: [steps],
        zoneAxis: 'y',
        zones: [{
            value: 0,
            color: '#FF0000'
        }, {
            value: 50,
            color: '#FFA500'
        }, {
            color: '#008000'
        }],

    }]
});
function resetChart(){
    chart.series[0].update({
        data: [0]
    });
}
function updateStepsForChart(value) {
    steps += value;
    chart.series[0].update({
        data: [steps]
    });
}
