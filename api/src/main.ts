import { Body, Controller, Delete, Get, HttpException, HttpStatus, Injectable, Module, Param, Patch, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

interface EventRecord { id: number; title: string; starts_at: string; ends_at?: string; location?: string; }
@Injectable()
class EventsService {
  private nextId = 2;
  private events: EventRecord[] = [{ id: 1, title: 'Preparação do repositório e README', starts_at: '2026-10-05T22:34:16.000Z', ends_at: '2026-10-06T00:00:00.000Z', location: 'Remoto' }];
  all() { return this.events; }
  one(id: number) { const event = this.events.find(item => item.id === id); if (!event) throw new HttpException(`Evento ${id} não encontrado`, HttpStatus.NOT_FOUND); return event; }
  create(input: Omit<EventRecord, 'id'>) { const event = { id: this.nextId++, ...input }; this.events.push(event); return event; }
  update(id: number, input: Partial<Omit<EventRecord, 'id'>>) { const event = this.one(id); Object.assign(event, input); return event; }
  remove(id: number) { const event = this.one(id); this.events = this.events.filter(item => item.id !== id); return event; }
}
@Controller()
class EventsController {
  constructor(private readonly service: EventsService) {}
  @Get('health') health() { return { status: 'ok' }; }
  @Get('events') all() { return this.service.all(); }
  @Get('events/:id') one(@Param('id') id: string) { return this.service.one(Number(id)); }
  @Post('events') create(@Body() body: Omit<EventRecord, 'id'>) { return this.service.create(body); }
  @Patch('events/:id') update(@Param('id') id: string, @Body() body: Partial<Omit<EventRecord, 'id'>>) { return this.service.update(Number(id), body); }
  @Delete('events/:id') remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}
@Module({ controllers: [EventsController], providers: [EventsService] }) class AppModule {}
async function bootstrap() { const app = await NestFactory.create(AppModule); app.enableCors(); await app.listen(process.env.PORT || 3000, '0.0.0.0'); }
bootstrap();
