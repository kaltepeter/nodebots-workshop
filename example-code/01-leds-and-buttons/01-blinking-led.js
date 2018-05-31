// Our code here!
const five = require('johnny-five');
const Tessel = require('tessel-io');
const board = new five.Board({
    io: new Tessel()
});

board.on('ready', () => {
    // const led = new five.Led('a0');
    const led = new five.Led('a5');
    // led.blink(500);
    led.pulse(800);
});