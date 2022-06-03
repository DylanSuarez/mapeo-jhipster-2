package co.edu.sena.web.rest;

import co.edu.sena.domain.Trimestre;
import co.edu.sena.repository.TrimestreRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Trimestre}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TrimestreResource {

    private final Logger log = LoggerFactory.getLogger(TrimestreResource.class);

    private static final String ENTITY_NAME = "trimestre";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TrimestreRepository trimestreRepository;

    public TrimestreResource(TrimestreRepository trimestreRepository) {
        this.trimestreRepository = trimestreRepository;
    }

    /**
     * {@code POST  /trimestres} : Create a new trimestre.
     *
     * @param trimestre the trimestre to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new trimestre, or with status {@code 400 (Bad Request)} if the trimestre has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/trimestres")
    public ResponseEntity<Trimestre> createTrimestre(@Valid @RequestBody Trimestre trimestre) throws URISyntaxException {
        log.debug("REST request to save Trimestre : {}", trimestre);
        if (trimestre.getId() != null) {
            throw new BadRequestAlertException("A new trimestre cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Trimestre result = trimestreRepository.save(trimestre);
        return ResponseEntity
            .created(new URI("/api/trimestres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /trimestres/:id} : Updates an existing trimestre.
     *
     * @param id the id of the trimestre to save.
     * @param trimestre the trimestre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trimestre,
     * or with status {@code 400 (Bad Request)} if the trimestre is not valid,
     * or with status {@code 500 (Internal Server Error)} if the trimestre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/trimestres/{id}")
    public ResponseEntity<Trimestre> updateTrimestre(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Trimestre trimestre
    ) throws URISyntaxException {
        log.debug("REST request to update Trimestre : {}, {}", id, trimestre);
        if (trimestre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trimestre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trimestreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Trimestre result = trimestreRepository.save(trimestre);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trimestre.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /trimestres/:id} : Partial updates given fields of an existing trimestre, field will ignore if it is null
     *
     * @param id the id of the trimestre to save.
     * @param trimestre the trimestre to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated trimestre,
     * or with status {@code 400 (Bad Request)} if the trimestre is not valid,
     * or with status {@code 404 (Not Found)} if the trimestre is not found,
     * or with status {@code 500 (Internal Server Error)} if the trimestre couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/trimestres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Trimestre> partialUpdateTrimestre(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Trimestre trimestre
    ) throws URISyntaxException {
        log.debug("REST request to partial update Trimestre partially : {}, {}", id, trimestre);
        if (trimestre.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, trimestre.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!trimestreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Trimestre> result = trimestreRepository
            .findById(trimestre.getId())
            .map(existingTrimestre -> {
                if (trimestre.getNumTrimestre() != null) {
                    existingTrimestre.setNumTrimestre(trimestre.getNumTrimestre());
                }

                return existingTrimestre;
            })
            .map(trimestreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, trimestre.getId().toString())
        );
    }

    /**
     * {@code GET  /trimestres} : get all the trimestres.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of trimestres in body.
     */
    @GetMapping("/trimestres")
    public List<Trimestre> getAllTrimestres() {
        log.debug("REST request to get all Trimestres");
        return trimestreRepository.findAll();
    }

    /**
     * {@code GET  /trimestres/:id} : get the "id" trimestre.
     *
     * @param id the id of the trimestre to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the trimestre, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/trimestres/{id}")
    public ResponseEntity<Trimestre> getTrimestre(@PathVariable Long id) {
        log.debug("REST request to get Trimestre : {}", id);
        Optional<Trimestre> trimestre = trimestreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(trimestre);
    }

    /**
     * {@code DELETE  /trimestres/:id} : delete the "id" trimestre.
     *
     * @param id the id of the trimestre to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/trimestres/{id}")
    public ResponseEntity<Void> deleteTrimestre(@PathVariable Long id) {
        log.debug("REST request to delete Trimestre : {}", id);
        trimestreRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
