package co.edu.sena.repository;

import co.edu.sena.domain.Horario;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Horario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HorarioRepository extends JpaRepository<Horario, Long> {}
