#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
const get = require('lodash.get');
const five = require('johnny-five');
const rpi = require('raspi-io');

class DRO {
  constructor(options) {
    this.cncConfig = options;
    this.cncConfig.secret = this.getSecret();
    this.cncConfig.token = this.generateAccessToken();
    this.machinePOS = { x: 0.0000, y: 0.0000, z: 0.0000 }
    this.initSocket();
  }

  initSocket() {
    const ws = this.cncConfig.socketAddress + ':' + this.cncConfig.socketPort;
    console.log('attempting to connect to ' + ws);
    this.socket = io('ws://' + ws, {
        'query': 'token=' + this.cncConfig.token
    });
    this.bindEvents();
  }

  initBoard() {
    this.board = new five.Board({ io: new rpi() });
    this.board.on("ready", () => {
      console.log("board is on");
      this.lcd = new five.LCD({
        pins: ["P1-37", "P1-35", "P1-23", "P1-29", "P1-31", "P1-33"],
        //backlight: 10,
        rows: 2,
        cols: 16
      });
      this.lcd.cursor(0,0);
      this.lcd.print("X: ");
      this.lcd.cursor(1,0);
      this.lcd.print("Y: ");
    });

  }

  userHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  getSecret() {
    const cncrc = path.resolve('/home/pi/.cncrc');
    try {
        const config = JSON.parse(fs.readFileSync(cncrc, 'utf8'));
        return config.secret;
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
  }

  generateAccessToken() {
    let secret = this.getSecret();
    return(jwt.sign({ id: '', name: 'cncjs-pendant' }, secret, {
        expiresIn: '30d',
    }));
  }

  setMachinePOS(data) {
    const { x, y } = data.sr.wpos;
    if (this.lcd) {
      this.lcd.clear();
      this.lcd.cursor(0,0);
      this.lcd.print("X: " + x.toFixed(3));
      this.lcd.cursor(1,0);
      this.lcd.print("Y: " + y.toFixed(3));
    }
  }

  bindEvents() {
    this.socket.on('connect', () => {
      console.log('connected to cncjs!');
      this.socket.emit('list');
      this.socket.on('serialport:list', (data) => {
        this.socket.emit('open', this.cncConfig.port, {
          baudrate: this.cncConfig.baudrate,
          controllerType: this.cncConfig.controllerType,
        });
        this.initBoard();
      });
    });
    this.socket.on('error', (error) => { console.log('error!',error); });
    this.socket.on(this.cncConfig.controllerType + ':state', (data) => {
      this.setMachinePOS(data);
    });
    this.socket.on('serialport:error', (message) => { console.log(message); });
    this.socket.on('serialport:open', (message) => { console.log('Connection opened on ' + this.cncConfig.port); });
    this.socket.on('serialport:close', (message) => { console.log(message); });
    // this.socket.on('serialport:read', (message) => { console.log(message); });
  }
}

module.exports = DRO;
