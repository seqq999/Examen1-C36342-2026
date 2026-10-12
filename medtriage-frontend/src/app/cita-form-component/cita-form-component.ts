import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { CitaService } from '../services/cita.service';
import { CrearCitaPayload } from '../models/cita.model';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cita-form-component.html'
})
export class CitaFormComponent {
  private readonly citaService = inject(CitaService);
  private readonly router = inject(Router);

  paciente = {
    nombre: '',
    identificacion: '',
    telefono: '',
    correo: ''
  };

  doctor = {
    nombre: '',
    especialidad: ''
  };

  prioridad = 'MEDIA';
  motivo = '';
  monto = 0;

  guardarCita(): void {
    if (!this.paciente.nombre || !this.doctor.nombre || !this.motivo) {
      console.error('Faltan campos obligatorios');
      return;
    }

    const payload: CrearCitaPayload = {
      paciente: this.paciente,
      doctor: this.doctor,
      nivelPrioridad: this.prioridad,
      motivo: this.motivo,
      monto: Number(this.monto)
    };

    console.log('Payload enviado:', payload);

    this.citaService.crearCita(payload).subscribe({
      next: respuesta => {
        console.log('Cita guardada correctamente:', respuesta);
        this.router.navigate(['/citas']);
      },
      error: error => {
        console.error('Error completo del backend:', error);
        console.error('Código HTTP:', error.status);
        console.error('Respuesta:', error.error);
        alert(
          `No se pudo guardar la cita. Código HTTP: ${error.status}`
        );
      }
    });
  }
}
