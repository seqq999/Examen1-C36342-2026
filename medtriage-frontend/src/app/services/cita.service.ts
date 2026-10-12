import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../enviroments/enviroment';

import {
  ActualizarEstadoPayload,
  CitaMedica,
  CrearCitaPayload
} from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.API_URL}citas`;

  getCitas(): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(this.apiUrl);
  }

  getCitasPorPrioridad(
    prioridad: string
  ): Observable<CitaMedica[]> {
    return this.http.get<CitaMedica[]>(
      `${this.apiUrl}/prioridad/${prioridad}`
    );
  }

  crearCita(
    payload: CrearCitaPayload
  ): Observable<CitaMedica> {
    return this.http.post<CitaMedica>(
      this.apiUrl,
      payload
    );
  }

  actualizarEstado(
    id: number,
    nuevoEstado: string
  ): Observable<CitaMedica> {
    const payload: ActualizarEstadoPayload = {
      nuevoEstado
    };

    return this.http.patch<CitaMedica>(
      `${this.apiUrl}/${id}/estado`,
      payload
    );
  }
}
