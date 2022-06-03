package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RegionalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Regional.class);
        Regional regional1 = new Regional();
        regional1.setId(1L);
        Regional regional2 = new Regional();
        regional2.setId(regional1.getId());
        assertThat(regional1).isEqualTo(regional2);
        regional2.setId(2L);
        assertThat(regional1).isNotEqualTo(regional2);
        regional1.setId(null);
        assertThat(regional1).isNotEqualTo(regional2);
    }
}
