package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ClaseProgramaDeFormacion.
 */
@Entity
@Table(name = "clase_programa_de_formacion")
public class ClaseProgramaDeFormacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "estudiantes", "claseProgramaDeFormacions", "fichas", "centroDeFormacion", "clase" },
        allowSetters = true
    )
    private ProgramaDeFormacion programadeformacion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClaseProgramaDeFormacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProgramaDeFormacion getProgramadeformacion() {
        return this.programadeformacion;
    }

    public void setProgramadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.programadeformacion = programaDeFormacion;
    }

    public ClaseProgramaDeFormacion programadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.setProgramadeformacion(programaDeFormacion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClaseProgramaDeFormacion)) {
            return false;
        }
        return id != null && id.equals(((ClaseProgramaDeFormacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClaseProgramaDeFormacion{" +
            "id=" + getId() +
            "}";
    }
}
