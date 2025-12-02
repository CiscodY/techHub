package com.utp.compre.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.utp.compre.model.Usuario;
import com.utp.compre.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    
    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public Object login(@RequestBody Usuario loginRequest) {

        Usuario user = usuarioRepo.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return "Usuario no encontrado";
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return "Contraseña incorrecta";
        }

        // Eliminamos el password antes de devolverlo
        user.setPassword(null);

        return user;
    }
}
