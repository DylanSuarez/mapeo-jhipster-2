package co.edu.sena.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import co.edu.sena.IntegrationTest;
import co.edu.sena.domain.ProgramaDeFormacion;
import co.edu.sena.domain.enumeration.State;
import co.edu.sena.repository.ProgramaDeFormacionRepository;
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
 * Integration tests for the {@link ProgramaDeFormacionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ProgramaDeFormacionResourceIT {

    private static final String DEFAULT_NOMBRE_PROGRAMA = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE_PROGRAMA = "BBBBBBBBBB";

    private static final State DEFAULT_ESTADO_PROGRAMA = State.ACTIVE;
    private static final State UPDATED_ESTADO_PROGRAMA = State.INACTIVE;

    private static final String ENTITY_API_URL = "/api/programa-de-formacions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProgramaDeFormacionRepository programaDeFormacionRepository;

    @Mock
    private ProgramaDeFormacionRepository programaDeFormacionRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProgramaDeFormacionMockMvc;

    private ProgramaDeFormacion programaDeFormacion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProgramaDeFormacion createEntity(EntityManager em) {
        ProgramaDeFormacion programaDeFormacion = new ProgramaDeFormacion()
            .nombrePrograma(DEFAULT_NOMBRE_PROGRAMA)
            .estadoPrograma(DEFAULT_ESTADO_PROGRAMA);
        return programaDeFormacion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProgramaDeFormacion createUpdatedEntity(EntityManager em) {
        ProgramaDeFormacion programaDeFormacion = new ProgramaDeFormacion()
            .nombrePrograma(UPDATED_NOMBRE_PROGRAMA)
            .estadoPrograma(UPDATED_ESTADO_PROGRAMA);
        return programaDeFormacion;
    }

    @BeforeEach
    public void initTest() {
        programaDeFormacion = createEntity(em);
    }

    @Test
    @Transactional
    void createProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeCreate = programaDeFormacionRepository.findAll().size();
        // Create the ProgramaDeFormacion
        restProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isCreated());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeCreate + 1);
        ProgramaDeFormacion testProgramaDeFormacion = programaDeFormacionList.get(programaDeFormacionList.size() - 1);
        assertThat(testProgramaDeFormacion.getNombrePrograma()).isEqualTo(DEFAULT_NOMBRE_PROGRAMA);
        assertThat(testProgramaDeFormacion.getEstadoPrograma()).isEqualTo(DEFAULT_ESTADO_PROGRAMA);
    }

    @Test
    @Transactional
    void createProgramaDeFormacionWithExistingId() throws Exception {
        // Create the ProgramaDeFormacion with an existing ID
        programaDeFormacion.setId(1L);

        int databaseSizeBeforeCreate = programaDeFormacionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNombreProgramaIsRequired() throws Exception {
        int databaseSizeBeforeTest = programaDeFormacionRepository.findAll().size();
        // set the field null
        programaDeFormacion.setNombrePrograma(null);

        // Create the ProgramaDeFormacion, which fails.

        restProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEstadoProgramaIsRequired() throws Exception {
        int databaseSizeBeforeTest = programaDeFormacionRepository.findAll().size();
        // set the field null
        programaDeFormacion.setEstadoPrograma(null);

        // Create the ProgramaDeFormacion, which fails.

        restProgramaDeFormacionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProgramaDeFormacions() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        // Get all the programaDeFormacionList
        restProgramaDeFormacionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(programaDeFormacion.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombrePrograma").value(hasItem(DEFAULT_NOMBRE_PROGRAMA)))
            .andExpect(jsonPath("$.[*].estadoPrograma").value(hasItem(DEFAULT_ESTADO_PROGRAMA.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProgramaDeFormacionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(programaDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(programaDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProgramaDeFormacionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(programaDeFormacionRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(programaDeFormacionRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getProgramaDeFormacion() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        // Get the programaDeFormacion
        restProgramaDeFormacionMockMvc
            .perform(get(ENTITY_API_URL_ID, programaDeFormacion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(programaDeFormacion.getId().intValue()))
            .andExpect(jsonPath("$.nombrePrograma").value(DEFAULT_NOMBRE_PROGRAMA))
            .andExpect(jsonPath("$.estadoPrograma").value(DEFAULT_ESTADO_PROGRAMA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProgramaDeFormacion() throws Exception {
        // Get the programaDeFormacion
        restProgramaDeFormacionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProgramaDeFormacion() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();

        // Update the programaDeFormacion
        ProgramaDeFormacion updatedProgramaDeFormacion = programaDeFormacionRepository.findById(programaDeFormacion.getId()).get();
        // Disconnect from session so that the updates on updatedProgramaDeFormacion are not directly saved in db
        em.detach(updatedProgramaDeFormacion);
        updatedProgramaDeFormacion.nombrePrograma(UPDATED_NOMBRE_PROGRAMA).estadoPrograma(UPDATED_ESTADO_PROGRAMA);

        restProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProgramaDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ProgramaDeFormacion testProgramaDeFormacion = programaDeFormacionList.get(programaDeFormacionList.size() - 1);
        assertThat(testProgramaDeFormacion.getNombrePrograma()).isEqualTo(UPDATED_NOMBRE_PROGRAMA);
        assertThat(testProgramaDeFormacion.getEstadoPrograma()).isEqualTo(UPDATED_ESTADO_PROGRAMA);
    }

    @Test
    @Transactional
    void putNonExistingProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, programaDeFormacion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProgramaDeFormacionWithPatch() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();

        // Update the programaDeFormacion using partial update
        ProgramaDeFormacion partialUpdatedProgramaDeFormacion = new ProgramaDeFormacion();
        partialUpdatedProgramaDeFormacion.setId(programaDeFormacion.getId());

        restProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProgramaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ProgramaDeFormacion testProgramaDeFormacion = programaDeFormacionList.get(programaDeFormacionList.size() - 1);
        assertThat(testProgramaDeFormacion.getNombrePrograma()).isEqualTo(DEFAULT_NOMBRE_PROGRAMA);
        assertThat(testProgramaDeFormacion.getEstadoPrograma()).isEqualTo(DEFAULT_ESTADO_PROGRAMA);
    }

    @Test
    @Transactional
    void fullUpdateProgramaDeFormacionWithPatch() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();

        // Update the programaDeFormacion using partial update
        ProgramaDeFormacion partialUpdatedProgramaDeFormacion = new ProgramaDeFormacion();
        partialUpdatedProgramaDeFormacion.setId(programaDeFormacion.getId());

        partialUpdatedProgramaDeFormacion.nombrePrograma(UPDATED_NOMBRE_PROGRAMA).estadoPrograma(UPDATED_ESTADO_PROGRAMA);

        restProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProgramaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProgramaDeFormacion))
            )
            .andExpect(status().isOk());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
        ProgramaDeFormacion testProgramaDeFormacion = programaDeFormacionList.get(programaDeFormacionList.size() - 1);
        assertThat(testProgramaDeFormacion.getNombrePrograma()).isEqualTo(UPDATED_NOMBRE_PROGRAMA);
        assertThat(testProgramaDeFormacion.getEstadoPrograma()).isEqualTo(UPDATED_ESTADO_PROGRAMA);
    }

    @Test
    @Transactional
    void patchNonExistingProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, programaDeFormacion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProgramaDeFormacion() throws Exception {
        int databaseSizeBeforeUpdate = programaDeFormacionRepository.findAll().size();
        programaDeFormacion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProgramaDeFormacionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(programaDeFormacion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProgramaDeFormacion in the database
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProgramaDeFormacion() throws Exception {
        // Initialize the database
        programaDeFormacionRepository.saveAndFlush(programaDeFormacion);

        int databaseSizeBeforeDelete = programaDeFormacionRepository.findAll().size();

        // Delete the programaDeFormacion
        restProgramaDeFormacionMockMvc
            .perform(delete(ENTITY_API_URL_ID, programaDeFormacion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProgramaDeFormacion> programaDeFormacionList = programaDeFormacionRepository.findAll();
        assertThat(programaDeFormacionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
