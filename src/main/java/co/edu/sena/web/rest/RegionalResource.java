package co.edu.sena.web.rest;

import co.edu.sena.domain.Regional;
import co.edu.sena.repository.RegionalRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.Regional}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RegionalResource {

    private final Logger log = LoggerFactory.getLogger(RegionalResource.class);

    private static final String ENTITY_NAME = "regional";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RegionalRepository regionalRepository;

    public RegionalResource(RegionalRepository regionalRepository) {
        this.regionalRepository = regionalRepository;
    }

    /**
     * {@code POST  /regionals} : Create a new regional.
     *
     * @param regional the regional to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new regional, or with status {@code 400 (Bad Request)} if the regional has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/regionals")
    public ResponseEntity<Regional> createRegional(@Valid @RequestBody Regional regional) throws URISyntaxException {
        log.debug("REST request to save Regional : {}", regional);
        if (regional.getId() != null) {
            throw new BadRequestAlertException("A new regional cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Regional result = regionalRepository.save(regional);
        return ResponseEntity
            .created(new URI("/api/regionals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /regionals/:id} : Updates an existing regional.
     *
     * @param id the id of the regional to save.
     * @param regional the regional to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated regional,
     * or with status {@code 400 (Bad Request)} if the regional is not valid,
     * or with status {@code 500 (Internal Server Error)} if the regional couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/regionals/{id}")
    public ResponseEntity<Regional> updateRegional(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Regional regional
    ) throws URISyntaxException {
        log.debug("REST request to update Regional : {}, {}", id, regional);
        if (regional.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, regional.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!regionalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Regional result = regionalRepository.save(regional);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, regional.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /regionals/:id} : Partial updates given fields of an existing regional, field will ignore if it is null
     *
     * @param id the id of the regional to save.
     * @param regional the regional to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated regional,
     * or with status {@code 400 (Bad Request)} if the regional is not valid,
     * or with status {@code 404 (Not Found)} if the regional is not found,
     * or with status {@code 500 (Internal Server Error)} if the regional couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/regionals/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Regional> partialUpdateRegional(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Regional regional
    ) throws URISyntaxException {
        log.debug("REST request to partial update Regional partially : {}, {}", id, regional);
        if (regional.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, regional.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!regionalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Regional> result = regionalRepository
            .findById(regional.getId())
            .map(existingRegional -> {
                if (regional.getNombreRegional() != null) {
                    existingRegional.setNombreRegional(regional.getNombreRegional());
                }

                return existingRegional;
            })
            .map(regionalRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, regional.getId().toString())
        );
    }

    /**
     * {@code GET  /regionals} : get all the regionals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of regionals in body.
     */
    @GetMapping("/regionals")
    public List<Regional> getAllRegionals() {
        log.debug("REST request to get all Regionals");
        return regionalRepository.findAll();
    }

    /**
     * {@code GET  /regionals/:id} : get the "id" regional.
     *
     * @param id the id of the regional to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the regional, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/regionals/{id}")
    public ResponseEntity<Regional> getRegional(@PathVariable Long id) {
        log.debug("REST request to get Regional : {}", id);
        Optional<Regional> regional = regionalRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(regional);
    }

    /**
     * {@code DELETE  /regionals/:id} : delete the "id" regional.
     *
     * @param id the id of the regional to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/regionals/{id}")
    public ResponseEntity<Void> deleteRegional(@PathVariable Long id) {
        log.debug("REST request to delete Regional : {}", id);
        regionalRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
