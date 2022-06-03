package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Trimestre;
import co.edu.sena.repository.TrimestreRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TrimestreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TrimestreResourceIT {

    private static final String DEFAULT_NUM_TRIMESTRE = "AAAAAAAAAA";
    private static final String UPDATED_NUM_TRIMESTRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/trimestres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TrimestreRepository trimestreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTrimestreMockMvc;

    private Trimestre trimestre;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trimestre createEntity(EntityManager em) {
        Trimestre trimestre = new Trimestre().numTrimestre(DEFAULT_NUM_TRIMESTRE);
        return trimestre;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Trimestre createUpdatedEntity(EntityManager em) {
        Trimestre trimestre = new Trimestre().numTrimestre(UPDATED_NUM_TRIMESTRE);
        return trimestre;
    }

    @BeforeEach
    public void initTest() {
        trimestre = createEntity(em);
    }

    @Test
    @Transactional
    void createTrimestre() throws Exception {
        int databaseSizeBeforeCreate = trimestreRepository.findAll().size();
        // Create the Trimestre
        restTrimestreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trimestre)))
            .andExpect(status().isCreated());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeCreate + 1);
        Trimestre testTrimestre = trimestreList.get(trimestreList.size() - 1);
        assertThat(testTrimestre.getNumTrimestre()).isEqualTo(DEFAULT_NUM_TRIMESTRE);
    }

    @Test
    @Transactional
    void createTrimestreWithExistingId() throws Exception {
        // Create the Trimestre with an existing ID
        trimestre.setId(1L);

        int databaseSizeBeforeCreate = trimestreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTrimestreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trimestre)))
            .andExpect(status().isBadRequest());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumTrimestreIsRequired() throws Exception {
        int databaseSizeBeforeTest = trimestreRepository.findAll().size();
        // set the field null
        trimestre.setNumTrimestre(null);

        // Create the Trimestre, which fails.

        restTrimestreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trimestre)))
            .andExpect(status().isBadRequest());

        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTrimestres() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        // Get all the trimestreList
        restTrimestreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(trimestre.getId().intValue())))
            .andExpect(jsonPath("$.[*].numTrimestre").value(hasItem(DEFAULT_NUM_TRIMESTRE)));
    }

    @Test
    @Transactional
    void getTrimestre() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        // Get the trimestre
        restTrimestreMockMvc
            .perform(get(ENTITY_API_URL_ID, trimestre.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(trimestre.getId().intValue()))
            .andExpect(jsonPath("$.numTrimestre").value(DEFAULT_NUM_TRIMESTRE));
    }

    @Test
    @Transactional
    void getNonExistingTrimestre() throws Exception {
        // Get the trimestre
        restTrimestreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTrimestre() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();

        // Update the trimestre
        Trimestre updatedTrimestre = trimestreRepository.findById(trimestre.getId()).get();
        // Disconnect from session so that the updates on updatedTrimestre are not directly saved in db
        em.detach(updatedTrimestre);
        updatedTrimestre.numTrimestre(UPDATED_NUM_TRIMESTRE);

        restTrimestreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTrimestre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTrimestre))
            )
            .andExpect(status().isOk());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
        Trimestre testTrimestre = trimestreList.get(trimestreList.size() - 1);
        assertThat(testTrimestre.getNumTrimestre()).isEqualTo(UPDATED_NUM_TRIMESTRE);
    }

    @Test
    @Transactional
    void putNonExistingTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, trimestre.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trimestre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(trimestre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(trimestre)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTrimestreWithPatch() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();

        // Update the trimestre using partial update
        Trimestre partialUpdatedTrimestre = new Trimestre();
        partialUpdatedTrimestre.setId(trimestre.getId());

        partialUpdatedTrimestre.numTrimestre(UPDATED_NUM_TRIMESTRE);

        restTrimestreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrimestre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrimestre))
            )
            .andExpect(status().isOk());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
        Trimestre testTrimestre = trimestreList.get(trimestreList.size() - 1);
        assertThat(testTrimestre.getNumTrimestre()).isEqualTo(UPDATED_NUM_TRIMESTRE);
    }

    @Test
    @Transactional
    void fullUpdateTrimestreWithPatch() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();

        // Update the trimestre using partial update
        Trimestre partialUpdatedTrimestre = new Trimestre();
        partialUpdatedTrimestre.setId(trimestre.getId());

        partialUpdatedTrimestre.numTrimestre(UPDATED_NUM_TRIMESTRE);

        restTrimestreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTrimestre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTrimestre))
            )
            .andExpect(status().isOk());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
        Trimestre testTrimestre = trimestreList.get(trimestreList.size() - 1);
        assertThat(testTrimestre.getNumTrimestre()).isEqualTo(UPDATED_NUM_TRIMESTRE);
    }

    @Test
    @Transactional
    void patchNonExistingTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, trimestre.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trimestre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(trimestre))
            )
            .andExpect(status().isBadRequest());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTrimestre() throws Exception {
        int databaseSizeBeforeUpdate = trimestreRepository.findAll().size();
        trimestre.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTrimestreMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(trimestre))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Trimestre in the database
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTrimestre() throws Exception {
        // Initialize the database
        trimestreRepository.saveAndFlush(trimestre);

        int databaseSizeBeforeDelete = trimestreRepository.findAll().size();

        // Delete the trimestre
        restTrimestreMockMvc
            .perform(delete(ENTITY_API_URL_ID, trimestre.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Trimestre> trimestreList = trimestreRepository.findAll();
        assertThat(trimestreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
