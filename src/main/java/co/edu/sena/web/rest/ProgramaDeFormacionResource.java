package co.edu.sena.web.rest;

import co.edu.sena.domain.ProgramaDeFormacion;
import co.edu.sena.repository.ProgramaDeFormacionRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.ProgramaDeFormacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProgramaDeFormacionResource {

    private final Logger log = LoggerFactory.getLogger(ProgramaDeFormacionResource.class);

    private static final String ENTITY_NAME = "programaDeFormacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProgramaDeFormacionRepository programaDeFormacionRepository;

    public ProgramaDeFormacionResource(ProgramaDeFormacionRepository programaDeFormacionRepository) {
        this.programaDeFormacionRepository = programaDeFormacionRepository;
    }

    /**
     * {@code POST  /programa-de-formacions} : Create a new programaDeFormacion.
     *
     * @param programaDeFormacion the programaDeFormacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new programaDeFormacion, or with status {@code 400 (Bad Request)} if the programaDeFormacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/programa-de-formacions")
    public ResponseEntity<ProgramaDeFormacion> createProgramaDeFormacion(@Valid @RequestBody ProgramaDeFormacion programaDeFormacion)
        throws URISyntaxException {
        log.debug("REST request to save ProgramaDeFormacion : {}", programaDeFormacion);
        if (programaDeFormacion.getId() != null) {
            throw new BadRequestAlertException("A new programaDeFormacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProgramaDeFormacion result = programaDeFormacionRepository.save(programaDeFormacion);
        return ResponseEntity
            .created(new URI("/api/programa-de-formacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /programa-de-formacions/:id} : Updates an existing programaDeFormacion.
     *
     * @param id the id of the programaDeFormacion to save.
     * @param programaDeFormacion the programaDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated programaDeFormacion,
     * or with status {@code 400 (Bad Request)} if the programaDeFormacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the programaDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/programa-de-formacions/{id}")
    public ResponseEntity<ProgramaDeFormacion> updateProgramaDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProgramaDeFormacion programaDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to update ProgramaDeFormacion : {}, {}", id, programaDeFormacion);
        if (programaDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, programaDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!programaDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProgramaDeFormacion result = programaDeFormacionRepository.save(programaDeFormacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, programaDeFormacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /programa-de-formacions/:id} : Partial updates given fields of an existing programaDeFormacion, field will ignore if it is null
     *
     * @param id the id of the programaDeFormacion to save.
     * @param programaDeFormacion the programaDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated programaDeFormacion,
     * or with status {@code 400 (Bad Request)} if the programaDeFormacion is not valid,
     * or with status {@code 404 (Not Found)} if the programaDeFormacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the programaDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/programa-de-formacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProgramaDeFormacion> partialUpdateProgramaDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProgramaDeFormacion programaDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProgramaDeFormacion partially : {}, {}", id, programaDeFormacion);
        if (programaDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, programaDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!programaDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProgramaDeFormacion> result = programaDeFormacionRepository
            .findById(programaDeFormacion.getId())
            .map(existingProgramaDeFormacion -> {
                if (programaDeFormacion.getNombrePrograma() != null) {
                    existingProgramaDeFormacion.setNombrePrograma(programaDeFormacion.getNombrePrograma());
                }
                if (programaDeFormacion.getEstadoPrograma() != null) {
                    existingProgramaDeFormacion.setEstadoPrograma(programaDeFormacion.getEstadoPrograma());
                }

                return existingProgramaDeFormacion;
            })
            .map(programaDeFormacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, programaDeFormacion.getId().toString())
        );
    }

    /**
     * {@code GET  /programa-de-formacions} : get all the programaDeFormacions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of programaDeFormacions in body.
     */
    @GetMapping("/programa-de-formacions")
    public List<ProgramaDeFormacion> getAllProgramaDeFormacions(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ProgramaDeFormacions");
        return programaDeFormacionRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /programa-de-formacions/:id} : get the "id" programaDeFormacion.
     *
     * @param id the id of the programaDeFormacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the programaDeFormacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/programa-de-formacions/{id}")
    public ResponseEntity<ProgramaDeFormacion> getProgramaDeFormacion(@PathVariable Long id) {
        log.debug("REST request to get ProgramaDeFormacion : {}", id);
        Optional<ProgramaDeFormacion> programaDeFormacion = programaDeFormacionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(programaDeFormacion);
    }

    /**
     * {@code DELETE  /programa-de-formacions/:id} : delete the "id" programaDeFormacion.
     *
     * @param id the id of the programaDeFormacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/programa-de-formacions/{id}")
    public ResponseEntity<Void> deleteProgramaDeFormacion(@PathVariable Long id) {
        log.debug("REST request to delete ProgramaDeFormacion : {}", id);
        programaDeFormacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
