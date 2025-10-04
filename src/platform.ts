import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
} from 'homebridge';

import { ElkContact } from './accessories/ElkContact';
import { ElkGarageDoor } from './accessories/ElkGarageDoor';
import { ElkInput } from './accessories/ElkInput';
import { ElkMotion } from './accessories/ElkMotion';
import { ElkOutput } from './accessories/ElkOutput';
import { ElkPanel } from './accessories/ElkPanel';
import { ElkSmoke } from './accessories/ElkSmoke';
import { ElkTask } from './accessories/ElkTask';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';

const Elk = require('elkmon');

export class ElkM1Platform implements DynamicPlatformPlugin {
  public readonly accessories: PlatformAccessory[] = [];
  public readonly elkClient: any;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Finished initializing platform:', PLATFORM_NAME);

    this.elkClient = new Elk.ElkClient(config);

    this.api.on('didFinishLaunching', () => {
      this.log.debug('Executed didFinishLaunching callback');
      this.elkClient.connect();

      this.elkClient.on('connected', () => {
        this.log.info('Connected to Elk M1');
        this.elkClient.requestZoneStatusReport();
        this.elkClient.requestTextDescriptionAll();
        this.elkClient.requestOutputStatus();
        this.elkClient.requestTaskStatus();
        this.elkClient.requestArmingStatus();
      });

      this.elkClient.on('zoneUpdate', (zone: any) => {
        this.log.debug(`Zone ${zone.zoneNumber} updated: ${zone.status}`);
        this.addOrUpdateZone(zone);
      });

      this.elkClient.on('outputUpdate', (output: any) => {
        this.log.debug(`Output ${output.outputNumber} updated: ${output.status}`);
        this.addOrUpdateOutput(output);
      });

      this.elkClient.on('taskUpdate', (task: any) => {
        this.log.debug(`Task ${task.taskNumber} updated`);
        this.addOrUpdateTask(task);
      });

      this.elkClient.on('armingStatusUpdate', (partition: any) => {
        this.log.debug(`Partition ${partition.partitionNumber} updated: ${partition.armingStatus}`);
        this.addOrUpdatePanel(partition);
      });

      this.elkClient.on('error', (err: Error) => {
        this.log.error('ElkM1 error:', err.message);
      });
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }

  addOrUpdateZone(zone: any): void {
    const zoneNumber = zone.zoneNumber;
    const zoneType = this.config.zoneTypes?.[zoneNumber] || 'contact';
    const uuid = this.api.hap.uuid.generate(`zone-${zoneNumber}`);
    let accessory = this.accessories.find(acc => acc.UUID === uuid);

    if (!accessory) {
      accessory = new this.api.platformAccessory(zone.name, uuid);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      this.accessories.push(accessory);
    }

    switch (zoneType) {
      case 'contact':
        new ElkContact(this, accessory, zone);
        break;
      case 'motion':
        new ElkMotion(this, accessory, zone);
        break;
      case 'smoke':
        new ElkSmoke(this, accessory, zone);
        break;
      case 'garage':
        new ElkGarageDoor(this, accessory, zone);
        break;
      case 'input':
        new ElkInput(this, accessory, zone);
        break;
    }
  }

  addOrUpdateOutput(output: any): void {
    const outputNumber = output.outputNumber;
    const uuid = this.api.hap.uuid.generate(`output-${outputNumber}`);
    let accessory = this.accessories.find(acc => acc.UUID === uuid);

    if (!accessory) {
      accessory = new this.api.platformAccessory(output.name, uuid);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      this.accessories.push(accessory);
    }

    new ElkOutput(this, accessory, output);
  }

  addOrUpdateTask(task: any): void {
    const taskNumber = task.taskNumber;
    const uuid = this.api.hap.uuid.generate(`task-${taskNumber}`);
    let accessory = this.accessories.find(acc => acc.UUID === uuid);

    if (!accessory) {
      accessory = new this.api.platformAccessory(task.name, uuid);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      this.accessories.push(accessory);
    }

    new ElkTask(this, accessory, task);
  }

  addOrUpdatePanel(partition: any): void {
    const partitionNumber = partition.partitionNumber;
    const uuid = this.api.hap.uuid.generate(`partition-${partitionNumber}`);
    let accessory = this.accessories.find(acc => acc.UUID === uuid);

    if (!accessory) {
      accessory = new this.api.platformAccessory(partition.name, uuid);
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
      this.accessories.push(accessory);
    }

    new ElkPanel(this, accessory, partition);
  }
}



