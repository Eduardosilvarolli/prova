import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private readonly repository: Repository<Event>) {}

  findAll() { return this.repository.find({ order: { starts_at: 'ASC' } }); }

  async findOne(id: number) {
    const event = await this.repository.findOneBy({ id });
    if (!event) throw new NotFoundException(`Evento ${id} não encontrado`);
    return event;
  }

  create(dto: CreateEventDto) {
    return this.repository.save(this.repository.create({
      title: dto.title,
      starts_at: new Date(dto.starts_at),
      ends_at: dto.ends_at ? new Date(dto.ends_at) : undefined,
      location: dto.location,
    }));
  }

  async update(id: number, dto: UpdateEventDto) {
    const event = await this.findOne(id);
    if (dto.title !== undefined) event.title = dto.title;
    if (dto.starts_at !== undefined) event.starts_at = new Date(dto.starts_at);
    if (dto.ends_at !== undefined) event.ends_at = new Date(dto.ends_at);
    if (dto.location !== undefined) event.location = dto.location;
    return this.repository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    await this.repository.remove(event);
    return { message: 'Evento removido com sucesso', id };
  }
}
