package co.edu.sena.web.rest;

import co.edu.sena.domain.Ficha;
import co.edu.sena.repository.FichaRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Ficha}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FichaResource {

    private final Logger log = LoggerFactory.getLogger(FichaResource.class);

    private static final String ENTITY_NAME = "ficha";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FichaRepository fichaRepository;

    public FichaResource(FichaRepository fichaRepository) {
        this.fichaRepository = fichaRepository;
    }

    /**
     * {@code POST  /fichas} : Create a new ficha.
     *
     * @param ficha the ficha to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ficha, or with status {@code 400 (Bad Request)} if the ficha has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fichas")
    public ResponseEntity<Ficha> createFicha(@Valid @RequestBody Ficha ficha) throws URISyntaxException {
        log.debug("REST request to save Ficha : {}", ficha);
        if (ficha.getId() != null) {
            throw new BadRequestAlertException("A new ficha cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ficha result = fichaRepository.save(ficha);
        return ResponseEntity
            .created(new URI("/api/fichas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fichas/:id} : Updates an existing ficha.
     *
     * @param id the id of the ficha to save.
     * @param ficha the ficha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficha,
     * or with status {@code 400 (Bad Request)} if the ficha is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ficha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fichas/{id}")
    public ResponseEntity<Ficha> updateFicha(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Ficha ficha)
        throws URISyntaxException {
        log.debug("REST request to update Ficha : {}, {}", id, ficha);
        if (ficha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ficha result = fichaRepository.save(ficha);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ficha.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fichas/:id} : Partial updates given fields of an existing ficha, field will ignore if it is null
     *
     * @param id the id of the ficha to save.
     * @param ficha the ficha to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ficha,
     * or with status {@code 400 (Bad Request)} if the ficha is not valid,
     * or with status {@code 404 (Not Found)} if the ficha is not found,
     * or with status {@code 500 (Internal Server Error)} if the ficha couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fichas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ficha> partialUpdateFicha(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Ficha ficha
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ficha partially : {}, {}", id, ficha);
        if (ficha.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ficha.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fichaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ficha> result = fichaRepository
            .findById(ficha.getId())
            .map(existingFicha -> {
                if (ficha.getNombreFicha() != null) {
                    existingFicha.setNombreFicha(ficha.getNombreFicha());
                }
                if (ficha.getEstadoFicha() != null) {
                    existingFicha.setEstadoFicha(ficha.getEstadoFicha());
                }

                return existingFicha;
            })
            .map(fichaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ficha.getId().toString())
        );
    }

    /**
     * {@code GET  /fichas} : get all the fichas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fichas in body.
     */
    @GetMapping("/fichas")
    public List<Ficha> getAllFichas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Fichas");
        return fichaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /fichas/:id} : get the "id" ficha.
     *
     * @param id the id of the ficha to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ficha, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fichas/{id}")
    public ResponseEntity<Ficha> getFicha(@PathVariable Long id) {
        log.debug("REST request to get Ficha : {}", id);
        Optional<Ficha> ficha = fichaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(ficha);
    }

    /**
     * {@code DELETE  /fichas/:id} : delete the "id" ficha.
     *
     * @param id the id of the ficha to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fichas/{id}")
    public ResponseEntity<Void> deleteFicha(@PathVariable Long id) {
        log.debug("REST request to delete Ficha : {}", id);
        fichaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
