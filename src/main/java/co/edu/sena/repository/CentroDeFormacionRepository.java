package co.edu.sena.repository;

import co.edu.sena.domain.CentroDeFormacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CentroDeFormacion entity.
 */
@Repository
public interface CentroDeFormacionRepository extends JpaRepository<CentroDeFormacion, Long> {
    default Optional<CentroDeFormacion> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CentroDeFormacion> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CentroDeFormacion> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct centroDeFormacion from CentroDeFormacion centroDeFormacion left join fetch centroDeFormacion.regional",
        countQuery = "select count(distinct centroDeFormacion) from CentroDeFormacion centroDeFormacion"
    )
    Page<CentroDeFormacion> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct centroDeFormacion from CentroDeFormacion centroDeFormacion left join fetch centroDeFormacion.regional")
    List<CentroDeFormacion> findAllWithToOneRelationships();

    @Query(
        "select centroDeFormacion from CentroDeFormacion centroDeFormacion left join fetch centroDeFormacion.regional where centroDeFormacion.id =:id"
    )
    Optional<CentroDeFormacion> findOneWithToOneRelationships(@Param("id") Long id);
}
