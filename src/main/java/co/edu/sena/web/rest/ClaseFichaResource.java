package co.edu.sena.web.rest;

import co.edu.sena.domain.ClaseFicha;
import co.edu.sena.repository.ClaseFichaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.ClaseFicha}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClaseFichaResource {

    private final Logger log = LoggerFactory.getLogger(ClaseFichaResource.class);

    private static final String ENTITY_NAME = "claseFicha";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClaseFichaRepository claseFichaRepository;

    public ClaseFichaResource(ClaseFichaRepository claseFichaRepository) {
        this.claseFichaRepository = claseFichaRepository;
    }

    /**
     * {@code POST  /clase-fichas} : Create a new claseFicha.
     *
     * @param claseFicha the claseFicha to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new claseFicha, or with status {@code 400 (Bad Request)} if the claseFicha has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clase-fichas")
    public ResponseEntity<ClaseFicha> createClaseFicha(@RequestBody ClaseFicha claseFicha) throws URISyntaxException {
        log.debug("REST request to save ClaseFicha : {}", claseFicha);
        if (claseFicha.getId() != null) {
            throw new BadRequestAlertException("A new claseFicha cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClaseFicha result = claseFichaRepository.save(claseFicha);
        return ResponseEntity
            .created(new URI("/api/clase-fichas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clase-fichas/:id} : Updates an existing claseFicha.
     *
     * @param id the id of the claseFicha to save.
     * @param claseFicha the claseFicha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseFicha,
     * or with status {@code 400 (Bad Request)} if the claseFicha is not valid,
     * or with status {@code 500 (Internal Server Error)} if the claseFicha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clase-fichas/{id}")
    public ResponseEntity<ClaseFicha> updateClaseFicha(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseFicha claseFicha
    ) throws URISyntaxException {
        log.debug("REST request to update ClaseFicha : {}, {}", id, claseFicha);
        if (claseFicha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseFicha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseFichaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClaseFicha result = claseFichaRepository.save(claseFicha);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseFicha.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clase-fichas/:id} : Partial updates given fields of an existing claseFicha, field will ignore if it is null
     *
     * @param id the id of the claseFicha to save.
     * @param claseFicha the claseFicha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseFicha,
     * or with status {@code 400 (Bad Request)} if the claseFicha is not valid,
     * or with status {@code 404 (Not Found)} if the claseFicha is not found,
     * or with status {@code 500 (Internal Server Error)} if the claseFicha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clase-fichas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClaseFicha> partialUpdateClaseFicha(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseFicha claseFicha
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClaseFicha partially : {}, {}", id, claseFicha);
        if (claseFicha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseFicha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseFichaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClaseFicha> result = claseFichaRepository
            .findById(claseFicha.getId())
            .map(existingClaseFicha -> {
                return existingClaseFicha;
            })
            .map(claseFichaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseFicha.getId().toString())
        );
    }

    /**
     * {@code GET  /clase-fichas} : get all the claseFichas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of claseFichas in body.
     */
    @GetMapping("/clase-fichas")
    public List<ClaseFicha> getAllClaseFichas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ClaseFichas");
        return claseFichaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /clase-fichas/:id} : get the "id" claseFicha.
     *
     * @param id the id of the claseFicha to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the claseFicha, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clase-fichas/{id}")
    public ResponseEntity<ClaseFicha> getClaseFicha(@PathVariable Long id) {
        log.debug("REST request to get ClaseFicha : {}", id);
        Optional<ClaseFicha> claseFicha = claseFichaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(claseFicha);
    }

    /**
     * {@code DELETE  /clase-fichas/:id} : delete the "id" claseFicha.
     *
     * @param id the id of the claseFicha to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clase-fichas/{id}")
    public ResponseEntity<Void> deleteClaseFicha(@PathVariable Long id) {
        log.debug("REST request to delete ClaseFicha : {}", id);
        claseFichaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
