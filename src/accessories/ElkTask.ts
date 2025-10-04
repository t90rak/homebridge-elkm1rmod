import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkTask {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly task: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Task')
      .setCharacteristic(Characteristic.SerialNumber, `Task-${task.taskNumber}`);

    this.service = this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch);

    this.service.setCharacteristic(Characteristic.Name, task.name);
    this.service.setCharacteristic(Characteristic.On, false);

    this.service.getCharacteristic(Characteristic.On)
      .onSet((value: boolean) => {
        if (value) {
          this.platform.elkClient.runTask(task.taskNumber);
          setTimeout(() => {
            this.service.updateCharacteristic(Characteristic.On, false);
          }, 1000);
        }
      });
  }
}
