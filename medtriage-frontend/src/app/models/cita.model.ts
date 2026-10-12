export interface Doctor {
  id?: number;
  nombre: string;
  especialidad?: string;
}

export interface Paciente {
  id?: number;
  nombre: string;
  identificacion?: string;
  telefono?: string;
  correo?: string;
}

export interface CitaMedica {
  id: number;
  paciente: Paciente;
  doctor: Doctor;
  prioridad: string;
  motivo: string;
  monto: number;
  estado: string;
  fechaCreacion?: string;
}

export interface CrearCitaPayload {
  paciente: Paciente;
  doctor: Doctor;
  prioridad: string;
  motivo: string;
  monto: number;
}
