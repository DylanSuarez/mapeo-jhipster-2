package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClaseDocenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClaseDocente.class);
        ClaseDocente claseDocente1 = new ClaseDocente();
        claseDocente1.setId(1L);
        ClaseDocente claseDocente2 = new ClaseDocente();
        claseDocente2.setId(claseDocente1.getId());
        assertThat(claseDocente1).isEqualTo(claseDocente2);
        claseDocente2.setId(2L);
        assertThat(claseDocente1).isNotEqualTo(claseDocente2);
        claseDocente1.setId(null);
        assertThat(claseDocente1).isNotEqualTo(claseDocente2);
    }
}
