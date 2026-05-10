package com.zeladoria.backend_zeladoria.controller;

import com.zeladoria.backend_zeladoria.model.Morador;
import com.zeladoria.backend_zeladoria.service.MoradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moradores")
public class MoradorController {

    @Autowired
    private MoradorService moradorService;

    @PostMapping
    public ResponseEntity<Morador> criar(@RequestBody Morador morador) {
        return ResponseEntity.ok(moradorService.salvar(morador));
    }

    @GetMapping
    public ResponseEntity<List<Morador>> listarTodos() {
        return ResponseEntity.ok(moradorService.listarTodos());
    }
}