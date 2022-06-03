package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProgramaDeFormacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProgramaDeFormacion.class);
        ProgramaDeFormacion programaDeFormacion1 = new ProgramaDeFormacion();
        programaDeFormacion1.setId(1L);
        ProgramaDeFormacion programaDeFormacion2 = new ProgramaDeFormacion();
        programaDeFormacion2.setId(programaDeFormacion1.getId());
        assertThat(programaDeFormacion1).isEqualTo(programaDeFormacion2);
        programaDeFormacion2.setId(2L);
        assertThat(programaDeFormacion1).isNotEqualTo(programaDeFormacion2);
        programaDeFormacion1.setId(null);
        assertThat(programaDeFormacion1).isNotEqualTo(programaDeFormacion2);
    }
}
