package com.utp.compre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utp.compre.model.Resena;
import com.utp.compre.model.Usuario;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer>{
    
    List<Resena> findByUsuario(Usuario usuario);

    List<Resena> findByProductoApiId(String productoApiId);
}
