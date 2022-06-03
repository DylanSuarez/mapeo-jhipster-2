package co.edu.sena.web.rest;

import co.edu.sena.domain.ClaseProgramaDeFormacion;
import co.edu.sena.repository.ClaseProgramaDeFormacionRepository;
import co.edu.sena.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link co.edu.sena.domain.ClaseProgramaDeFormacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClaseProgramaDeFormacionResource {

    private final Logger log = LoggerFactory.getLogger(ClaseProgramaDeFormacionResource.class);

    private static final String ENTITY_NAME = "claseProgramaDeFormacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClaseProgramaDeFormacionRepository claseProgramaDeFormacionRepository;

    public ClaseProgramaDeFormacionResource(ClaseProgramaDeFormacionRepository claseProgramaDeFormacionRepository) {
        this.claseProgramaDeFormacionRepository = claseProgramaDeFormacionRepository;
    }

    /**
     * {@code POST  /clase-programa-de-formacions} : Create a new claseProgramaDeFormacion.
     *
     * @param claseProgramaDeFormacion the claseProgramaDeFormacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new claseProgramaDeFormacion, or with status {@code 400 (Bad Request)} if the claseProgramaDeFormacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clase-programa-de-formacions")
    public ResponseEntity<ClaseProgramaDeFormacion> createClaseProgramaDeFormacion(
        @RequestBody ClaseProgramaDeFormacion claseProgramaDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to save ClaseProgramaDeFormacion : {}", claseProgramaDeFormacion);
        if (claseProgramaDeFormacion.getId() != null) {
            throw new BadRequestAlertException("A new claseProgramaDeFormacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClaseProgramaDeFormacion result = claseProgramaDeFormacionRepository.save(claseProgramaDeFormacion);
        return ResponseEntity
            .created(new URI("/api/clase-programa-de-formacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clase-programa-de-formacions/:id} : Updates an existing claseProgramaDeFormacion.
     *
     * @param id the id of the claseProgramaDeFormacion to save.
     * @param claseProgramaDeFormacion the claseProgramaDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseProgramaDeFormacion,
     * or with status {@code 400 (Bad Request)} if the claseProgramaDeFormacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the claseProgramaDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clase-programa-de-formacions/{id}")
    public ResponseEntity<ClaseProgramaDeFormacion> updateClaseProgramaDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseProgramaDeFormacion claseProgramaDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to update ClaseProgramaDeFormacion : {}, {}", id, claseProgramaDeFormacion);
        if (claseProgramaDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseProgramaDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseProgramaDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClaseProgramaDeFormacion result = claseProgramaDeFormacionRepository.save(claseProgramaDeFormacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseProgramaDeFormacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clase-programa-de-formacions/:id} : Partial updates given fields of an existing claseProgramaDeFormacion, field will ignore if it is null
     *
     * @param id the id of the claseProgramaDeFormacion to save.
     * @param claseProgramaDeFormacion the claseProgramaDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseProgramaDeFormacion,
     * or with status {@code 400 (Bad Request)} if the claseProgramaDeFormacion is not valid,
     * or with status {@code 404 (Not Found)} if the claseProgramaDeFormacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the claseProgramaDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clase-programa-de-formacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClaseProgramaDeFormacion> partialUpdateClaseProgramaDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseProgramaDeFormacion claseProgramaDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClaseProgramaDeFormacion partially : {}, {}", id, claseProgramaDeFormacion);
        if (claseProgramaDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseProgramaDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseProgramaDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClaseProgramaDeFormacion> result = claseProgramaDeFormacionRepository
            .findById(claseProgramaDeFormacion.getId())
            .map(existingClaseProgramaDeFormacion -> {
                return existingClaseProgramaDeFormacion;
            })
            .map(claseProgramaDeFormacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseProgramaDeFormacion.getId().toString())
        );
    }

    /**
     * {@code GET  /clase-programa-de-formacions} : get all the claseProgramaDeFormacions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of claseProgramaDeFormacions in body.
     */
    @GetMapping("/clase-programa-de-formacions")
    public List<ClaseProgramaDeFormacion> getAllClaseProgramaDeFormacions(
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get all ClaseProgramaDeFormacions");
        return claseProgramaDeFormacionRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /clase-programa-de-formacions/:id} : get the "id" claseProgramaDeFormacion.
     *
     * @param id the id of the claseProgramaDeFormacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the claseProgramaDeFormacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clase-programa-de-formacions/{id}")
    public ResponseEntity<ClaseProgramaDeFormacion> getClaseProgramaDeFormacion(@PathVariable Long id) {
        log.debug("REST request to get ClaseProgramaDeFormacion : {}", id);
        Optional<ClaseProgramaDeFormacion> claseProgramaDeFormacion = claseProgramaDeFormacionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(claseProgramaDeFormacion);
    }

    /**
     * {@code DELETE  /clase-programa-de-formacions/:id} : delete the "id" claseProgramaDeFormacion.
     *
     * @param id the id of the claseProgramaDeFormacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clase-programa-de-formacions/{id}")
    public ResponseEntity<Void> deleteClaseProgramaDeFormacion(@PathVariable Long id) {
        log.debug("REST request to delete ClaseProgramaDeFormacion : {}", id);
        claseProgramaDeFormacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
