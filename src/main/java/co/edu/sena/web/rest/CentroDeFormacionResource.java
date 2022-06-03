package co.edu.sena.web.rest;

import co.edu.sena.domain.CentroDeFormacion;
import co.edu.sena.repository.CentroDeFormacionRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.CentroDeFormacion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CentroDeFormacionResource {

    private final Logger log = LoggerFactory.getLogger(CentroDeFormacionResource.class);

    private static final String ENTITY_NAME = "centroDeFormacion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CentroDeFormacionRepository centroDeFormacionRepository;

    public CentroDeFormacionResource(CentroDeFormacionRepository centroDeFormacionRepository) {
        this.centroDeFormacionRepository = centroDeFormacionRepository;
    }

    /**
     * {@code POST  /centro-de-formacions} : Create a new centroDeFormacion.
     *
     * @param centroDeFormacion the centroDeFormacion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new centroDeFormacion, or with status {@code 400 (Bad Request)} if the centroDeFormacion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/centro-de-formacions")
    public ResponseEntity<CentroDeFormacion> createCentroDeFormacion(@Valid @RequestBody CentroDeFormacion centroDeFormacion)
        throws URISyntaxException {
        log.debug("REST request to save CentroDeFormacion : {}", centroDeFormacion);
        if (centroDeFormacion.getId() != null) {
            throw new BadRequestAlertException("A new centroDeFormacion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CentroDeFormacion result = centroDeFormacionRepository.save(centroDeFormacion);
        return ResponseEntity
            .created(new URI("/api/centro-de-formacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /centro-de-formacions/:id} : Updates an existing centroDeFormacion.
     *
     * @param id the id of the centroDeFormacion to save.
     * @param centroDeFormacion the centroDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated centroDeFormacion,
     * or with status {@code 400 (Bad Request)} if the centroDeFormacion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the centroDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/centro-de-formacions/{id}")
    public ResponseEntity<CentroDeFormacion> updateCentroDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CentroDeFormacion centroDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to update CentroDeFormacion : {}, {}", id, centroDeFormacion);
        if (centroDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, centroDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!centroDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CentroDeFormacion result = centroDeFormacionRepository.save(centroDeFormacion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, centroDeFormacion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /centro-de-formacions/:id} : Partial updates given fields of an existing centroDeFormacion, field will ignore if it is null
     *
     * @param id the id of the centroDeFormacion to save.
     * @param centroDeFormacion the centroDeFormacion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated centroDeFormacion,
     * or with status {@code 400 (Bad Request)} if the centroDeFormacion is not valid,
     * or with status {@code 404 (Not Found)} if the centroDeFormacion is not found,
     * or with status {@code 500 (Internal Server Error)} if the centroDeFormacion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/centro-de-formacions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CentroDeFormacion> partialUpdateCentroDeFormacion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CentroDeFormacion centroDeFormacion
    ) throws URISyntaxException {
        log.debug("REST request to partial update CentroDeFormacion partially : {}, {}", id, centroDeFormacion);
        if (centroDeFormacion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, centroDeFormacion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!centroDeFormacionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CentroDeFormacion> result = centroDeFormacionRepository
            .findById(centroDeFormacion.getId())
            .map(existingCentroDeFormacion -> {
                if (centroDeFormacion.getNombreCentro() != null) {
                    existingCentroDeFormacion.setNombreCentro(centroDeFormacion.getNombreCentro());
                }

                return existingCentroDeFormacion;
            })
            .map(centroDeFormacionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, centroDeFormacion.getId().toString())
        );
    }

    /**
     * {@code GET  /centro-de-formacions} : get all the centroDeFormacions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of centroDeFormacions in body.
     */
    @GetMapping("/centro-de-formacions")
    public List<CentroDeFormacion> getAllCentroDeFormacions(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all CentroDeFormacions");
        return centroDeFormacionRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /centro-de-formacions/:id} : get the "id" centroDeFormacion.
     *
     * @param id the id of the centroDeFormacion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the centroDeFormacion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/centro-de-formacions/{id}")
    public ResponseEntity<CentroDeFormacion> getCentroDeFormacion(@PathVariable Long id) {
        log.debug("REST request to get CentroDeFormacion : {}", id);
        Optional<CentroDeFormacion> centroDeFormacion = centroDeFormacionRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(centroDeFormacion);
    }

    /**
     * {@code DELETE  /centro-de-formacions/:id} : delete the "id" centroDeFormacion.
     *
     * @param id the id of the centroDeFormacion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/centro-de-formacions/{id}")
    public ResponseEntity<Void> deleteCentroDeFormacion(@PathVariable Long id) {
        log.debug("REST request to delete CentroDeFormacion : {}", id);
        centroDeFormacionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
