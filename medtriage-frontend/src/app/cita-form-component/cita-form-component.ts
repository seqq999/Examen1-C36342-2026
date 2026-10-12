import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CrearCitaPayload } from '../models/cita.model';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterLink],
  templateUrl: './cita-form-component.html',
})
export class CitaFormComponent {
  private readonly citaService = inject(CitaService);
  private readonly router = inject(Router);

  pacienteId: number | null = null;
  doctorId: number | null = null;

  nivelPrioridad = 'MEDIA';
  motivoConsulta = '';
  montoConsulta: number | null = null;

  guardando = false;
  error = '';

  guardarCita(): void {
    this.error = '';

    if (this.pacienteId === null) {
      this.error = 'Escribe el ID del paciente.';
      return;
    }

    if (this.doctorId === null) {
      this.error = 'Escribe el ID del doctor.';
      return;
    }

    if (!this.motivoConsulta.trim()) {
      this.error = 'Escribe el motivo de la consulta.';
      return;
    }

    if (
      this.montoConsulta === null ||
      this.montoConsulta < 0
    ) {
      this.error = 'Escribe un monto válido.';
      return;
    }

    const payload: CrearCitaPayload = {
      pacienteId: Number(this.pacienteId),
      doctorId: Number(this.doctorId),
      nivelPrioridad: this.nivelPrioridad,
      motivoConsulta: this.motivoConsulta.trim(),
      montoConsulta: Number(this.montoConsulta)
    };

    console.log('Payload enviado:', payload);

    this.guardando = true;

    this.citaService.crearCita(payload).subscribe({
      next: respuesta => {
        console.log('Cita creada correctamente:', respuesta);

        this.guardando = false;
        this.router.navigate(['/citas']);
      },
      error: error => {
        console.error('Error al guardar la cita:', error);
        console.error('Respuesta del backend:', error.error);

        this.guardando = false;

        if (error.status === 0) {
          this.error = 'No se pudo conectar con el backend.';
        } else if (error.status === 404) {
          this.error =
            'El paciente o el doctor no fueron encontrados.';
        } else {
          this.error =
            `No se pudo guardar la cita. Código HTTP: ${error.status}`;
        }
      }
    });
  }
}
