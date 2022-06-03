package co.edu.sena.repository;

import co.edu.sena.domain.ClaseFicha;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ClaseFicha entity.
 */
@Repository
public interface ClaseFichaRepository extends JpaRepository<ClaseFicha, Long> {
    default Optional<ClaseFicha> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ClaseFicha> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ClaseFicha> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct claseFicha from ClaseFicha claseFicha left join fetch claseFicha.ficha left join fetch claseFicha.clase",
        countQuery = "select count(distinct claseFicha) from ClaseFicha claseFicha"
    )
    Page<ClaseFicha> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct claseFicha from ClaseFicha claseFicha left join fetch claseFicha.ficha left join fetch claseFicha.clase")
    List<ClaseFicha> findAllWithToOneRelationships();

    @Query(
        "select claseFicha from ClaseFicha claseFicha left join fetch claseFicha.ficha left join fetch claseFicha.clase where claseFicha.id =:id"
    )
    Optional<ClaseFicha> findOneWithToOneRelationships(@Param("id") Long id);
}
