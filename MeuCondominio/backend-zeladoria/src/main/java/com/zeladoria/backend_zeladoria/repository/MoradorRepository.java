package com.zeladoria.backend_zeladoria.repository;

import com.zeladoria.backend_zeladoria.model.Morador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MoradorRepository extends JpaRepository<Morador, Integer> {
    
    Optional<Morador> findByEmail(String email);
    Optional<Morador> findByEmailAndSenha(String email, String senha);
}