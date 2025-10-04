import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkInput {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly zone: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Input Zone')
      .setCharacteristic(Characteristic.SerialNumber, `Zone-${zone.zoneNumber}`);

    this.service = this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch);

    this.service.setCharacteristic(Characteristic.Name, zone.name);

    // Initial state
    const initialState = zone.state === 'secure' ? false : true;
    this.service.setCharacteristic(Characteristic.On, initialState);

    // Listen for zone changes
    this.platform.elkClient.onZoneChange((updatedZone: any) => {
      if (updatedZone.zoneNumber === zone.zoneNumber) {
        const switchState = updatedZone.state === 'secure' ? false : true;
        this.service.updateCharacteristic(Characteristic.On, switchState);
      }
    });
  }
}
