package co.edu.sena.repository;

import co.edu.sena.domain.EstudianteHorario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EstudianteHorario entity.
 */
@Repository
public interface EstudianteHorarioRepository extends JpaRepository<EstudianteHorario, Long> {
    default Optional<EstudianteHorario> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<EstudianteHorario> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<EstudianteHorario> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct estudianteHorario from EstudianteHorario estudianteHorario left join fetch estudianteHorario.estudiante left join fetch estudianteHorario.horario",
        countQuery = "select count(distinct estudianteHorario) from EstudianteHorario estudianteHorario"
    )
    Page<EstudianteHorario> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct estudianteHorario from EstudianteHorario estudianteHorario left join fetch estudianteHorario.estudiante left join fetch estudianteHorario.horario"
    )
    List<EstudianteHorario> findAllWithToOneRelationships();

    @Query(
        "select estudianteHorario from EstudianteHorario estudianteHorario left join fetch estudianteHorario.estudiante left join fetch estudianteHorario.horario where estudianteHorario.id =:id"
    )
    Optional<EstudianteHorario> findOneWithToOneRelationships(@Param("id") Long id);
}
