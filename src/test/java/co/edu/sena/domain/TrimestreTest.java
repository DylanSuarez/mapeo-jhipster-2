package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TrimestreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Trimestre.class);
        Trimestre trimestre1 = new Trimestre();
        trimestre1.setId(1L);
        Trimestre trimestre2 = new Trimestre();
        trimestre2.setId(trimestre1.getId());
        assertThat(trimestre1).isEqualTo(trimestre2);
        trimestre2.setId(2L);
        assertThat(trimestre1).isNotEqualTo(trimestre2);
        trimestre1.setId(null);
        assertThat(trimestre1).isNotEqualTo(trimestre2);
    }
}
