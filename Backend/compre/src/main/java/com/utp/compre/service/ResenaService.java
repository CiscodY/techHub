package com.utp.compre.service;

import java.util.List;

import com.utp.compre.model.Resena;

public interface ResenaService {
    Resena crearReseña(Resena reseña);

    List<Resena> listarPorProducto(String productoApiId);

    List<Resena> listarPorUsuario(Integer usuarioId);

    void eliminarReseña(Integer id);
}
