package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.ClaseProgramaDeFormacion;
import co.edu.sena.repository.ClaseProgramaDeFormacionRepository;
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
 * Integration tests for the {@link ClaseProgramaDeFormacionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ClaseProgramaDeFormacionResourceIT {

    private static final String ENTITY_API_URL = "/api/clase-programa-de-formacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClaseProgramaDeFormacionRepository claseProgramaDeFormacionRepository;

    @Mock
    private ClaseProgramaDeFormacionRepository claseProgramaDeFormacionRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClaseProgramaDeFormacionMockMvc;

    private ClaseProgramaDeFormacion claseProgramaDeFormacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseProgramaDeFormacion createEntity(EntityManager em) {
        ClaseProgramaDeFormacion claseProgramaDeFormacion = new ClaseProgramaDeFormacion();
        return claseProgramaDeFormacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseProgramaDeFormacion createUpdatedEntity(EntityManager em) {
        ClaseProgramaDeFormacion claseProgramaDeFormacion = new ClaseProgramaDeFormacion();
        return claseProgramaDeFormacion;
    }

    @BeforeEach
    public void initTest() {
        claseProgramaDeFormacion = createEntity(em);
    }

    @Test
    @Transactional
    void createClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeCreate = claseProgramaDeFormacionRepository.findAll().size();
        // Create the ClaseProgramaDeFormacion
        restClaseProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isCreated());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeCreate + 1);
        ClaseProgramaDeFormacion testClaseProgramaDeFormacion = claseProgramaDeFormacionList.get(claseProgramaDeFormacionList.size() - 1);
    }

    @Test
    @Transactional
    void createClaseProgramaDeFormacionWithExistingId() throws Exception {
        // Create the ClaseProgramaDeFormacion with an existing ID
        claseProgramaDeFormacion.setId(1L);

        int databaseSizeBeforeCreate = claseProgramaDeFormacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClaseProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClaseProgramaDeFormacions() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        // Get all the claseProgramaDeFormacionList
        restClaseProgramaDeFormacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(claseProgramaDeFormacion.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseProgramaDeFormacionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(claseProgramaDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseProgramaDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseProgramaDeFormacionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(claseProgramaDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseProgramaDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getClaseProgramaDeFormacion() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        // Get the claseProgramaDeFormacion
        restClaseProgramaDeFormacionMockMvc
            .perform(get(ENTITY_API_URL_ID, claseProgramaDeFormacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(claseProgramaDeFormacion.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingClaseProgramaDeFormacion() throws Exception {
        // Get the claseProgramaDeFormacion
        restClaseProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClaseProgramaDeFormacion() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();

        // Update the claseProgramaDeFormacion
        ClaseProgramaDeFormacion updatedClaseProgramaDeFormacion = claseProgramaDeFormacionRepository
            .findById(claseProgramaDeFormacion.getId())
            .get();
        // Disconnect from session so that the updates on updatedClaseProgramaDeFormacion are not directly saved in db
        em.detach(updatedClaseProgramaDeFormacion);

        restClaseProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClaseProgramaDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClaseProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ClaseProgramaDeFormacion testClaseProgramaDeFormacion = claseProgramaDeFormacionList.get(claseProgramaDeFormacionList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, claseProgramaDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClaseProgramaDeFormacionWithPatch() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();

        // Update the claseProgramaDeFormacion using partial update
        ClaseProgramaDeFormacion partialUpdatedClaseProgramaDeFormacion = new ClaseProgramaDeFormacion();
        partialUpdatedClaseProgramaDeFormacion.setId(claseProgramaDeFormacion.getId());

        restClaseProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseProgramaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ClaseProgramaDeFormacion testClaseProgramaDeFormacion = claseProgramaDeFormacionList.get(claseProgramaDeFormacionList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateClaseProgramaDeFormacionWithPatch() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();

        // Update the claseProgramaDeFormacion using partial update
        ClaseProgramaDeFormacion partialUpdatedClaseProgramaDeFormacion = new ClaseProgramaDeFormacion();
        partialUpdatedClaseProgramaDeFormacion.setId(claseProgramaDeFormacion.getId());

        restClaseProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseProgramaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ClaseProgramaDeFormacion testClaseProgramaDeFormacion = claseProgramaDeFormacionList.get(claseProgramaDeFormacionList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, claseProgramaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClaseProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = claseProgramaDeFormacionRepository.findAll().size();
        claseProgramaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseProgramaDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseProgramaDeFormacion in the database
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClaseProgramaDeFormacion() throws Exception {
        // Initialize the database
        claseProgramaDeFormacionRepository.saveAndFlush(claseProgramaDeFormacion);

        int databaseSizeBeforeDelete = claseProgramaDeFormacionRepository.findAll().size();

        // Delete the claseProgramaDeFormacion
        restClaseProgramaDeFormacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, claseProgramaDeFormacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClaseProgramaDeFormacion> claseProgramaDeFormacionList = claseProgramaDeFormacionRepository.findAll();
        assertThat(claseProgramaDeFormacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
