const path = require('path');
const five = require('johnny-five');
const Tessel = require('tessel-io');
const board = new five.Board({
  io: new Tessel(),
});

const throttle = require('lodash/throttle');
const Barcli = require('Barcli');

const graphs = {
  temperature: new Barcli({ label: 'Temperature', range: [0, 120] }),
  pressure: new Barcli({ label: 'Pressure', range: [0, 100] }),
  relativeHumidity: new Barcli({ label: 'Relative Humidity', range: [0, 100] })
};

board.on('ready', () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const port = process.env.PORT || 80;

  const monitor = new five.Multi({
    controller: 'BME280',
  });

  const handleChange = throttle(() => {
    const temperature = monitor.thermometer.fahrenheit;
    const pressure = monitor.barometer.pressure;
    const relativeHumidity = monitor.hygrometer.relativeHumidity;
    // console.log({ temperature, pressure, relativeHumidity });
    graphs.temperature.update(temperature);
    graphs.pressure.update(pressure);
    graphs.relativeHumidity.update(relativeHumidity);
    io.sockets.emit('weather change', {temperature, pressure, relativeHumidity});
  }, 470);

  monitor.on('change', handleChange);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  app.post('/', (req, res) => {
    const { color } = req.body;
    console.log('setting the color: to %s. ', color);
    led.color(color);
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  // Our code here!
  io.on('connection', (socket) => {
    socket.on('weather change', data => {
      console.log({ data });
      led.color(data.color);
    })
  });

  http.listen(port, function () {
    console.log(
      'Your server is up and running on Port ' + port + '. Good job!',
    );
  });
});
