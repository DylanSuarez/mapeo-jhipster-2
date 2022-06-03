package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EstudianteHorarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EstudianteHorario.class);
        EstudianteHorario estudianteHorario1 = new EstudianteHorario();
        estudianteHorario1.setId(1L);
        EstudianteHorario estudianteHorario2 = new EstudianteHorario();
        estudianteHorario2.setId(estudianteHorario1.getId());
        assertThat(estudianteHorario1).isEqualTo(estudianteHorario2);
        estudianteHorario2.setId(2L);
        assertThat(estudianteHorario1).isNotEqualTo(estudianteHorario2);
        estudianteHorario1.setId(null);
        assertThat(estudianteHorario1).isNotEqualTo(estudianteHorario2);
    }
}
