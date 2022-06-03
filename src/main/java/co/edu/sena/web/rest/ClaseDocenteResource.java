package co.edu.sena.web.rest;

import co.edu.sena.domain.ClaseDocente;
import co.edu.sena.repository.ClaseDocenteRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.ClaseDocente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClaseDocenteResource {

    private final Logger log = LoggerFactory.getLogger(ClaseDocenteResource.class);

    private static final String ENTITY_NAME = "claseDocente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClaseDocenteRepository claseDocenteRepository;

    public ClaseDocenteResource(ClaseDocenteRepository claseDocenteRepository) {
        this.claseDocenteRepository = claseDocenteRepository;
    }

    /**
     * {@code POST  /clase-docentes} : Create a new claseDocente.
     *
     * @param claseDocente the claseDocente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new claseDocente, or with status {@code 400 (Bad Request)} if the claseDocente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clase-docentes")
    public ResponseEntity<ClaseDocente> createClaseDocente(@RequestBody ClaseDocente claseDocente) throws URISyntaxException {
        log.debug("REST request to save ClaseDocente : {}", claseDocente);
        if (claseDocente.getId() != null) {
            throw new BadRequestAlertException("A new claseDocente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClaseDocente result = claseDocenteRepository.save(claseDocente);
        return ResponseEntity
            .created(new URI("/api/clase-docentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clase-docentes/:id} : Updates an existing claseDocente.
     *
     * @param id the id of the claseDocente to save.
     * @param claseDocente the claseDocente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseDocente,
     * or with status {@code 400 (Bad Request)} if the claseDocente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the claseDocente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clase-docentes/{id}")
    public ResponseEntity<ClaseDocente> updateClaseDocente(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseDocente claseDocente
    ) throws URISyntaxException {
        log.debug("REST request to update ClaseDocente : {}, {}", id, claseDocente);
        if (claseDocente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseDocente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseDocenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClaseDocente result = claseDocenteRepository.save(claseDocente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseDocente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clase-docentes/:id} : Partial updates given fields of an existing claseDocente, field will ignore if it is null
     *
     * @param id the id of the claseDocente to save.
     * @param claseDocente the claseDocente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated claseDocente,
     * or with status {@code 400 (Bad Request)} if the claseDocente is not valid,
     * or with status {@code 404 (Not Found)} if the claseDocente is not found,
     * or with status {@code 500 (Internal Server Error)} if the claseDocente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clase-docentes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClaseDocente> partialUpdateClaseDocente(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClaseDocente claseDocente
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClaseDocente partially : {}, {}", id, claseDocente);
        if (claseDocente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, claseDocente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseDocenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClaseDocente> result = claseDocenteRepository
            .findById(claseDocente.getId())
            .map(existingClaseDocente -> {
                return existingClaseDocente;
            })
            .map(claseDocenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, claseDocente.getId().toString())
        );
    }

    /**
     * {@code GET  /clase-docentes} : get all the claseDocentes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of claseDocentes in body.
     */
    @GetMapping("/clase-docentes")
    public List<ClaseDocente> getAllClaseDocentes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ClaseDocentes");
        return claseDocenteRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /clase-docentes/:id} : get the "id" claseDocente.
     *
     * @param id the id of the claseDocente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the claseDocente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clase-docentes/{id}")
    public ResponseEntity<ClaseDocente> getClaseDocente(@PathVariable Long id) {
        log.debug("REST request to get ClaseDocente : {}", id);
        Optional<ClaseDocente> claseDocente = claseDocenteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(claseDocente);
    }

    /**
     * {@code DELETE  /clase-docentes/:id} : delete the "id" claseDocente.
     *
     * @param id the id of the claseDocente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clase-docentes/{id}")
    public ResponseEntity<Void> deleteClaseDocente(@PathVariable Long id) {
        log.debug("REST request to delete ClaseDocente : {}", id);
        claseDocenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
