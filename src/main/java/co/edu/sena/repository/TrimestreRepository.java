package co.edu.sena.repository;

import co.edu.sena.domain.Trimestre;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Trimestre entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TrimestreRepository extends JpaRepository<Trimestre, Long> {}
