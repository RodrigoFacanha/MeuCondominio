package com.zeladoria.backend_zeladoria.controller;

import com.zeladoria.backend_zeladoria.LoginRequest;
import com.zeladoria.backend_zeladoria.repository.MoradorRepository;
import com.zeladoria.backend_zeladoria.repository.SindicoZeladorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    public record LoginResponse(String token, Object usuario) {}

    private final MoradorRepository moradorRepository;
    private final SindicoZeladorRepository sindicosZeladoresRepository;

    public AuthController(MoradorRepository moradorRepository, SindicoZeladorRepository sindicosZeladoresRepository) {
        this.moradorRepository = moradorRepository;
        this.sindicosZeladoresRepository = sindicosZeladoresRepository;
    }

    @PostMapping("/morador/login")
    public ResponseEntity<?> loginMorador(@RequestBody LoginRequest request) {
        var morador = moradorRepository.findByEmailAndSenha(request.email(), request.senha());
        
        if (morador.isPresent()) {
            return ResponseEntity.ok(new LoginResponse("token-provisorio-morador", morador.get()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
    }

    @PostMapping("/sindico/login")
    public ResponseEntity<?> loginSindico(@RequestBody LoginRequest request) {
        var sindico = sindicosZeladoresRepository.findByEmailAndSenha(request.email(), request.senha());
        
        if (sindico.isPresent()) {
            return ResponseEntity.ok(new LoginResponse("token-provisorio-sindico", sindico.get()));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
    }
}