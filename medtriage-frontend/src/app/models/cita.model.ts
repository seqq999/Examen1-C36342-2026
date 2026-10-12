export interface CitaMedica {
  id: number;
  codigoCita: string;
  nombrePaciente: string;
  nombreDoctor: string;
  nivelPrioridad: string;
  motivoConsulta: string;
  estado: string;
  montoConsulta: number;
  fechaCita: string;
}

export interface Doctor {
  id: number;
  nombre: string;
  especialidad?: string;
}

export interface Paciente {
  id: number;
  nombre: string;
  identificacion?: string;
}

export interface CrearCitaPayload {
  pacienteId: number;
  doctorId: number;
  nivelPrioridad: string;
  motivoConsulta: string;
  montoConsulta: number;
}

export interface ActualizarEstadoPayload {
  nuevoEstado: string;
}
