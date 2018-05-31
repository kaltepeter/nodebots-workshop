var five = require('johnny-five');
var Tessel = require('tessel-io');
var board = new five.Board({
  io: new Tessel(),
});

const env = require('./env');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(env.sendgrid);

const throttle = require('lodash/throttle');

const openMessage = {
  to: 'tessel-earl@mailinator.com',
  from: 'no-reply@mailinator.com',
  subject: 'The Door has been opened',
  text: 'Everything we feared is happening now.',
  html: '<p>Everything we feared is happening now.</p>',
};

board.on('ready', () => {
  const door = new five.Switch({
    pin: 'a2',
    invert: true,
  });

  const handleOpen = throttle(() => {
    console.log('handle Open');
    sendgrid.send(openMessage)
      .then(() => {
        console.log('sent the warning message. preparing to panic');
      })
      .catch(() => {
        console.log('something went terribly terribly wrong');;
      }, 2000);
  });

  door.on('open', handleOpen);
  door.on('close', () => { console.log('close'); })
});