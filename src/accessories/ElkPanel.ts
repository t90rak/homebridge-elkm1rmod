import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkPanel {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly partition: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Panel Partition')
      .setCharacteristic(Characteristic.SerialNumber, `Partition-${partition.partitionNumber}`);

    this.service = this.accessory.getService(Service.SecuritySystem) ||
      this.accessory.addService(Service.SecuritySystem);

    this.service.setCharacteristic(Characteristic.Name, partition.name);

    // Initial state
    const initialState = this.mapArmingState(partition.armingState);
    this.service.setCharacteristic(Characteristic.SecuritySystemCurrentState, initialState);
    this.service.setCharacteristic(Characteristic.SecuritySystemTargetState, initialState);

    // Listen for partition changes
    this.platform.elkClient.onPartitionChange((updatedPartition: any) => {
      if (updatedPartition.partitionNumber === partition.partitionNumber) {
        const newState = this.mapArmingState(updatedPartition.armingState);
        this.service.updateCharacteristic(Characteristic.SecuritySystemCurrentState, newState);
        this.service.updateCharacteristic(Characteristic.SecuritySystemTargetState, newState);
      }
    });
  }

  private mapArmingState(state: string): number {
    const { Characteristic } = this.platform.api.hap;

    switch (state) {
      case 'disarmed':
        return Characteristic.SecuritySystemCurrentState.DISARMED;
      case 'armedStay':
        return Characteristic.SecuritySystemCurrentState.STAY_ARM;
      case 'armedAway':
        return Characteristic.SecuritySystemCurrentState.AWAY_ARM;
      case 'armedNight':
        return Characteristic.SecuritySystemCurrentState.NIGHT_ARM;
      case 'entryDelay':
      case 'exitDelay':
        return Characteristic.SecuritySystemCurrentState.ALARM_TRIGGERED;
      default:
        return Characteristic.SecuritySystemCurrentState.DISARMED;
    }
  }
}
