package co.edu.sena.repository;

import co.edu.sena.domain.ClaseDocente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClaseDocente entity.
 */
@Repository
public interface ClaseDocenteRepository extends JpaRepository<ClaseDocente, Long> {
    default Optional<ClaseDocente> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ClaseDocente> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ClaseDocente> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct claseDocente from ClaseDocente claseDocente left join fetch claseDocente.horario left join fetch claseDocente.clase",
        countQuery = "select count(distinct claseDocente) from ClaseDocente claseDocente"
    )
    Page<ClaseDocente> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct claseDocente from ClaseDocente claseDocente left join fetch claseDocente.horario left join fetch claseDocente.clase"
    )
    List<ClaseDocente> findAllWithToOneRelationships();

    @Query(
        "select claseDocente from ClaseDocente claseDocente left join fetch claseDocente.horario left join fetch claseDocente.clase where claseDocente.id =:id"
    )
    Optional<ClaseDocente> findOneWithToOneRelationships(@Param("id") Long id);
}
