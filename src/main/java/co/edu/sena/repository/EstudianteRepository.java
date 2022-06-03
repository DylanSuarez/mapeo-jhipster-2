package co.edu.sena.repository;

import co.edu.sena.domain.Estudiante;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Estudiante entity.
 */
@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {
    default Optional<Estudiante> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Estudiante> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Estudiante> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct estudiante from Estudiante estudiante left join fetch estudiante.customer left join fetch estudiante.programadeformacion left join fetch estudiante.trimestre left join fetch estudiante.ficha",
        countQuery = "select count(distinct estudiante) from Estudiante estudiante"
    )
    Page<Estudiante> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct estudiante from Estudiante estudiante left join fetch estudiante.customer left join fetch estudiante.programadeformacion left join fetch estudiante.trimestre left join fetch estudiante.ficha"
    )
    List<Estudiante> findAllWithToOneRelationships();

    @Query(
        "select estudiante from Estudiante estudiante left join fetch estudiante.customer left join fetch estudiante.programadeformacion left join fetch estudiante.trimestre left join fetch estudiante.ficha where estudiante.id =:id"
    )
    Optional<Estudiante> findOneWithToOneRelationships(@Param("id") Long id);
}
