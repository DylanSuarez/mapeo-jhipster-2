package co.edu.sena.repository;

import co.edu.sena.domain.ProgramaDeFormacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProgramaDeFormacion entity.
 */
@Repository
public interface ProgramaDeFormacionRepository extends JpaRepository<ProgramaDeFormacion, Long> {
    default Optional<ProgramaDeFormacion> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ProgramaDeFormacion> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ProgramaDeFormacion> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct programaDeFormacion from ProgramaDeFormacion programaDeFormacion left join fetch programaDeFormacion.centroDeFormacion left join fetch programaDeFormacion.clase",
        countQuery = "select count(distinct programaDeFormacion) from ProgramaDeFormacion programaDeFormacion"
    )
    Page<ProgramaDeFormacion> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct programaDeFormacion from ProgramaDeFormacion programaDeFormacion left join fetch programaDeFormacion.centroDeFormacion left join fetch programaDeFormacion.clase"
    )
    List<ProgramaDeFormacion> findAllWithToOneRelationships();

    @Query(
        "select programaDeFormacion from ProgramaDeFormacion programaDeFormacion left join fetch programaDeFormacion.centroDeFormacion left join fetch programaDeFormacion.clase where programaDeFormacion.id =:id"
    )
    Optional<ProgramaDeFormacion> findOneWithToOneRelationships(@Param("id") Long id);
}
