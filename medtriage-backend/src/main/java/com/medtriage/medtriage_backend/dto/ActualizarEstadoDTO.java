package com.medtriage.medtriage_backend.dto;

public class ActualizarEstadoDTO {

    private String nuevoEstado;

    public ActualizarEstadoDTO() {
    }

    public String getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }
}