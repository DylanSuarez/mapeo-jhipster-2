package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.CentroDeFormacion;
import co.edu.sena.repository.CentroDeFormacionRepository;
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
 * Integration tests for the {@link CentroDeFormacionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CentroDeFormacionResourceIT {

    private static final String DEFAULT_NOMBRE_CENTRO = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_CENTRO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/centro-de-formacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CentroDeFormacionRepository centroDeFormacionRepository;

    @Mock
    private CentroDeFormacionRepository centroDeFormacionRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCentroDeFormacionMockMvc;

    private CentroDeFormacion centroDeFormacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CentroDeFormacion createEntity(EntityManager em) {
        CentroDeFormacion centroDeFormacion = new CentroDeFormacion().nombreCentro(DEFAULT_NOMBRE_CENTRO);
        return centroDeFormacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CentroDeFormacion createUpdatedEntity(EntityManager em) {
        CentroDeFormacion centroDeFormacion = new CentroDeFormacion().nombreCentro(UPDATED_NOMBRE_CENTRO);
        return centroDeFormacion;
    }

    @BeforeEach
    public void initTest() {
        centroDeFormacion = createEntity(em);
    }

    @Test
    @Transactional
    void createCentroDeFormacion() throws Exception {
        int databaseSizeBeforeCreate = centroDeFormacionRepository.findAll().size();
        // Create the CentroDeFormacion
        restCentroDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isCreated());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeCreate + 1);
        CentroDeFormacion testCentroDeFormacion = centroDeFormacionList.get(centroDeFormacionList.size() - 1);
        assertThat(testCentroDeFormacion.getNombreCentro()).isEqualTo(DEFAULT_NOMBRE_CENTRO);
    }

    @Test
    @Transactional
    void createCentroDeFormacionWithExistingId() throws Exception {
        // Create the CentroDeFormacion with an existing ID
        centroDeFormacion.setId(1L);

        int databaseSizeBeforeCreate = centroDeFormacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCentroDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreCentroIsRequired() throws Exception {
        int databaseSizeBeforeTest = centroDeFormacionRepository.findAll().size();
        // set the field null
        centroDeFormacion.setNombreCentro(null);

        // Create the CentroDeFormacion, which fails.

        restCentroDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCentroDeFormacions() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        // Get all the centroDeFormacionList
        restCentroDeFormacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(centroDeFormacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreCentro").value(hasItem(DEFAULT_NOMBRE_CENTRO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCentroDeFormacionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(centroDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCentroDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(centroDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCentroDeFormacionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(centroDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCentroDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(centroDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getCentroDeFormacion() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        // Get the centroDeFormacion
        restCentroDeFormacionMockMvc
            .perform(get(ENTITY_API_URL_ID, centroDeFormacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(centroDeFormacion.getId().intValue()))
            .andExpect(jsonPath("$.nombreCentro").value(DEFAULT_NOMBRE_CENTRO));
    }

    @Test
    @Transactional
    void getNonExistingCentroDeFormacion() throws Exception {
        // Get the centroDeFormacion
        restCentroDeFormacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCentroDeFormacion() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();

        // Update the centroDeFormacion
        CentroDeFormacion updatedCentroDeFormacion = centroDeFormacionRepository.findById(centroDeFormacion.getId()).get();
        // Disconnect from session so that the updates on updatedCentroDeFormacion are not directly saved in db
        em.detach(updatedCentroDeFormacion);
        updatedCentroDeFormacion.nombreCentro(UPDATED_NOMBRE_CENTRO);

        restCentroDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCentroDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCentroDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        CentroDeFormacion testCentroDeFormacion = centroDeFormacionList.get(centroDeFormacionList.size() - 1);
        assertThat(testCentroDeFormacion.getNombreCentro()).isEqualTo(UPDATED_NOMBRE_CENTRO);
    }

    @Test
    @Transactional
    void putNonExistingCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, centroDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCentroDeFormacionWithPatch() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();

        // Update the centroDeFormacion using partial update
        CentroDeFormacion partialUpdatedCentroDeFormacion = new CentroDeFormacion();
        partialUpdatedCentroDeFormacion.setId(centroDeFormacion.getId());

        restCentroDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCentroDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCentroDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        CentroDeFormacion testCentroDeFormacion = centroDeFormacionList.get(centroDeFormacionList.size() - 1);
        assertThat(testCentroDeFormacion.getNombreCentro()).isEqualTo(DEFAULT_NOMBRE_CENTRO);
    }

    @Test
    @Transactional
    void fullUpdateCentroDeFormacionWithPatch() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();

        // Update the centroDeFormacion using partial update
        CentroDeFormacion partialUpdatedCentroDeFormacion = new CentroDeFormacion();
        partialUpdatedCentroDeFormacion.setId(centroDeFormacion.getId());

        partialUpdatedCentroDeFormacion.nombreCentro(UPDATED_NOMBRE_CENTRO);

        restCentroDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCentroDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCentroDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        CentroDeFormacion testCentroDeFormacion = centroDeFormacionList.get(centroDeFormacionList.size() - 1);
        assertThat(testCentroDeFormacion.getNombreCentro()).isEqualTo(UPDATED_NOMBRE_CENTRO);
    }

    @Test
    @Transactional
    void patchNonExistingCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, centroDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCentroDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = centroDeFormacionRepository.findAll().size();
        centroDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCentroDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(centroDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CentroDeFormacion in the database
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCentroDeFormacion() throws Exception {
        // Initialize the database
        centroDeFormacionRepository.saveAndFlush(centroDeFormacion);

        int databaseSizeBeforeDelete = centroDeFormacionRepository.findAll().size();

        // Delete the centroDeFormacion
        restCentroDeFormacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, centroDeFormacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CentroDeFormacion> centroDeFormacionList = centroDeFormacionRepository.findAll();
        assertThat(centroDeFormacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
