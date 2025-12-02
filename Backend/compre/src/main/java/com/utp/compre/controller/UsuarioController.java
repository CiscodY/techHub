package com.utp.compre.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utp.compre.model.Usuario;
import com.utp.compre.repository.UsuarioRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final PasswordEncoder passwordEncoder;
    

    @Autowired
    private UsuarioRepository usuarioRepo;

    UsuarioController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@Valid @RequestBody Usuario usuario, BindingResult result){
        if (result.hasErrors()) {
            List<String> errores = result.getAllErrors()
                                        .stream()
                                        .map(e -> e.getDefaultMessage())
                                        .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errores);
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return ResponseEntity.ok(usuarioRepo.save(usuario));
    }

    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Integer id){
        return usuarioRepo.findById(id).orElse(null);
    }

    @GetMapping("/email/{email}")
    public Usuario buscarPorEmail(@PathVariable String email){
        return usuarioRepo.findByEmail(email);
    }

    @GetMapping("/listar")
    public List<Usuario> listar(){
        return usuarioRepo.findAll();
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id){
        usuarioRepo.deleteById(id);
    }
}
