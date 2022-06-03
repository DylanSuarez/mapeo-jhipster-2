package co.edu.sena.web.rest;

import co.edu.sena.domain.EstudianteHorario;
import co.edu.sena.repository.EstudianteHorarioRepository;
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
 * REST controller for managing {@link co.edu.sena.domain.EstudianteHorario}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EstudianteHorarioResource {

    private final Logger log = LoggerFactory.getLogger(EstudianteHorarioResource.class);

    private static final String ENTITY_NAME = "estudianteHorario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstudianteHorarioRepository estudianteHorarioRepository;

    public EstudianteHorarioResource(EstudianteHorarioRepository estudianteHorarioRepository) {
        this.estudianteHorarioRepository = estudianteHorarioRepository;
    }

    /**
     * {@code POST  /estudiante-horarios} : Create a new estudianteHorario.
     *
     * @param estudianteHorario the estudianteHorario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estudianteHorario, or with status {@code 400 (Bad Request)} if the estudianteHorario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estudiante-horarios")
    public ResponseEntity<EstudianteHorario> createEstudianteHorario(@RequestBody EstudianteHorario estudianteHorario)
        throws URISyntaxException {
        log.debug("REST request to save EstudianteHorario : {}", estudianteHorario);
        if (estudianteHorario.getId() != null) {
            throw new BadRequestAlertException("A new estudianteHorario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EstudianteHorario result = estudianteHorarioRepository.save(estudianteHorario);
        return ResponseEntity
            .created(new URI("/api/estudiante-horarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /estudiante-horarios/:id} : Updates an existing estudianteHorario.
     *
     * @param id the id of the estudianteHorario to save.
     * @param estudianteHorario the estudianteHorario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudianteHorario,
     * or with status {@code 400 (Bad Request)} if the estudianteHorario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estudianteHorario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estudiante-horarios/{id}")
    public ResponseEntity<EstudianteHorario> updateEstudianteHorario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EstudianteHorario estudianteHorario
    ) throws URISyntaxException {
        log.debug("REST request to update EstudianteHorario : {}, {}", id, estudianteHorario);
        if (estudianteHorario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudianteHorario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudianteHorarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EstudianteHorario result = estudianteHorarioRepository.save(estudianteHorario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estudianteHorario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /estudiante-horarios/:id} : Partial updates given fields of an existing estudianteHorario, field will ignore if it is null
     *
     * @param id the id of the estudianteHorario to save.
     * @param estudianteHorario the estudianteHorario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estudianteHorario,
     * or with status {@code 400 (Bad Request)} if the estudianteHorario is not valid,
     * or with status {@code 404 (Not Found)} if the estudianteHorario is not found,
     * or with status {@code 500 (Internal Server Error)} if the estudianteHorario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/estudiante-horarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EstudianteHorario> partialUpdateEstudianteHorario(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EstudianteHorario estudianteHorario
    ) throws URISyntaxException {
        log.debug("REST request to partial update EstudianteHorario partially : {}, {}", id, estudianteHorario);
        if (estudianteHorario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, estudianteHorario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!estudianteHorarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EstudianteHorario> result = estudianteHorarioRepository
            .findById(estudianteHorario.getId())
            .map(existingEstudianteHorario -> {
                return existingEstudianteHorario;
            })
            .map(estudianteHorarioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, estudianteHorario.getId().toString())
        );
    }

    /**
     * {@code GET  /estudiante-horarios} : get all the estudianteHorarios.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estudianteHorarios in body.
     */
    @GetMapping("/estudiante-horarios")
    public List<EstudianteHorario> getAllEstudianteHorarios(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all EstudianteHorarios");
        return estudianteHorarioRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /estudiante-horarios/:id} : get the "id" estudianteHorario.
     *
     * @param id the id of the estudianteHorario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estudianteHorario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estudiante-horarios/{id}")
    public ResponseEntity<EstudianteHorario> getEstudianteHorario(@PathVariable Long id) {
        log.debug("REST request to get EstudianteHorario : {}", id);
        Optional<EstudianteHorario> estudianteHorario = estudianteHorarioRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(estudianteHorario);
    }

    /**
     * {@code DELETE  /estudiante-horarios/:id} : delete the "id" estudianteHorario.
     *
     * @param id the id of the estudianteHorario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estudiante-horarios/{id}")
    public ResponseEntity<Void> deleteEstudianteHorario(@PathVariable Long id) {
        log.debug("REST request to delete EstudianteHorario : {}", id);
        estudianteHorarioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
