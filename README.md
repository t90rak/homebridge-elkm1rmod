# homebridge-elkm1rmod

![Homebridge 2.0 Compatible](https://img.shields.io/badge/Homebridge-2.0%20Compatible-brightgreen)

> ⚡️ This plugin has been tested and verified to work with Homebridge v2.0 and above.

Integrates Elk M1 security systems with Homebridge, enabling control and monitoring of zones, outputs, and system status through Apple HomeKit.

---

## 🔧 Installation

### From GitHub (Development Mode)

```bash
# Clone the repo
git clone https://github.com/t90rak/homebridge-elkm1rmod.git
cd homebridge-elkm1rmod

# Install dependencies and build
npm install
npm run build

# Link the plugin
sudo /opt/homebridge/bin/npm link
cd /var/lib/homebridge
sudo /opt/homebridge/bin/npm link homebridge-elkm1rmod

# Restart Homebridge
sudo systemctl restart homebridge

```

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)


*homebridge-elkm1rmod* lets you connect homebridge to an [Elk Products M1 Alarm panel](http://www.elkproducts.com/m1_controls.html) via an [M1XEP Ethernet interface](http://www.elkproducts.com/products/elk-m1xep-m1-ethernet-interface)

## Functionality

* *homebridge-elkm1rmod* exposes the following functionality via HomeKit:
* Arm/Disarm the alarm (Stay, Night and Away modes)
* See the status of zones
* Use zone status in HomeKit automation rules
* Control M1 outputs
* Activate M1 tasks

Most configuration items are discovered automatically, however you need to indicate zone types in the configuration file.
