package com.zeladoria.backend_zeladoria.service;

import com.zeladoria.backend_zeladoria.model.Morador;
import com.zeladoria.backend_zeladoria.repository.MoradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MoradorService {

    @Autowired
    private MoradorRepository moradorRepository;

    public Morador salvar(Morador morador) {
        return moradorRepository.save(morador);
    }

    public List<Morador> listarTodos() {
        return moradorRepository.findAll();
    }

    public Optional<Morador> buscarPorEmail(String email) {
        return moradorRepository.findByEmail(email);
    }
}