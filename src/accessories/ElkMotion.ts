import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkMotion {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly zone: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Motion Zone')
      .setCharacteristic(Characteristic.SerialNumber, `Zone-${zone.zoneNumber}`);

    this.service = this.accessory.getService(Service.MotionSensor) ||
      this.accessory.addService(Service.MotionSensor);

    this.service.setCharacteristic(Characteristic.Name, zone.name);

    // Initial state
    const initialState = zone.state === 'secure'
      ? Characteristic.MotionDetected.FALSE
      : Characteristic.MotionDetected.TRUE;

    this.service.setCharacteristic(Characteristic.MotionDetected, initialState);

    // Listen for zone changes
    this.platform.elkClient.onZoneChange((updatedZone: any) => {
      if (updatedZone.zoneNumber === zone.zoneNumber) {
        const motionState = updatedZone.state === 'secure'
          ? Characteristic.MotionDetected.FALSE
          : Characteristic.MotionDetected.TRUE;

        this.service.updateCharacteristic(Characteristic.MotionDetected, motionState);
      }
    });
  }
}
