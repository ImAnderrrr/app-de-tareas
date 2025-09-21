import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponse } from './interfaces/task-response.interface';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    const user = new User();
    user.id = userId;

    const task = this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description ?? null,
      done: false,
      user
    });

    const savedTask = await this.tasksRepository.save(task);
    return this.toResponse(savedTask);
  }

  async findAllForUser(userId: number): Promise<TaskResponse[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { id: 'ASC' }
    });
    return tasks.map((task) => this.toResponse(task));
  }

  async findOneForUser(id: number, userId: number): Promise<TaskResponse> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.toResponse(task);
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<TaskResponse> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.user.id !== userId) {
      throw new ForbiddenException('You cannot modify this task');
    }

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      const description = updateTaskDto.description;
      task.description = description && description.length > 0 ? description : null;
    }

    if (updateTaskDto.done !== undefined) {
      task.done = updateTaskDto.done;
    }

    const savedTask = await this.tasksRepository.save(task);
    return this.toResponse(savedTask);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.user.id !== userId) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.tasksRepository.remove(task);
  }

  private toResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? undefined,
      done: task.done
    };
  }
}
