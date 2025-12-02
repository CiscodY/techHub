package com.utp.compre.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "resena")
public class Resena {
    
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY) 
   private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @NotNull(message = "Usuario es obligatorio")
    private Usuario usuario;

    @Column(name = "producto_api_id")
    @NotBlank(message = "ProductoApiId es obligatorio")
    private String productoApiId;

    @NotBlank(message = "Comentario no puede estar vacio")
    private String comentario;

    @NotNull(message = "Puntuacion es obligatoria")
    @Min(value = 1, message = "La puntuacion minima es 1")
    @Max(value = 5, message = "La puntuacion maxima es 5")
    private Integer puntuacion;
    
    private LocalDateTime fecha = LocalDateTime.now();
}
