import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 24 * 3600 * 1000, lruSize: 5000 })
            }),
            new KeyvRedis('redis://locahost:6379')
          ]
        }
      }
    })],
  providers: [EventsGateway],
})
export class EventsModule {}