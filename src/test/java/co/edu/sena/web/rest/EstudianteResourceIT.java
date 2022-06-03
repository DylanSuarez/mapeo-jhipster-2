package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Estudiante;
import co.edu.sena.repository.EstudianteRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EstudianteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EstudianteResourceIT {

    private static final Long DEFAULT_HUELLA = 1L;
    private static final Long UPDATED_HUELLA = 2L;

    private static final String ENTITY_API_URL = "/api/estudiantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Mock
    private EstudianteRepository estudianteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstudianteMockMvc;

    private Estudiante estudiante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estudiante createEntity(EntityManager em) {
        Estudiante estudiante = new Estudiante().huella(DEFAULT_HUELLA);
        return estudiante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estudiante createUpdatedEntity(EntityManager em) {
        Estudiante estudiante = new Estudiante().huella(UPDATED_HUELLA);
        return estudiante;
    }

    @BeforeEach
    public void initTest() {
        estudiante = createEntity(em);
    }

    @Test
    @Transactional
    void createEstudiante() throws Exception {
        int databaseSizeBeforeCreate = estudianteRepository.findAll().size();
        // Create the Estudiante
        restEstudianteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudiante)))
            .andExpect(status().isCreated());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeCreate + 1);
        Estudiante testEstudiante = estudianteList.get(estudianteList.size() - 1);
        assertThat(testEstudiante.getHuella()).isEqualTo(DEFAULT_HUELLA);
    }

    @Test
    @Transactional
    void createEstudianteWithExistingId() throws Exception {
        // Create the Estudiante with an existing ID
        estudiante.setId(1L);

        int databaseSizeBeforeCreate = estudianteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstudianteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudiante)))
            .andExpect(status().isBadRequest());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkHuellaIsRequired() throws Exception {
        int databaseSizeBeforeTest = estudianteRepository.findAll().size();
        // set the field null
        estudiante.setHuella(null);

        // Create the Estudiante, which fails.

        restEstudianteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudiante)))
            .andExpect(status().isBadRequest());

        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEstudiantes() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        // Get all the estudianteList
        restEstudianteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estudiante.getId().intValue())))
            .andExpect(jsonPath("$.[*].huella").value(hasItem(DEFAULT_HUELLA.intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstudiantesWithEagerRelationshipsIsEnabled() throws Exception {
        when(estudianteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstudianteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(estudianteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstudiantesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(estudianteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstudianteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(estudianteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getEstudiante() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        // Get the estudiante
        restEstudianteMockMvc
            .perform(get(ENTITY_API_URL_ID, estudiante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estudiante.getId().intValue()))
            .andExpect(jsonPath("$.huella").value(DEFAULT_HUELLA.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingEstudiante() throws Exception {
        // Get the estudiante
        restEstudianteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEstudiante() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();

        // Update the estudiante
        Estudiante updatedEstudiante = estudianteRepository.findById(estudiante.getId()).get();
        // Disconnect from session so that the updates on updatedEstudiante are not directly saved in db
        em.detach(updatedEstudiante);
        updatedEstudiante.huella(UPDATED_HUELLA);

        restEstudianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstudiante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEstudiante))
            )
            .andExpect(status().isOk());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
        Estudiante testEstudiante = estudianteList.get(estudianteList.size() - 1);
        assertThat(testEstudiante.getHuella()).isEqualTo(UPDATED_HUELLA);
    }

    @Test
    @Transactional
    void putNonExistingEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estudiante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudiante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudiante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudiante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstudianteWithPatch() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();

        // Update the estudiante using partial update
        Estudiante partialUpdatedEstudiante = new Estudiante();
        partialUpdatedEstudiante.setId(estudiante.getId());

        partialUpdatedEstudiante.huella(UPDATED_HUELLA);

        restEstudianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudiante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudiante))
            )
            .andExpect(status().isOk());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
        Estudiante testEstudiante = estudianteList.get(estudianteList.size() - 1);
        assertThat(testEstudiante.getHuella()).isEqualTo(UPDATED_HUELLA);
    }

    @Test
    @Transactional
    void fullUpdateEstudianteWithPatch() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();

        // Update the estudiante using partial update
        Estudiante partialUpdatedEstudiante = new Estudiante();
        partialUpdatedEstudiante.setId(estudiante.getId());

        partialUpdatedEstudiante.huella(UPDATED_HUELLA);

        restEstudianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudiante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudiante))
            )
            .andExpect(status().isOk());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
        Estudiante testEstudiante = estudianteList.get(estudianteList.size() - 1);
        assertThat(testEstudiante.getHuella()).isEqualTo(UPDATED_HUELLA);
    }

    @Test
    @Transactional
    void patchNonExistingEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estudiante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudiante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudiante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstudiante() throws Exception {
        int databaseSizeBeforeUpdate = estudianteRepository.findAll().size();
        estudiante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(estudiante))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Estudiante in the database
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstudiante() throws Exception {
        // Initialize the database
        estudianteRepository.saveAndFlush(estudiante);

        int databaseSizeBeforeDelete = estudianteRepository.findAll().size();

        // Delete the estudiante
        restEstudianteMockMvc
            .perform(delete(ENTITY_API_URL_ID, estudiante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Estudiante> estudianteList = estudianteRepository.findAll();
        assertThat(estudianteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
