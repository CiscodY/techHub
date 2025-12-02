package com.utp.compre.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utp.compre.model.Alerta;
import com.utp.compre.model.Usuario;
import com.utp.compre.repository.AlertaRepository;
import com.utp.compre.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/alerta")
public class AlertaController {
    @Autowired
    private AlertaRepository alertaRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@Valid @RequestBody Alerta alerta, BindingResult result) {
        if (result.hasErrors()) {
            List<String> errores = result.getAllErrors()
                                        .stream()
                                        .map(e -> e.getDefaultMessage())
                                        .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errores);
        }
        return ResponseEntity.ok(alertaRepo.save(alerta));
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Alerta> listarPorUsuario(@PathVariable Integer usuarioId) {
        Usuario user = usuarioRepo.findById(usuarioId).orElse(null);
        return alertaRepo.findByUsuarioAndActivo(user, true);
    }

    @PutMapping("/desactivar/{id}")
    public void desactivar(@PathVariable Integer id) {
        Alerta alerta = alertaRepo.findById(id).orElse(null);
        if (alerta != null) {
            alerta.setActivo(false);
            alertaRepo.save(alerta);
        }
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        alertaRepo.deleteById(id);
    }
}
