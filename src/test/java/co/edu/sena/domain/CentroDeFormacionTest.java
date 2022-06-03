package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CentroDeFormacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CentroDeFormacion.class);
        CentroDeFormacion centroDeFormacion1 = new CentroDeFormacion();
        centroDeFormacion1.setId(1L);
        CentroDeFormacion centroDeFormacion2 = new CentroDeFormacion();
        centroDeFormacion2.setId(centroDeFormacion1.getId());
        assertThat(centroDeFormacion1).isEqualTo(centroDeFormacion2);
        centroDeFormacion2.setId(2L);
        assertThat(centroDeFormacion1).isNotEqualTo(centroDeFormacion2);
        centroDeFormacion1.setId(null);
        assertThat(centroDeFormacion1).isNotEqualTo(centroDeFormacion2);
    }
}
