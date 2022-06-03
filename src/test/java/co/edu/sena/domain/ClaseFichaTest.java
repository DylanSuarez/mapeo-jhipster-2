package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClaseFichaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClaseFicha.class);
        ClaseFicha claseFicha1 = new ClaseFicha();
        claseFicha1.setId(1L);
        ClaseFicha claseFicha2 = new ClaseFicha();
        claseFicha2.setId(claseFicha1.getId());
        assertThat(claseFicha1).isEqualTo(claseFicha2);
        claseFicha2.setId(2L);
        assertThat(claseFicha1).isNotEqualTo(claseFicha2);
        claseFicha1.setId(null);
        assertThat(claseFicha1).isNotEqualTo(claseFicha2);
    }
}
