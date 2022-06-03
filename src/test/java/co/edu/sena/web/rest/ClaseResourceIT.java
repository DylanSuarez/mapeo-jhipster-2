package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Clase;
import co.edu.sena.repository.ClaseRepository;
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
 * Integration tests for the {@link ClaseResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ClaseResourceIT {

    private static final String DEFAULT_NOMBRE_CLASE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_CLASE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/clases";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClaseRepository claseRepository;

    @Mock
    private ClaseRepository claseRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClaseMockMvc;

    private Clase clase;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clase createEntity(EntityManager em) {
        Clase clase = new Clase().nombreClase(DEFAULT_NOMBRE_CLASE);
        return clase;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Clase createUpdatedEntity(EntityManager em) {
        Clase clase = new Clase().nombreClase(UPDATED_NOMBRE_CLASE);
        return clase;
    }

    @BeforeEach
    public void initTest() {
        clase = createEntity(em);
    }

    @Test
    @Transactional
    void createClase() throws Exception {
        int databaseSizeBeforeCreate = claseRepository.findAll().size();
        // Create the Clase
        restClaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clase)))
            .andExpect(status().isCreated());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeCreate + 1);
        Clase testClase = claseList.get(claseList.size() - 1);
        assertThat(testClase.getNombreClase()).isEqualTo(DEFAULT_NOMBRE_CLASE);
    }

    @Test
    @Transactional
    void createClaseWithExistingId() throws Exception {
        // Create the Clase with an existing ID
        clase.setId(1L);

        int databaseSizeBeforeCreate = claseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clase)))
            .andExpect(status().isBadRequest());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreClaseIsRequired() throws Exception {
        int databaseSizeBeforeTest = claseRepository.findAll().size();
        // set the field null
        clase.setNombreClase(null);

        // Create the Clase, which fails.

        restClaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clase)))
            .andExpect(status().isBadRequest());

        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllClases() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        // Get all the claseList
        restClaseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clase.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreClase").value(hasItem(DEFAULT_NOMBRE_CLASE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClasesWithEagerRelationshipsIsEnabled() throws Exception {
        when(claseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClasesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(claseRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getClase() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        // Get the clase
        restClaseMockMvc
            .perform(get(ENTITY_API_URL_ID, clase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clase.getId().intValue()))
            .andExpect(jsonPath("$.nombreClase").value(DEFAULT_NOMBRE_CLASE));
    }

    @Test
    @Transactional
    void getNonExistingClase() throws Exception {
        // Get the clase
        restClaseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClase() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        int databaseSizeBeforeUpdate = claseRepository.findAll().size();

        // Update the clase
        Clase updatedClase = claseRepository.findById(clase.getId()).get();
        // Disconnect from session so that the updates on updatedClase are not directly saved in db
        em.detach(updatedClase);
        updatedClase.nombreClase(UPDATED_NOMBRE_CLASE);

        restClaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClase.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClase))
            )
            .andExpect(status().isOk());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
        Clase testClase = claseList.get(claseList.size() - 1);
        assertThat(testClase.getNombreClase()).isEqualTo(UPDATED_NOMBRE_CLASE);
    }

    @Test
    @Transactional
    void putNonExistingClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clase.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clase))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clase))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clase)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClaseWithPatch() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        int databaseSizeBeforeUpdate = claseRepository.findAll().size();

        // Update the clase using partial update
        Clase partialUpdatedClase = new Clase();
        partialUpdatedClase.setId(clase.getId());

        partialUpdatedClase.nombreClase(UPDATED_NOMBRE_CLASE);

        restClaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClase.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClase))
            )
            .andExpect(status().isOk());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
        Clase testClase = claseList.get(claseList.size() - 1);
        assertThat(testClase.getNombreClase()).isEqualTo(UPDATED_NOMBRE_CLASE);
    }

    @Test
    @Transactional
    void fullUpdateClaseWithPatch() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        int databaseSizeBeforeUpdate = claseRepository.findAll().size();

        // Update the clase using partial update
        Clase partialUpdatedClase = new Clase();
        partialUpdatedClase.setId(clase.getId());

        partialUpdatedClase.nombreClase(UPDATED_NOMBRE_CLASE);

        restClaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClase.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClase))
            )
            .andExpect(status().isOk());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
        Clase testClase = claseList.get(claseList.size() - 1);
        assertThat(testClase.getNombreClase()).isEqualTo(UPDATED_NOMBRE_CLASE);
    }

    @Test
    @Transactional
    void patchNonExistingClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clase.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clase))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clase))
            )
            .andExpect(status().isBadRequest());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClase() throws Exception {
        int databaseSizeBeforeUpdate = claseRepository.findAll().size();
        clase.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clase)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Clase in the database
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClase() throws Exception {
        // Initialize the database
        claseRepository.saveAndFlush(clase);

        int databaseSizeBeforeDelete = claseRepository.findAll().size();

        // Delete the clase
        restClaseMockMvc
            .perform(delete(ENTITY_API_URL_ID, clase.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Clase> claseList = claseRepository.findAll();
        assertThat(claseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
