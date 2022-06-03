package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.Regional;
import co.edu.sena.repository.RegionalRepository;
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
 * Integration tests for the {@link RegionalResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RegionalResourceIT {

    private static final String DEFAULT_NOMBRE_REGIONAL = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_REGIONAL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/regionals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RegionalRepository regionalRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRegionalMockMvc;

    private Regional regional;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Regional createEntity(EntityManager em) {
        Regional regional = new Regional().nombreRegional(DEFAULT_NOMBRE_REGIONAL);
        return regional;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Regional createUpdatedEntity(EntityManager em) {
        Regional regional = new Regional().nombreRegional(UPDATED_NOMBRE_REGIONAL);
        return regional;
    }

    @BeforeEach
    public void initTest() {
        regional = createEntity(em);
    }

    @Test
    @Transactional
    void createRegional() throws Exception {
        int databaseSizeBeforeCreate = regionalRepository.findAll().size();
        // Create the Regional
        restRegionalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(regional)))
            .andExpect(status().isCreated());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeCreate + 1);
        Regional testRegional = regionalList.get(regionalList.size() - 1);
        assertThat(testRegional.getNombreRegional()).isEqualTo(DEFAULT_NOMBRE_REGIONAL);
    }

    @Test
    @Transactional
    void createRegionalWithExistingId() throws Exception {
        // Create the Regional with an existing ID
        regional.setId(1L);

        int databaseSizeBeforeCreate = regionalRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRegionalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(regional)))
            .andExpect(status().isBadRequest());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreRegionalIsRequired() throws Exception {
        int databaseSizeBeforeTest = regionalRepository.findAll().size();
        // set the field null
        regional.setNombreRegional(null);

        // Create the Regional, which fails.

        restRegionalMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(regional)))
            .andExpect(status().isBadRequest());

        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRegionals() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        // Get all the regionalList
        restRegionalMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(regional.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombreRegional").value(hasItem(DEFAULT_NOMBRE_REGIONAL)));
    }

    @Test
    @Transactional
    void getRegional() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        // Get the regional
        restRegionalMockMvc
            .perform(get(ENTITY_API_URL_ID, regional.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(regional.getId().intValue()))
            .andExpect(jsonPath("$.nombreRegional").value(DEFAULT_NOMBRE_REGIONAL));
    }

    @Test
    @Transactional
    void getNonExistingRegional() throws Exception {
        // Get the regional
        restRegionalMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRegional() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();

        // Update the regional
        Regional updatedRegional = regionalRepository.findById(regional.getId()).get();
        // Disconnect from session so that the updates on updatedRegional are not directly saved in db
        em.detach(updatedRegional);
        updatedRegional.nombreRegional(UPDATED_NOMBRE_REGIONAL);

        restRegionalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRegional.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRegional))
            )
            .andExpect(status().isOk());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
        Regional testRegional = regionalList.get(regionalList.size() - 1);
        assertThat(testRegional.getNombreRegional()).isEqualTo(UPDATED_NOMBRE_REGIONAL);
    }

    @Test
    @Transactional
    void putNonExistingRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, regional.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(regional))
            )
            .andExpect(status().isBadRequest());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(regional))
            )
            .andExpect(status().isBadRequest());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(regional)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRegionalWithPatch() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();

        // Update the regional using partial update
        Regional partialUpdatedRegional = new Regional();
        partialUpdatedRegional.setId(regional.getId());

        partialUpdatedRegional.nombreRegional(UPDATED_NOMBRE_REGIONAL);

        restRegionalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegional.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegional))
            )
            .andExpect(status().isOk());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
        Regional testRegional = regionalList.get(regionalList.size() - 1);
        assertThat(testRegional.getNombreRegional()).isEqualTo(UPDATED_NOMBRE_REGIONAL);
    }

    @Test
    @Transactional
    void fullUpdateRegionalWithPatch() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();

        // Update the regional using partial update
        Regional partialUpdatedRegional = new Regional();
        partialUpdatedRegional.setId(regional.getId());

        partialUpdatedRegional.nombreRegional(UPDATED_NOMBRE_REGIONAL);

        restRegionalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRegional.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRegional))
            )
            .andExpect(status().isOk());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
        Regional testRegional = regionalList.get(regionalList.size() - 1);
        assertThat(testRegional.getNombreRegional()).isEqualTo(UPDATED_NOMBRE_REGIONAL);
    }

    @Test
    @Transactional
    void patchNonExistingRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, regional.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(regional))
            )
            .andExpect(status().isBadRequest());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(regional))
            )
            .andExpect(status().isBadRequest());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRegional() throws Exception {
        int databaseSizeBeforeUpdate = regionalRepository.findAll().size();
        regional.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRegionalMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(regional)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Regional in the database
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRegional() throws Exception {
        // Initialize the database
        regionalRepository.saveAndFlush(regional);

        int databaseSizeBeforeDelete = regionalRepository.findAll().size();

        // Delete the regional
        restRegionalMockMvc
            .perform(delete(ENTITY_API_URL_ID, regional.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Regional> regionalList = regionalRepository.findAll();
        assertThat(regionalList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
