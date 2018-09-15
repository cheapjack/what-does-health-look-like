var serial
var inData

var r
var sensorInput
var lastSensorInput = 0

var iteration = 0
var circleDiameter = 20

// Angle and step size
var theta = 0
var lastTheta
var theta_step_angle = 0.01

var options = {
  baudrate: 115200
}

function setup () {
  colorMode(HSB)
  createCanvas(800, 800)
  background(0)

  r = height * 0.45

  // Make a new instance of the serialport library
  serial = new p5.SerialPort()
  serial.on('data', onSerialData)
  serial.on('error', onSerialError)

  // Automatically open a connection to the first serial device we find
  serial.on('list', function (list) {
    console.log(list);

    // Remove the Bluetooth device that appears on a Mac
    list = list.filter(function (device) {
      return device.indexOf('Bluetooth-Incoming-Port') === -1
    })

    if (list.length) {
      serial.open(list[0], options)
      serial.clear()
    }
  })

  serial.list()
}

function draw () {
  // Translate the origin point to the center of the screen
  translate(width/2, height/2)

  // Convert polar to cartesian
  var x = r * sensorInput * cos(theta)
  var y = r * sensorInput * sin(theta)
	var lastx = r * lastSensorInput * cos(lastTheta)
	var lasty = r * lastSensorInput * sin(lastTheta)
	
	if (lastSensorInput != sensorInput) {
		lastSensorInput = sensorInput
		lastTheta = theta
		// Pick a colour, based on how long the script has been running
		fill(iteration % 360, 255, 100)

		// And draw a circle, in that colour, at the right position
		//ellipseMode(CENTER)
		//noStroke()

		//ellipse(x, y, circleDiameter, circleDiameter)
		strokeWeight(10)
		stroke(iteration % 360, 255, 100)
		line(x, y, lastx, lasty)
	}
	theta += theta_step_angle
	iteration += 0.1

}

function onSerialData () {
  var inString = serial.readLine().trim()
  if (inString.length > 0) {
    sensorInput = map(Number(inString), 0, 400000, 0.25, 1)
    inData = inString
  }
}

function onSerialError(err) {
  println('Something went wrong with the serial port. ' + err)
}

function keyPressed() {
  // You can press the down arrow to download an copy of the visualisation
  if (keyCode === DOWN_ARROW) {
    saveCanvas("image", "jpg")
  }
}
