package com.petcare.repositories;

import com.petcare.models.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {

    List<Evidencia> findByAtencion_AtencionId(Integer atencionId);
}