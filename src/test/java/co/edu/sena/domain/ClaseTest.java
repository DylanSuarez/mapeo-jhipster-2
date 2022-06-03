package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClaseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Clase.class);
        Clase clase1 = new Clase();
        clase1.setId(1L);
        Clase clase2 = new Clase();
        clase2.setId(clase1.getId());
        assertThat(clase1).isEqualTo(clase2);
        clase2.setId(2L);
        assertThat(clase1).isNotEqualTo(clase2);
        clase1.setId(null);
        assertThat(clase1).isNotEqualTo(clase2);
    }
}
