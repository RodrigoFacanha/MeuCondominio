package com.zeladoria.backend_zeladoria.service;

import com.zeladoria.backend_zeladoria.model.SindicoZelador;
import com.zeladoria.backend_zeladoria.repository.SindicoZeladorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SindicoZeladorService {

    @Autowired
    private SindicoZeladorRepository repository;

    public SindicoZelador salvar(SindicoZelador usuario) {
        return repository.save(usuario);
    }

    public List<SindicoZelador> listarTodos() {
        return repository.findAll();
    }

    public Optional<SindicoZelador> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }
}