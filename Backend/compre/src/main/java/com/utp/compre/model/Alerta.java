package com.utp.compre.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "alerta")
public class Alerta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @NotNull(message = "Usuario es obligatorio")
    private Usuario usuario;

    @Column(name = "producto_api_id")
    @NotNull(message = "ProductoApiId es obligatorio")
    private String productoApiId;

    @Column(name = "precio_objetivo")
    @NotNull(message = "Precio objetivo es obligatorio")
    private Double precioObjetivo;

    private Boolean activo = true;
}
