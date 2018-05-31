const socket = io();

const getChart = (id, value) => {
  var chart = c3.generate({
    data: {
        columns: [
            ['data', 91.4]
        ],
        type: 'gauge',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    gauge: {
    },
    color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
        threshold: {
  //            unit: 'value', // percentage is default
  //            max: 200, // 100 is default
            values: [30, 60, 90, 100]
        }
    },
    size: {
      height: 180
    }
  });

  chart.load({
    columns: [['data', value]]
  });
  return chart;
};

const temperatureMetric = document.getElementById('temperature');
const pressureMetric = document.getElementById('pressure');
const relativeHumidityMetric = document.getElementById('relative-humidity');

socket.on('weather change', data => {
  console.log({ data });
  temperatureMetric.innerHTML = getChart(data.temperature);
  pressureMetric.innerText = getChart(data.pressure);
  relativeHumidityMetric.innerText = getChart(data.relativeHumidity);
});
