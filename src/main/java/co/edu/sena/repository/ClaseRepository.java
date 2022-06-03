package co.edu.sena.repository;

import co.edu.sena.domain.Clase;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Clase entity.
 */
@Repository
public interface ClaseRepository extends JpaRepository<Clase, Long> {
    default Optional<Clase> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Clase> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Clase> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct clase from Clase clase left join fetch clase.trimestre",
        countQuery = "select count(distinct clase) from Clase clase"
    )
    Page<Clase> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct clase from Clase clase left join fetch clase.trimestre")
    List<Clase> findAllWithToOneRelationships();

    @Query("select clase from Clase clase left join fetch clase.trimestre where clase.id =:id")
    Optional<Clase> findOneWithToOneRelationships(@Param("id") Long id);
}
