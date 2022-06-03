package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FichaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ficha.class);
        Ficha ficha1 = new Ficha();
        ficha1.setId(1L);
        Ficha ficha2 = new Ficha();
        ficha2.setId(ficha1.getId());
        assertThat(ficha1).isEqualTo(ficha2);
        ficha2.setId(2L);
        assertThat(ficha1).isNotEqualTo(ficha2);
        ficha1.setId(null);
        assertThat(ficha1).isNotEqualTo(ficha2);
    }
}
