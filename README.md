# cncjs-dro

A simple plugin that adds a DRO (Digital Read Out) to your CNCJS project using [Johnny Five](http://johnny-five.io/), an Arduino, or a Raspberry Pi. Tested using a [Hitachi HD44780](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf) parallel / serial LCD driver and screen.

#### Usage

Clone the repository and run `npm install`.

Modify the .drorc file in the project root to suit your project:
```
{
  "system": "rpi" // Default, will also accept "arduino"
  "pins": ["GPIO26", "GPIO19", "GPIO13", "GPIO6", "GPIO5", "GPIO11"]
}
```

If using a Raspberry Pi, check the info on pinouts [here](https://github.com/nebrius/raspi-io#pin-naming).

Arduino pins can be expressed as `Array<Number>`

Run the application using the following command:

`bin/./dro-cli -p [your port] [options]`

###### Options
```
-h, --help                  output usage information
    --config <path>             path to config file (.cncrc)
    --socket-address <address>  socket address or hostname (default: localhost)
    -p, --port <port>           path or name of serial port
    --socket-port <port>        socket port (default: 8000)
    -b, --baudrate <baudrate>   baud rate (default: 115200)
    --controller-type <type>    controller type: Grbl|Smoothie|TinyG (default: TinyG)
```
