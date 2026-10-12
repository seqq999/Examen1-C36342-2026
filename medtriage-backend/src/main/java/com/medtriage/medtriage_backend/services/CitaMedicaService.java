package com.medtriage.medtriage_backend.services;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medtriage.medtriage_backend.data.CitaMedicaRepository;
import com.medtriage.medtriage_backend.data.DoctorRepository;
import com.medtriage.medtriage_backend.data.PacienteRepository;
import com.medtriage.medtriage_backend.dto.CitaMedicaDTO;
import com.medtriage.medtriage_backend.dto.CrearCitaDTO;
import com.medtriage.medtriage_backend.model.CitaMedica;
import com.medtriage.medtriage_backend.model.Doctor;
import com.medtriage.medtriage_backend.model.Paciente;

@Service
public class CitaMedicaService {

    private final CitaMedicaRepository citaMedicaRepository;
    private final PacienteRepository pacienteRepository;
    private final DoctorRepository doctorRepository;

    private final SecureRandom random = new SecureRandom();

    public CitaMedicaService(
            CitaMedicaRepository citaMedicaRepository,
            PacienteRepository pacienteRepository,
            DoctorRepository doctorRepository) {
        this.citaMedicaRepository = citaMedicaRepository;
        this.pacienteRepository = pacienteRepository;
        this.doctorRepository = doctorRepository;
    }

    @Transactional(readOnly = true)
    public List<CitaMedicaDTO> obtenerTodas() {
        return citaMedicaRepository
                .findAllByOrderByFechaCitaDesc()
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CitaMedicaDTO> obtenerPorPrioridad(String prioridad) {
        String nivelPrioridad = convertirPrioridad(prioridad);
        return citaMedicaRepository
                .findByNivelPrioridadOrderByFechaCitaDesc(nivelPrioridad)
                .stream()
                .map(this::convertirADTO)
                .toList();
    }

    public CitaMedicaDTO crearCita(CrearCitaDTO dto) {
        if (dto == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los datos de la cita son obligatorios");
        }

        if (dto.getPacienteId() == null || dto.getDoctorId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El paciente y el doctor son obligatorios");
        }

        if (dto.getNivelPrioridad() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nivel de prioridad es obligatorio");
        }

        if (dto.getMotivoConsulta() == null
                || dto.getMotivoConsulta().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El motivo de consulta es obligatorio");
        }

        if (dto.getMontoConsulta() == null
                || dto.getMontoConsulta().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El monto de consulta no es válido");
        }

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Paciente no encontrado"));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Doctor no encontrado"));

        if (!Boolean.TRUE.equals(doctor.getDisponible())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El doctor no está disponible");
        }

        CitaMedica cita = new CitaMedica();
        cita.setCodigoCita(generarCodigoCita());
        cita.setPaciente(paciente);
        cita.setDoctor(doctor);
        cita.setNivelPrioridad(dto.getNivelPrioridad());
        cita.setMotivoConsulta(dto.getMotivoConsulta());
        cita.setMontoConsulta(dto.getMontoConsulta());
        cita.setEstado("PENDIENTE");
        cita.setFechaCita(LocalDateTime.now());

        return convertirADTO(citaMedicaRepository.save(cita));
    }

    public CitaMedicaDTO actualizarEstado(Long id, String nuevoEstado) {
        if (id == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El id de la cita es obligatorio");
        }

        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nuevo estado es obligatorio");
        }

        String estado = nuevoEstado.trim().toUpperCase();

        if (!estado.equals("EN_ATENCION")
                && !estado.equals("ATENDIDA")
                && !estado.equals("CANCELADA")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El estado debe ser EN_ATENCION, ATENDIDA o CANCELADA");
        }

        CitaMedica cita = citaMedicaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cita médica no encontrada"));

        cita.setEstado(estado);

        return convertirADTO(citaMedicaRepository.save(cita));
    }

    private String generarCodigoCita() {
        String codigo;

        do {
            int numero = random.nextInt(10_000);
            codigo = String.format("CIT-2026-%04d", numero);
        } while (citaMedicaRepository.existsByCodigoCita(codigo));

        return codigo;
    }

    private String convertirPrioridad(String prioridad) {
        if (prioridad == null || prioridad.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La prioridad es obligatoria");
        }

        String prioridadConvertida = prioridad.trim().toUpperCase();

        if (!prioridadConvertida.equals("ALTA")
                && !prioridadConvertida.equals("MEDIA")
                && !prioridadConvertida.equals("BAJA")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La prioridad debe ser ALTA, MEDIA o BAJA");
        }

        return prioridadConvertida;
    }

    private CitaMedicaDTO convertirADTO(CitaMedica cita) {
        CitaMedicaDTO dto = new CitaMedicaDTO();

        dto.setId(cita.getId());
        dto.setCodigoCita(cita.getCodigoCita());
        dto.setNombrePaciente(cita.getPaciente().getNombreCompleto());
        dto.setNombreDoctor(cita.getDoctor().getNombre());
        dto.setNivelPrioridad(cita.getNivelPrioridad());
        dto.setMotivoConsulta(cita.getMotivoConsulta());
        dto.setEstado(cita.getEstado());
        dto.setMontoConsulta(cita.getMontoConsulta());
        dto.setFechaCita(cita.getFechaCita());

        return dto;
    }
}