import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../enviroments/enviroment';
import {
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

  getCitasPorPrioridad(prioridad: string): Observable<CitaMedica[]> {
    const params = new HttpParams().set('prioridad', prioridad);

    return this.http.get<CitaMedica[]>(
      `${this.apiUrl}/prioridad`,
      { params }
    );
  }

  actualizarEstado(
    id: number,
    estado: string
  ): Observable<CitaMedica> {
    return this.http.patch<CitaMedica>(
      `${this.apiUrl}/${id}/estado`,
      { estado }
    );
  }

  crearCita(payload: CrearCitaPayload): Observable<CitaMedica> {
    return this.http.post<CitaMedica>(
      this.apiUrl,
      payload
    );
  }
}
