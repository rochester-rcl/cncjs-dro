#!/usr/bin/env node

const program = require('commander');
const DRO = require('./dro.js');

program
  .option('--config <path>', 'path to config file (.cncrc)', '.cncrc')
	.option('--socket-address <address>', 'socket address or hostname (default: localhost)', 'localhost')
  .option('-p, --port <port>', 'path or name of serial port')
	.option('--socket-port <port>', 'socket port (default: 8000)', 8000)
  .option('-b, --baudrate <baudrate>', 'baud rate (default: 115200)', 115200)
	.option('--controller-type <type>', 'controller type: Grbl|Smoothie|TinyG (default: Grbl)', 'TinyG')

program.parse(process.argv);

const options = {
    socketAddress: program.socketAddress,
    socketPort: program.socketPort,
    controllerType: program.controllerType,
    baudrate: Number(program.baudrate),
    config: program.config,
    port: program.port,
};

const dro = new DRO(options);
