package co.edu.sena.web.rest;

import co.edu.sena.domain.Clase;
import co.edu.sena.repository.ClaseRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Clase}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClaseResource {

    private final Logger log = LoggerFactory.getLogger(ClaseResource.class);

    private static final String ENTITY_NAME = "clase";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClaseRepository claseRepository;

    public ClaseResource(ClaseRepository claseRepository) {
        this.claseRepository = claseRepository;
    }

    /**
     * {@code POST  /clases} : Create a new clase.
     *
     * @param clase the clase to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clase, or with status {@code 400 (Bad Request)} if the clase has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clases")
    public ResponseEntity<Clase> createClase(@Valid @RequestBody Clase clase) throws URISyntaxException {
        log.debug("REST request to save Clase : {}", clase);
        if (clase.getId() != null) {
            throw new BadRequestAlertException("A new clase cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Clase result = claseRepository.save(clase);
        return ResponseEntity
            .created(new URI("/api/clases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clases/:id} : Updates an existing clase.
     *
     * @param id the id of the clase to save.
     * @param clase the clase to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clase,
     * or with status {@code 400 (Bad Request)} if the clase is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clase couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clases/{id}")
    public ResponseEntity<Clase> updateClase(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Clase clase)
        throws URISyntaxException {
        log.debug("REST request to update Clase : {}, {}", id, clase);
        if (clase.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clase.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Clase result = claseRepository.save(clase);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clase.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clases/:id} : Partial updates given fields of an existing clase, field will ignore if it is null
     *
     * @param id the id of the clase to save.
     * @param clase the clase to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clase,
     * or with status {@code 400 (Bad Request)} if the clase is not valid,
     * or with status {@code 404 (Not Found)} if the clase is not found,
     * or with status {@code 500 (Internal Server Error)} if the clase couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clases/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Clase> partialUpdateClase(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Clase clase
    ) throws URISyntaxException {
        log.debug("REST request to partial update Clase partially : {}, {}", id, clase);
        if (clase.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clase.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!claseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Clase> result = claseRepository
            .findById(clase.getId())
            .map(existingClase -> {
                if (clase.getNombreClase() != null) {
                    existingClase.setNombreClase(clase.getNombreClase());
                }

                return existingClase;
            })
            .map(claseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clase.getId().toString())
        );
    }

    /**
     * {@code GET  /clases} : get all the clases.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clases in body.
     */
    @GetMapping("/clases")
    public List<Clase> getAllClases(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Clases");
        return claseRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /clases/:id} : get the "id" clase.
     *
     * @param id the id of the clase to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clase, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clases/{id}")
    public ResponseEntity<Clase> getClase(@PathVariable Long id) {
        log.debug("REST request to get Clase : {}", id);
        Optional<Clase> clase = claseRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(clase);
    }

    /**
     * {@code DELETE  /clases/:id} : delete the "id" clase.
     *
     * @param id the id of the clase to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clases/{id}")
    public ResponseEntity<Void> deleteClase(@PathVariable Long id) {
        log.debug("REST request to delete Clase : {}", id);
        claseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
