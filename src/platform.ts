import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from 'homebridge';

import { ElkM1Client } from './elkm1Client';
import { ElkM1Accessory } from './accessories/elkm1Accessory';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings';

export class ElkM1Platform implements DynamicPlatformPlugin {
  public readonly accessories: PlatformAccessory[] = [];
  private readonly elkClient: ElkM1Client;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.log.debug('Initializing platform:', PLATFORM_NAME);

    this.elkClient = new ElkM1Client(this.log, this.config);

    this.api.on('didFinishLaunching', () => {
      this.log.debug('Homebridge finished launching');
      this.elkClient.connect().then(() => {
        this.setupAccessories();
      }).catch(error => {
        this.log.error('Failed to connect to Elk M1:', error);
      });
    });
  }
  setupAccessories(): void {
    const zones = this.elkClient.getZones();
    zones.forEach(zone => {
      const uuid = this.api.hap.uuid.generate(`zone-${zone.zoneNumber}`);
      const existingAccessory = this.accessories.find(acc => acc.UUID === uuid);

      if (existingAccessory) {
        this.log.info('Restoring accessory from cache:', existingAccessory.displayName);
        new ElkM1Accessory(this, existingAccessory, zone);
      } else {
        this.log.info('Adding new accessory:', zone.name);
        const accessory = new this.api.platformAccessory(zone.name, uuid);
        new ElkM1Accessory(this, accessory, zone);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        this.accessories.push(accessory);
      }
    });
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.info('Loading accessory from cache:', accessory.displayName);
    this.accessories.push(accessory);
  }
}

