package com.medtriage.medtriage_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medtriage.medtriage_backend.dto.ActualizarEstadoDTO;
import com.medtriage.medtriage_backend.dto.CitaMedicaDTO;
import com.medtriage.medtriage_backend.dto.CrearCitaDTO;
import com.medtriage.medtriage_backend.services.CitaMedicaService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/citas")
@CrossOrigin(origins = "http://localhost:4200")
public class CitaMedicaController {

    private final CitaMedicaService citaMedicaService;

    public CitaMedicaController(CitaMedicaService citaMedicaService) {
        this.citaMedicaService = citaMedicaService;
    }

    @GetMapping
    public ResponseEntity<List<CitaMedicaDTO>> obtenerTodas() {
        return ResponseEntity.ok(
                citaMedicaService.obtenerTodas());
    }

    @GetMapping("/prioridad/{prioridad}")
    public ResponseEntity<List<CitaMedicaDTO>> obtenerPorPrioridad(
            @PathVariable String prioridad) {
        return ResponseEntity.ok(
                citaMedicaService.obtenerPorPrioridad(prioridad));
    }

    @PostMapping
    public ResponseEntity<CitaMedicaDTO> crearCita(
            @RequestBody CrearCitaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(citaMedicaService.crearCita(dto));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CitaMedicaDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestBody ActualizarEstadoDTO dto) {
        return ResponseEntity.ok(
                citaMedicaService.actualizarEstado(
                        id,
                        dto.getNuevoEstado()));
    }
}