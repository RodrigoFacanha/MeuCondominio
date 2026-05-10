package com.zeladoria.backend_zeladoria.repository;

import com.zeladoria.backend_zeladoria.model.Chamado;
import com.zeladoria.backend_zeladoria.model.StatusChamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {
    
    List<Chamado> findByMoradorId(Integer moradorId);
    
    List<Chamado> findByStatus(StatusChamado status);
}