package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.ClaseFicha;
import co.edu.sena.repository.ClaseFichaRepository;
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
 * Integration tests for the {@link ClaseFichaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ClaseFichaResourceIT {

    private static final String ENTITY_API_URL = "/api/clase-fichas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClaseFichaRepository claseFichaRepository;

    @Mock
    private ClaseFichaRepository claseFichaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClaseFichaMockMvc;

    private ClaseFicha claseFicha;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseFicha createEntity(EntityManager em) {
        ClaseFicha claseFicha = new ClaseFicha();
        return claseFicha;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClaseFicha createUpdatedEntity(EntityManager em) {
        ClaseFicha claseFicha = new ClaseFicha();
        return claseFicha;
    }

    @BeforeEach
    public void initTest() {
        claseFicha = createEntity(em);
    }

    @Test
    @Transactional
    void createClaseFicha() throws Exception {
        int databaseSizeBeforeCreate = claseFichaRepository.findAll().size();
        // Create the ClaseFicha
        restClaseFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseFicha)))
            .andExpect(status().isCreated());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeCreate + 1);
        ClaseFicha testClaseFicha = claseFichaList.get(claseFichaList.size() - 1);
    }

    @Test
    @Transactional
    void createClaseFichaWithExistingId() throws Exception {
        // Create the ClaseFicha with an existing ID
        claseFicha.setId(1L);

        int databaseSizeBeforeCreate = claseFichaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClaseFichaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseFicha)))
            .andExpect(status().isBadRequest());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClaseFichas() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        // Get all the claseFichaList
        restClaseFichaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(claseFicha.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseFichasWithEagerRelationshipsIsEnabled() throws Exception {
        when(claseFichaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseFichaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseFichaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllClaseFichasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(claseFichaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restClaseFichaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(claseFichaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getClaseFicha() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        // Get the claseFicha
        restClaseFichaMockMvc
            .perform(get(ENTITY_API_URL_ID, claseFicha.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(claseFicha.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingClaseFicha() throws Exception {
        // Get the claseFicha
        restClaseFichaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewClaseFicha() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();

        // Update the claseFicha
        ClaseFicha updatedClaseFicha = claseFichaRepository.findById(claseFicha.getId()).get();
        // Disconnect from session so that the updates on updatedClaseFicha are not directly saved in db
        em.detach(updatedClaseFicha);

        restClaseFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClaseFicha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClaseFicha))
            )
            .andExpect(status().isOk());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
        ClaseFicha testClaseFicha = claseFichaList.get(claseFichaList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, claseFicha.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseFicha))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(claseFicha))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(claseFicha)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClaseFichaWithPatch() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();

        // Update the claseFicha using partial update
        ClaseFicha partialUpdatedClaseFicha = new ClaseFicha();
        partialUpdatedClaseFicha.setId(claseFicha.getId());

        restClaseFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseFicha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseFicha))
            )
            .andExpect(status().isOk());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
        ClaseFicha testClaseFicha = claseFichaList.get(claseFichaList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateClaseFichaWithPatch() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();

        // Update the claseFicha using partial update
        ClaseFicha partialUpdatedClaseFicha = new ClaseFicha();
        partialUpdatedClaseFicha.setId(claseFicha.getId());

        restClaseFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClaseFicha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClaseFicha))
            )
            .andExpect(status().isOk());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
        ClaseFicha testClaseFicha = claseFichaList.get(claseFichaList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, claseFicha.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseFicha))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(claseFicha))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClaseFicha() throws Exception {
        int databaseSizeBeforeUpdate = claseFichaRepository.findAll().size();
        claseFicha.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClaseFichaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(claseFicha))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClaseFicha in the database
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClaseFicha() throws Exception {
        // Initialize the database
        claseFichaRepository.saveAndFlush(claseFicha);

        int databaseSizeBeforeDelete = claseFichaRepository.findAll().size();

        // Delete the claseFicha
        restClaseFichaMockMvc
            .perform(delete(ENTITY_API_URL_ID, claseFicha.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClaseFicha> claseFichaList = claseFichaRepository.findAll();
        assertThat(claseFichaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
