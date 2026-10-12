import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CitaService } from '../services/cita.service';
import { CitaMedica } from '../models/cita.model';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cita-list-component.html'
})
export class CitaListComponent {
  private readonly citaService = inject(CitaService);

  readonly citas = signal<CitaMedica[]>([]);
  readonly filtroPrioridad = signal('TODAS');

  readonly prioridades = ['TODAS', 'ALTA', 'MEDIA', 'BAJA'];

  readonly citasFiltradas = computed(() => {
    const filtro = this.filtroPrioridad();

    if (filtro === 'TODAS') {
      return this.citas();
    }

    return this.citas().filter(
      cita => cita.prioridad?.toUpperCase() === filtro
    );
  });

  ngOnInit(): void {
    this.citaService.getCitas().subscribe({
      next: citas => this.citas.set(citas),
      error: error => console.error('Error al cargar citas:', error)
    });
  }

  cambiarFiltro(prioridad: string): void {
    this.filtroPrioridad.set(prioridad);
  }
}
