package com.utp.compre.service;

import java.util.List;

import com.utp.compre.model.Usuario;

public interface UsuarioService {

    Usuario registrar(Usuario usuario);

    Usuario buscarporId(Integer id);

    Usuario buscarPorEmail(String email);

    List<Usuario> listarUsuarios();

    void eliminar(Integer id);
}