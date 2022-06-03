package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClaseProgramaDeFormacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClaseProgramaDeFormacion.class);
        ClaseProgramaDeFormacion claseProgramaDeFormacion1 = new ClaseProgramaDeFormacion();
        claseProgramaDeFormacion1.setId(1L);
        ClaseProgramaDeFormacion claseProgramaDeFormacion2 = new ClaseProgramaDeFormacion();
        claseProgramaDeFormacion2.setId(claseProgramaDeFormacion1.getId());
        assertThat(claseProgramaDeFormacion1).isEqualTo(claseProgramaDeFormacion2);
        claseProgramaDeFormacion2.setId(2L);
        assertThat(claseProgramaDeFormacion1).isNotEqualTo(claseProgramaDeFormacion2);
        claseProgramaDeFormacion1.setId(null);
        assertThat(claseProgramaDeFormacion1).isNotEqualTo(claseProgramaDeFormacion2);
    }
}
