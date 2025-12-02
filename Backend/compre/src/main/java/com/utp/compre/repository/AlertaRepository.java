package com.utp.compre.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.utp.compre.model.Alerta;
import com.utp.compre.model.Usuario;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta,Integer>{
    
    List<Alerta> findByUsuarioAndActivo(Usuario usuario, Boolean activo);

    List<Alerta> findByProductoApiId(String productoApiId);
}
