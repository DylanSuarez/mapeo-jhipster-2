package co.edu.sena.repository;

import co.edu.sena.domain.Regional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Regional entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegionalRepository extends JpaRepository<Regional, Long> {}
