package co.edu.sena.repository;

import co.edu.sena.domain.Ficha;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ficha entity.
 */
@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {
    default Optional<Ficha> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Ficha> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Ficha> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct ficha from Ficha ficha left join fetch ficha.programadeformacion",
        countQuery = "select count(distinct ficha) from Ficha ficha"
    )
    Page<Ficha> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct ficha from Ficha ficha left join fetch ficha.programadeformacion")
    List<Ficha> findAllWithToOneRelationships();

    @Query("select ficha from Ficha ficha left join fetch ficha.programadeformacion where ficha.id =:id")
    Optional<Ficha> findOneWithToOneRelationships(@Param("id") Long id);
}
