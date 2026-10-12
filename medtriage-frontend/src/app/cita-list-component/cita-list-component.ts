import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { CitaMedica } from '../models/cita.model';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cita-list-component.html',
})
export class CitaListComponent {
  private readonly citaService = inject(CitaService);

  readonly citas = signal<CitaMedica[]>([]);
  readonly filtroPrioridad = signal('TODAS');
  readonly cargando = signal(false);
  readonly error = signal('');

  readonly prioridades = [
    'TODAS',
    'ALTA',
    'MEDIA',
    'BAJA'
  ];

  readonly citasFiltradas = computed(() => {
    const filtro = this.filtroPrioridad();
    const lista = this.citas();

    if (filtro === 'TODAS') {
      return lista;
    }

    return lista.filter(cita =>
      cita.nivelPrioridad?.toUpperCase() === filtro
    );
  });

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando.set(true);
    this.error.set('');

    this.citaService.getCitas().subscribe({
      next: citas => {
        this.citas.set(citas ?? []);
        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al cargar las citas:', error);

        this.error.set(
          'No se pudieron cargar las citas.'
        );

        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(prioridad: string): void {
    this.filtroPrioridad.set(prioridad);
  }

  avanzarEstado(cita: CitaMedica): void {
    const siguienteEstado =
      this.obtenerSiguienteEstado(cita.estado);

    if (!siguienteEstado) {
      return;
    }

    this.citaService
      .actualizarEstado(cita.id, siguienteEstado)
      .subscribe({
        next: citaActualizada => {
          this.citas.update(lista =>
            lista.map(item =>
              item.id === citaActualizada.id
                ? citaActualizada
                : item
            )
          );
        },
        error: error => {
          console.error(
            'Error al actualizar el estado:',
            error
          );
        }
      });
  }

  obtenerSiguienteEstado(
    estado: string
  ): string | null {
    const estados = [
      'PENDIENTE',
      'EN_ATENCION',
      'ATENDIDA'
    ];

    const estadoActual = estado?.toUpperCase();
    const posicion = estados.indexOf(estadoActual);

    if (
      posicion === -1 ||
      posicion === estados.length - 1
    ) {
      return null;
    }

    return estados[posicion + 1];
  }

  clasePrioridad(prioridad: string): string {
    return prioridad
      ?.toLowerCase()
      .replaceAll(' ', '-') ?? '';
  }

  claseEstado(estado: string): string {
    return estado
      ?.toLowerCase()
      .replaceAll('_', '-') ?? '';
  }
}
