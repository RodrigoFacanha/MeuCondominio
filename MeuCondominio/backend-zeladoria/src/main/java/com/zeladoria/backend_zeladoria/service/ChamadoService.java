package com.zeladoria.backend_zeladoria.service;

import com.zeladoria.backend_zeladoria.model.Chamado;
import com.zeladoria.backend_zeladoria.model.Morador;
import com.zeladoria.backend_zeladoria.model.StatusChamado;
import com.zeladoria.backend_zeladoria.repository.ChamadoRepository;
import com.zeladoria.backend_zeladoria.repository.MoradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository chamadoRepository;

    @Autowired
    private MoradorRepository moradorRepository;

    public Chamado criarChamado(Chamado chamado) {
        if (chamado.getMorador() != null && chamado.getMorador().getId() != null) {
            Morador moradorReal = moradorRepository.findById(chamado.getMorador().getId())
                    .orElseThrow(() -> new RuntimeException("Morador não encontrado no banco de dados."));
            
            chamado.setMorador(moradorReal);
        }

        chamado.setStatus(StatusChamado.ABERTO);
        return chamadoRepository.save(chamado);
    }

    public List<Chamado> listarPorMorador(Integer moradorId) {
        return chamadoRepository.findByMoradorId(moradorId);
    }

    public List<Chamado> listarTodos() {
        return chamadoRepository.findAll();
    }

    public Chamado atualizarStatus(Integer chamadoId, StatusChamado novoStatus) {
        Chamado chamado = chamadoRepository.findById(chamadoId)
                .orElseThrow(() -> new RuntimeException("Chamado não encontrado"));
        
        chamado.setStatus(novoStatus);
        return chamadoRepository.save(chamado);
    }
}