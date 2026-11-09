/**
 * Servicio de estudiantes con cache LRU
 *
 * ERROR #13: Caché sin límite (memory leak)
 * Problema: el Map del caché crecía sin parar con cada consulta distinta.
 * Solución: máximo de 50 elementos (MAX_CACHE_SIZE) y vencimiento de
 * 5 minutos (CACHE_TTL); al pasar el límite se eliminan los más antiguos.
 */

import { apiClient } from '../api/client';
import { Student, CreateStudentData, UpdateStudentData } from '../types/student';

class StudentService {
  private baseUrl = '/students';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_CACHE_SIZE = 50; // Máximo 50 items en cache

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_TTL;
  }

  private cleanCache() {
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

      const toDelete = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
    this.cleanCache();
  }

  async getAll(): Promise<Student[]> {
    const cacheKey = 'all-students';

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const response = await apiClient.get<{ data: Student[] }>(this.baseUrl);
    const students = response.data.data;

    this.setCache(cacheKey, students);
    return students;
  }

  async getById(id: number): Promise<Student> {
    const cacheKey = `student-${id}`;

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    const response = await apiClient.get<{ data: Student }>(`${this.baseUrl}/${id}`);
    const student = response.data.data;

    this.setCache(cacheKey, student);
    return student;
  }

  async create(data: CreateStudentData): Promise<Student> {
    const response = await apiClient.post<{ data: Student }>(this.baseUrl, data);
    this.cache.clear();
    return response.data.data;
  }

  async update(id: number, data: UpdateStudentData): Promise<Student> {
    const response = await apiClient.put<{ data: Student }>(`${this.baseUrl}/${id}`, data);
    this.cache.delete(`student-${id}`);
    this.cache.delete('all-students');
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
    this.cache.delete(`student-${id}`);
    this.cache.delete('all-students');
  }
}

export const studentService = new StudentService();