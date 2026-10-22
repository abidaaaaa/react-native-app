export interface Student {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface UpdateStudentData {
  nombre?: string;
  apellido?: string;
  matricula?: string;
  email?: string;
  password?: string;
}
