package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.EstudianteHorario;
import co.edu.sena.repository.EstudianteHorarioRepository;
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
 * Integration tests for the {@link EstudianteHorarioResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EstudianteHorarioResourceIT {

    private static final String ENTITY_API_URL = "/api/estudiante-horarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EstudianteHorarioRepository estudianteHorarioRepository;

    @Mock
    private EstudianteHorarioRepository estudianteHorarioRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEstudianteHorarioMockMvc;

    private EstudianteHorario estudianteHorario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EstudianteHorario createEntity(EntityManager em) {
        EstudianteHorario estudianteHorario = new EstudianteHorario();
        return estudianteHorario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EstudianteHorario createUpdatedEntity(EntityManager em) {
        EstudianteHorario estudianteHorario = new EstudianteHorario();
        return estudianteHorario;
    }

    @BeforeEach
    public void initTest() {
        estudianteHorario = createEntity(em);
    }

    @Test
    @Transactional
    void createEstudianteHorario() throws Exception {
        int databaseSizeBeforeCreate = estudianteHorarioRepository.findAll().size();
        // Create the EstudianteHorario
        restEstudianteHorarioMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isCreated());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeCreate + 1);
        EstudianteHorario testEstudianteHorario = estudianteHorarioList.get(estudianteHorarioList.size() - 1);
    }

    @Test
    @Transactional
    void createEstudianteHorarioWithExistingId() throws Exception {
        // Create the EstudianteHorario with an existing ID
        estudianteHorario.setId(1L);

        int databaseSizeBeforeCreate = estudianteHorarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstudianteHorarioMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEstudianteHorarios() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        // Get all the estudianteHorarioList
        restEstudianteHorarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estudianteHorario.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstudianteHorariosWithEagerRelationshipsIsEnabled() throws Exception {
        when(estudianteHorarioRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstudianteHorarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(estudianteHorarioRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEstudianteHorariosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(estudianteHorarioRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEstudianteHorarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(estudianteHorarioRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getEstudianteHorario() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        // Get the estudianteHorario
        restEstudianteHorarioMockMvc
            .perform(get(ENTITY_API_URL_ID, estudianteHorario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(estudianteHorario.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingEstudianteHorario() throws Exception {
        // Get the estudianteHorario
        restEstudianteHorarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEstudianteHorario() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();

        // Update the estudianteHorario
        EstudianteHorario updatedEstudianteHorario = estudianteHorarioRepository.findById(estudianteHorario.getId()).get();
        // Disconnect from session so that the updates on updatedEstudianteHorario are not directly saved in db
        em.detach(updatedEstudianteHorario);

        restEstudianteHorarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEstudianteHorario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEstudianteHorario))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
        EstudianteHorario testEstudianteHorario = estudianteHorarioList.get(estudianteHorarioList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, estudianteHorario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEstudianteHorarioWithPatch() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();

        // Update the estudianteHorario using partial update
        EstudianteHorario partialUpdatedEstudianteHorario = new EstudianteHorario();
        partialUpdatedEstudianteHorario.setId(estudianteHorario.getId());

        restEstudianteHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudianteHorario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudianteHorario))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
        EstudianteHorario testEstudianteHorario = estudianteHorarioList.get(estudianteHorarioList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateEstudianteHorarioWithPatch() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();

        // Update the estudianteHorario using partial update
        EstudianteHorario partialUpdatedEstudianteHorario = new EstudianteHorario();
        partialUpdatedEstudianteHorario.setId(estudianteHorario.getId());

        restEstudianteHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEstudianteHorario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEstudianteHorario))
            )
            .andExpect(status().isOk());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
        EstudianteHorario testEstudianteHorario = estudianteHorarioList.get(estudianteHorarioList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, estudianteHorario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isBadRequest());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEstudianteHorario() throws Exception {
        int databaseSizeBeforeUpdate = estudianteHorarioRepository.findAll().size();
        estudianteHorario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEstudianteHorarioMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(estudianteHorario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EstudianteHorario in the database
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEstudianteHorario() throws Exception {
        // Initialize the database
        estudianteHorarioRepository.saveAndFlush(estudianteHorario);

        int databaseSizeBeforeDelete = estudianteHorarioRepository.findAll().size();

        // Delete the estudianteHorario
        restEstudianteHorarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, estudianteHorario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EstudianteHorario> estudianteHorarioList = estudianteHorarioRepository.findAll();
        assertThat(estudianteHorarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
