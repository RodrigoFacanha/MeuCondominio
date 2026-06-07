package com.zeladoria.backend_zeladoria.controller;

import com.zeladoria.backend_zeladoria.model.Chamado;
import com.zeladoria.backend_zeladoria.model.StatusChamado;
import com.zeladoria.backend_zeladoria.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chamados")
@CrossOrigin(origins = "*")
public class ChamadoController {

    @Autowired
    private ChamadoService chamadoService;

    @PostMapping
    public ResponseEntity<Chamado> criar(@RequestBody Chamado chamado) {
        return ResponseEntity.ok(chamadoService.criarChamado(chamado));
    }

    @GetMapping
    public ResponseEntity<List<Chamado>> listarTodos() {
        return ResponseEntity.ok(chamadoService.listarTodos());
    }

    @GetMapping("/morador/{id}")
    public ResponseEntity<List<Chamado>> listarPorMorador(@PathVariable Integer id) {
        return ResponseEntity.ok(chamadoService.listarPorMorador(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Chamado> atualizarStatus(
            @PathVariable Integer id, 
            @RequestBody StatusChamado novoStatus) {
        return ResponseEntity.ok(chamadoService.atualizarStatus(id, novoStatus));
    }
}