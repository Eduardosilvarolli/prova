import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { Event } from './events/entities/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', host: config.get<string>('DB_HOST', 'localhost'), port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'events'), password: config.get<string>('DB_PASSWORD', 'events_password'),
        database: config.get<string>('DB_NAME', 'events_db'), entities: [Event], synchronize: true,
      }),
    }),
    EventsModule,
  ],
})
export class AppModule {}
