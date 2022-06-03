package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Ficha;
import co.edu.sena.domain.enumeration.State;
import co.edu.sena.repository.FichaRepository;
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
 * Integration tests for the {@link FichaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FichaResourceIT {

    private static final String DEFAULT_NOMBRE_FICHA = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_FICHA = "BBBBBBBBBB";

    private static final State DEFAULT_ESTADO_FICHA = State.ACTIVE;
    private static final State UPDATED_ESTADO_FICHA = State.INACTIVE;

    private static final String ENTITY_API_URL = "/api/fichas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FichaRepository fichaRepository;

    @Mock
    private FichaRepository fichaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFichaMockMvc;

    private Ficha ficha;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ficha createEntity(EntityManager em) {
        Ficha ficha = new Ficha().nombreFicha(DEFAULT_NOMBRE_FICHA).estadoFicha(DEFAULT_ESTADO_FICHA);
        return ficha;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ficha createUpdatedEntity(EntityManager em) {
        Ficha ficha = new Ficha().nombreFicha(UPDATED_NOMBRE_FICHA).estadoFicha(UPDATED_ESTADO_FICHA);
        return ficha;
    }

    @BeforeEach
    public void initTest() {
        ficha = createEntity(em);
    }

    @Test
    @Transactional
    void createFicha() throws Exception {
        int databaseSizeBeforeCreate = fichaRepository.findAll().size();
        // Create the Ficha
        restFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isCreated());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeCreate + 1);
        Ficha testFicha = fichaList.get(fichaList.size() - 1);
        assertThat(testFicha.getNombreFicha()).isEqualTo(DEFAULT_NOMBRE_FICHA);
        assertThat(testFicha.getEstadoFicha()).isEqualTo(DEFAULT_ESTADO_FICHA);
    }

    @Test
    @Transactional
    void createFichaWithExistingId() throws Exception {
        // Create the Ficha with an existing ID
        ficha.setId(1L);

        int databaseSizeBeforeCreate = fichaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isBadRequest());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreFichaIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichaRepository.findAll().size();
        // set the field null
        ficha.setNombreFicha(null);

        // Create the Ficha, which fails.

        restFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isBadRequest());

        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEstadoFichaIsRequired() throws Exception {
        int databaseSizeBeforeTest = fichaRepository.findAll().size();
        // set the field null
        ficha.setEstadoFicha(null);

        // Create the Ficha, which fails.

        restFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isBadRequest());

        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFichas() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        // Get all the fichaList
        restFichaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ficha.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreFicha").value(hasItem(DEFAULT_NOMBRE_FICHA)))
            .andExpect(jsonPath("$.[*].estadoFicha").value(hasItem(DEFAULT_ESTADO_FICHA.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFichasWithEagerRelationshipsIsEnabled() throws Exception {
        when(fichaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFichaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(fichaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFichasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(fichaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFichaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(fichaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getFicha() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        // Get the ficha
        restFichaMockMvc
            .perform(get(ENTITY_API_URL_ID, ficha.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ficha.getId().intValue()))
            .andExpect(jsonPath("$.nombreFicha").value(DEFAULT_NOMBRE_FICHA))
            .andExpect(jsonPath("$.estadoFicha").value(DEFAULT_ESTADO_FICHA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFicha() throws Exception {
        // Get the ficha
        restFichaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFicha() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();

        // Update the ficha
        Ficha updatedFicha = fichaRepository.findById(ficha.getId()).get();
        // Disconnect from session so that the updates on updatedFicha are not directly saved in db
        em.detach(updatedFicha);
        updatedFicha.nombreFicha(UPDATED_NOMBRE_FICHA).estadoFicha(UPDATED_ESTADO_FICHA);

        restFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFicha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFicha))
            )
            .andExpect(status().isOk());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
        Ficha testFicha = fichaList.get(fichaList.size() - 1);
        assertThat(testFicha.getNombreFicha()).isEqualTo(UPDATED_NOMBRE_FICHA);
        assertThat(testFicha.getEstadoFicha()).isEqualTo(UPDATED_ESTADO_FICHA);
    }

    @Test
    @Transactional
    void putNonExistingFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ficha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ficha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFichaWithPatch() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();

        // Update the ficha using partial update
        Ficha partialUpdatedFicha = new Ficha();
        partialUpdatedFicha.setId(ficha.getId());

        partialUpdatedFicha.nombreFicha(UPDATED_NOMBRE_FICHA);

        restFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicha))
            )
            .andExpect(status().isOk());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
        Ficha testFicha = fichaList.get(fichaList.size() - 1);
        assertThat(testFicha.getNombreFicha()).isEqualTo(UPDATED_NOMBRE_FICHA);
        assertThat(testFicha.getEstadoFicha()).isEqualTo(DEFAULT_ESTADO_FICHA);
    }

    @Test
    @Transactional
    void fullUpdateFichaWithPatch() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();

        // Update the ficha using partial update
        Ficha partialUpdatedFicha = new Ficha();
        partialUpdatedFicha.setId(ficha.getId());

        partialUpdatedFicha.nombreFicha(UPDATED_NOMBRE_FICHA).estadoFicha(UPDATED_ESTADO_FICHA);

        restFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFicha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFicha))
            )
            .andExpect(status().isOk());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
        Ficha testFicha = fichaList.get(fichaList.size() - 1);
        assertThat(testFicha.getNombreFicha()).isEqualTo(UPDATED_NOMBRE_FICHA);
        assertThat(testFicha.getEstadoFicha()).isEqualTo(UPDATED_ESTADO_FICHA);
    }

    @Test
    @Transactional
    void patchNonExistingFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ficha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ficha))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFicha() throws Exception {
        int databaseSizeBeforeUpdate = fichaRepository.findAll().size();
        ficha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFichaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ficha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ficha in the database
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFicha() throws Exception {
        // Initialize the database
        fichaRepository.saveAndFlush(ficha);

        int databaseSizeBeforeDelete = fichaRepository.findAll().size();

        // Delete the ficha
        restFichaMockMvc
            .perform(delete(ENTITY_API_URL_ID, ficha.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ficha> fichaList = fichaRepository.findAll();
        assertThat(fichaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
