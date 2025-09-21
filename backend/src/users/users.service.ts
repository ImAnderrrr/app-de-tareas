import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

export interface SafeUser {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  async create(email: string, password: string): Promise<User> {
    const normalizedEmail = this.normalizeEmail(email);
    const existing = await this.usersRepository.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ email: normalizedEmail, passwordHash });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = this.normalizeEmail(email);
    return this.usersRepository.findOne({ where: { email: normalizedEmail } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  toSafeUser(user: User): SafeUser {
    return { id: user.id, email: user.email };
  }
}
