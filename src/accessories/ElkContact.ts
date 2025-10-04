import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkContact {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly zone: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Zone')
      .setCharacteristic(Characteristic.SerialNumber, `Zone-${zone.zoneNumber}`);

    this.service = this.accessory.getService(Service.ContactSensor) ||
      this.accessory.addService(Service.ContactSensor);

    this.service.setCharacteristic(Characteristic.Name, zone.name);

    this.platform.elkClient.onZoneChange((updatedZone: any) => {
      if (updatedZone.zoneNumber === zone.zoneNumber) {
        const contactState = updatedZone.state === 'secure'
          ? Characteristic.ContactSensorState.CONTACT_DETECTED
          : Characteristic.ContactSensorState.CONTACT_NOT_DETECTED;

        this.service.updateCharacteristic(Characteristic.ContactSensorState, contactState);
      }
    });
  }
}
