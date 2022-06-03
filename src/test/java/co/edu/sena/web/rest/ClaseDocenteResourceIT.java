package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.ClaseDocente;
import co.edu.sena.repository.ClaseDocenteRepository;
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
 * Integration tests for the {@link ClaseDocenteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ClaseDocenteResourceIT {

    private static final String ENTITY_API_URL = "/api/clase-docentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClaseDocenteRepository claseDocenteRepository;

    @Mock
    private ClaseDocenteRepository claseDocenteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClaseDocenteMockMvc;

    private ClaseDocente claseDocente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseDocente createEntity(EntityManager em) {
        ClaseDocente claseDocente = new ClaseDocente();
        return claseDocente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseDocente createUpdatedEntity(EntityManager em) {
        ClaseDocente claseDocente = new ClaseDocente();
        return claseDocente;
    }

    @BeforeEach
    public void initTest() {
        claseDocente = createEntity(em);
    }

    @Test
    @Transactional
    void createClaseDocente() throws Exception {
        int databaseSizeBeforeCreate = claseDocenteRepository.findAll().size();
        // Create the ClaseDocente
        restClaseDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseDocente)))
            .andExpect(status().isCreated());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeCreate + 1);
        ClaseDocente testClaseDocente = claseDocenteList.get(claseDocenteList.size() - 1);
    }

    @Test
    @Transactional
    void createClaseDocenteWithExistingId() throws Exception {
        // Create the ClaseDocente with an existing ID
        claseDocente.setId(1L);

        int databaseSizeBeforeCreate = claseDocenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClaseDocenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseDocente)))
            .andExpect(status().isBadRequest());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClaseDocentes() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        // Get all the claseDocenteList
        restClaseDocenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(claseDocente.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseDocentesWithEagerRelationshipsIsEnabled() throws Exception {
        when(claseDocenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseDocenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseDocenteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseDocentesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(claseDocenteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseDocenteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseDocenteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getClaseDocente() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        // Get the claseDocente
        restClaseDocenteMockMvc
            .perform(get(ENTITY_API_URL_ID, claseDocente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(claseDocente.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingClaseDocente() throws Exception {
        // Get the claseDocente
        restClaseDocenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClaseDocente() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();

        // Update the claseDocente
        ClaseDocente updatedClaseDocente = claseDocenteRepository.findById(claseDocente.getId()).get();
        // Disconnect from session so that the updates on updatedClaseDocente are not directly saved in db
        em.detach(updatedClaseDocente);

        restClaseDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClaseDocente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClaseDocente))
            )
            .andExpect(status().isOk());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
        ClaseDocente testClaseDocente = claseDocenteList.get(claseDocenteList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, claseDocente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseDocente))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseDocente))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseDocente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClaseDocenteWithPatch() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();

        // Update the claseDocente using partial update
        ClaseDocente partialUpdatedClaseDocente = new ClaseDocente();
        partialUpdatedClaseDocente.setId(claseDocente.getId());

        restClaseDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseDocente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseDocente))
            )
            .andExpect(status().isOk());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
        ClaseDocente testClaseDocente = claseDocenteList.get(claseDocenteList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateClaseDocenteWithPatch() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();

        // Update the claseDocente using partial update
        ClaseDocente partialUpdatedClaseDocente = new ClaseDocente();
        partialUpdatedClaseDocente.setId(claseDocente.getId());

        restClaseDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseDocente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseDocente))
            )
            .andExpect(status().isOk());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
        ClaseDocente testClaseDocente = claseDocenteList.get(claseDocenteList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, claseDocente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseDocente))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseDocente))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClaseDocente() throws Exception {
        int databaseSizeBeforeUpdate = claseDocenteRepository.findAll().size();
        claseDocente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseDocenteMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(claseDocente))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseDocente in the database
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClaseDocente() throws Exception {
        // Initialize the database
        claseDocenteRepository.saveAndFlush(claseDocente);

        int databaseSizeBeforeDelete = claseDocenteRepository.findAll().size();

        // Delete the claseDocente
        restClaseDocenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, claseDocente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClaseDocente> claseDocenteList = claseDocenteRepository.findAll();
        assertThat(claseDocenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
