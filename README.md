# 🛡️ homebridge-elkm1rmod

![Homebridge 2.0 Compatible](https://img.shields.io/badge/Homebridge-2.0%20Compatible-brightgreen)
[![Verified by Homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

> ⚡️ This plugin has been tested and verified to work with Homebridge v2.0 and above.

Integrates Elk M1 security systems with Homebridge, enabling control and monitoring of zones, outputs, and system status through Apple HomeKit.

---

## 📦 Features

- ✅ Arm/Disarm the alarm (Stay, Night, Away modes)
- ✅ Monitor zone status
- ✅ Use zone status in HomeKit automation rules
- ✅ Control M1 outputs
- ✅ Activate M1 tasks
- ✅ Tamper detection for zones
- ✅ Native Homebridge UI configuration support

Most configuration items are discovered automatically. However, you’ll need to manually specify zone types in your `config.json`.

---

## 🔧 Installation

### 🛠 From GitHub (Development Mode)

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


