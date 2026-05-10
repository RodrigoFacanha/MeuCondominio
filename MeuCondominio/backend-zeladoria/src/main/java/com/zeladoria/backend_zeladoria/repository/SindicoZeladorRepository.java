package com.zeladoria.backend_zeladoria.repository;

import com.zeladoria.backend_zeladoria.model.SindicoZelador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SindicoZeladorRepository extends JpaRepository<SindicoZelador, Integer> {
    
    Optional<SindicoZelador> findByEmail(String email);
}