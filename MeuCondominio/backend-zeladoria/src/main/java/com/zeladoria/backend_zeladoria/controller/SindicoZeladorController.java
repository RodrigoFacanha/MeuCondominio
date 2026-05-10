package com.zeladoria.backend_zeladoria.controller;

import com.zeladoria.backend_zeladoria.model.SindicoZelador;
import com.zeladoria.backend_zeladoria.service.SindicoZeladorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sindicos")
public class SindicoZeladorController {

    @Autowired
    private SindicoZeladorService service;

    @PostMapping
    public ResponseEntity<SindicoZelador> criar(@RequestBody SindicoZelador usuario) {
        return ResponseEntity.ok(service.salvar(usuario));
    }

    @GetMapping
    public ResponseEntity<List<SindicoZelador>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }
}