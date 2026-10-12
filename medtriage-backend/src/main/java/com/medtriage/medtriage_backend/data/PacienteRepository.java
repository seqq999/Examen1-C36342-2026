package com.medtriage.medtriage_backend.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medtriage.medtriage_backend.model.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

}
