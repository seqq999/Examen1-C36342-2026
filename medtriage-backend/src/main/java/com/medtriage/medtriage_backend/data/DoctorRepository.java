package com.medtriage.medtriage_backend.data;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medtriage.medtriage_backend.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
}
