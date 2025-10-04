import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkSmoke {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly zone: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Smoke Zone')
      .setCharacteristic(Characteristic.SerialNumber, `Zone-${zone.zoneNumber}`);

    this.service = this.accessory.getService(Service.SmokeSensor) ||
      this.accessory.addService(Service.SmokeSensor);

    this.service.setCharacteristic(Characteristic.Name, zone.name);

    // Initial state
    const initialState = zone.state === 'secure'
      ? Characteristic.SmokeDetected.SMOKE_NOT_DETECTED
      : Characteristic.SmokeDetected.SMOKE_DETECTED;

    this.service.setCharacteristic(Characteristic.SmokeDetected, initialState);

    // Listen for zone changes
    this.platform.elkClient.onZoneChange((updatedZone: any) => {
      if (updatedZone.zoneNumber === zone.zoneNumber) {
        const smokeState = updatedZone.state === 'secure'
          ? Characteristic.SmokeDetected.SMOKE_NOT_DETECTED
          : Characteristic.SmokeDetected.SMOKE_DETECTED;

        this.service.updateCharacteristic(Characteristic.SmokeDetected, smokeState);
      }
    });
  }
}
