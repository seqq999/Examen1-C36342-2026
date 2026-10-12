package com.medtriage.medtriage_backend.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medtriage.medtriage_backend.model.CitaMedica;

import java.util.List;

public interface CitaMedicaRepository extends JpaRepository<CitaMedica, Long> {

    List<CitaMedica> findByNivelPrioridadOrderByFechaCitaDesc(String nivelPrioridad);

    List<CitaMedica> findAllByOrderByFechaCitaDesc();

    boolean existsByCodigoCita(String codigoCita);
}