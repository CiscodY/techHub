package com.utp.compre.service;

import java.util.List;

import com.utp.compre.model.Alerta;

public interface AlertaService {

    Alerta crearAlerta(Alerta alerta);

    List<Alerta> listarAlertasUsuario(Integer usuarioId);

    void desactivarAlerta(Integer alertaId);

    void eliminarAlerta(Integer alertaId);
}