import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkGarageDoor {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly zone: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Garage Door')
      .setCharacteristic(Characteristic.SerialNumber, `Zone-${zone.zoneNumber}`);

    this.service = this.accessory.getService(Service.GarageDoorOpener) ||
      this.accessory.addService(Service.GarageDoorOpener);

    this.service.setCharacteristic(Characteristic.Name, zone.name);

    // Initial state
    const initialState = zone.state === 'secure'
      ? Characteristic.CurrentDoorState.CLOSED
      : Characteristic.CurrentDoorState.OPEN;

    this.service.setCharacteristic(Characteristic.CurrentDoorState, initialState);
    this.service.setCharacteristic(Characteristic.TargetDoorState, initialState);

    // Listen for zone changes
    this.platform.elkClient.onZoneChange((updatedZone: any) => {
      if (updatedZone.zoneNumber === zone.zoneNumber) {
        const doorState = updatedZone.state === 'secure'
          ? Characteristic.CurrentDoorState.CLOSED
          : Characteristic.CurrentDoorState.OPEN;

        this.service.updateCharacteristic(Characteristic.CurrentDoorState, doorState);
        this.service.updateCharacteristic(Characteristic.TargetDoorState, doorState);
      }
    });
  }
}
