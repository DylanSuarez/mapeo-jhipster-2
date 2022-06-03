package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A EstudianteHorario.
 */
@Entity
@Table(name = "estudiante_horario")
public class EstudianteHorario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudianteHorarios", "customer", "programadeformacion", "trimestre", "ficha" }, allowSetters = true)
    private Estudiante estudiante;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudianteHorarios", "claseDocentes" }, allowSetters = true)
    private Horario horario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EstudianteHorario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Estudiante getEstudiante() {
        return this.estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public EstudianteHorario estudiante(Estudiante estudiante) {
        this.setEstudiante(estudiante);
        return this;
    }

    public Horario getHorario() {
        return this.horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }

    public EstudianteHorario horario(Horario horario) {
        this.setHorario(horario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EstudianteHorario)) {
            return false;
        }
        return id != null && id.equals(((EstudianteHorario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EstudianteHorario{" +
            "id=" + getId() +
            "}";
    }
}
