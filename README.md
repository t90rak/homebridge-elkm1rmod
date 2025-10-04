# homebridge-elkm1rmod

A Homebridge plugin for integrating Elk M1 Gold security systems via the ElkM1RMod serial interface.

---

## ✨ Features

- Monitor Elk M1 zones (e.g., doors, windows, motion)
- Control outputs (e.g., relays, lights)
- Arm/disarm partitions
- Trigger tasks
- Compatible with Homebridge 2.0
- Supports Homebridge UI configuration

---

## 🛠 Installation

```bash
npm install -g homebridge-elkm1rmod

## Configuration

{
  "platform": "ElkM1",
  "name": "Elk M1",
  "serialPort": "/dev/ttyUSB0",
  "zones": [1, 2, 3],
  "outputs": [1, 2],
  "partitions": [1],
  "tasks": [1, 2],
  "logRawData": false
}
