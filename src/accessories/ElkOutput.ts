import { Service, Characteristic, PlatformAccessory } from 'homebridge';
import { ElkM1Platform } from '../platform';

export class ElkOutput {
  private service: Service;

  constructor(
    private readonly platform: ElkM1Platform,
    private readonly accessory: PlatformAccessory,
    private readonly output: any,
  ) {
    const { Service, Characteristic } = this.platform.api.hap;

    this.accessory.getService(Service.AccessoryInformation)!
      .setCharacteristic(Characteristic.Manufacturer, 'Elk Products')
      .setCharacteristic(Characteristic.Model, 'M1 Output')
      .setCharacteristic(Characteristic.SerialNumber, `Output-${output.outputNumber}`);

    this.service = this.accessory.getService(Service.Switch) ||
      this.accessory.addService(Service.Switch);

    this.service.setCharacteristic(Characteristic.Name, output.name);

    // Initial state
    this.service.setCharacteristic(Characteristic.On, output.state);

    // Listen for output changes
    this.platform.elkClient.onOutputChange((updatedOutput: any) => {
      if (updatedOutput.outputNumber === output.outputNumber) {
        this.service.updateCharacteristic(Characteristic.On, updatedOutput.state);
      }
    });

    // Handle HomeKit switch changes
    this.service.getCharacteristic(Characteristic.On)
      .onSet((value: boolean) => {
        this.platform.elkClient.setOutputState(output.outputNumber, value);
      });
  }
}
