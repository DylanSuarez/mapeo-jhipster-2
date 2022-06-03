package co.edu.sena.repository;

import co.edu.sena.domain.ClaseProgramaDeFormacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClaseProgramaDeFormacion entity.
 */
@Repository
public interface ClaseProgramaDeFormacionRepository extends JpaRepository<ClaseProgramaDeFormacion, Long> {
    default Optional<ClaseProgramaDeFormacion> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ClaseProgramaDeFormacion> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ClaseProgramaDeFormacion> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct claseProgramaDeFormacion from ClaseProgramaDeFormacion claseProgramaDeFormacion left join fetch claseProgramaDeFormacion.programadeformacion",
        countQuery = "select count(distinct claseProgramaDeFormacion) from ClaseProgramaDeFormacion claseProgramaDeFormacion"
    )
    Page<ClaseProgramaDeFormacion> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct claseProgramaDeFormacion from ClaseProgramaDeFormacion claseProgramaDeFormacion left join fetch claseProgramaDeFormacion.programadeformacion"
    )
    List<ClaseProgramaDeFormacion> findAllWithToOneRelationships();

    @Query(
        "select claseProgramaDeFormacion from ClaseProgramaDeFormacion claseProgramaDeFormacion left join fetch claseProgramaDeFormacion.programadeformacion where claseProgramaDeFormacion.id =:id"
    )
    Optional<ClaseProgramaDeFormacion> findOneWithToOneRelationships(@Param("id") Long id);
}
