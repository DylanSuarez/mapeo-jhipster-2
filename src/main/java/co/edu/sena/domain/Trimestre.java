package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Trimestre.
 */
@Entity
@Table(name = "trimestre")
public class Trimestre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "num_trimestre", length = 45, nullable = false)
    private String numTrimestre;

    @OneToMany(mappedBy = "trimestre")
    @JsonIgnoreProperties(value = { "estudianteHorarios", "customer", "programadeformacion", "trimestre", "ficha" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    @OneToMany(mappedBy = "trimestre")
    @JsonIgnoreProperties(value = { "claseDocentes", "programaDeFormacions", "claseFichas", "trimestre" }, allowSetters = true)
    private Set<Clase> clases = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Trimestre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumTrimestre() {
        return this.numTrimestre;
    }

    public Trimestre numTrimestre(String numTrimestre) {
        this.setNumTrimestre(numTrimestre);
        return this;
    }

    public void setNumTrimestre(String numTrimestre) {
        this.numTrimestre = numTrimestre;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.setTrimestre(null));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.setTrimestre(this));
        }
        this.estudiantes = estudiantes;
    }

    public Trimestre estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public Trimestre addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.setTrimestre(this);
        return this;
    }

    public Trimestre removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.setTrimestre(null);
        return this;
    }

    public Set<Clase> getClases() {
        return this.clases;
    }

    public void setClases(Set<Clase> clases) {
        if (this.clases != null) {
            this.clases.forEach(i -> i.setTrimestre(null));
        }
        if (clases != null) {
            clases.forEach(i -> i.setTrimestre(this));
        }
        this.clases = clases;
    }

    public Trimestre clases(Set<Clase> clases) {
        this.setClases(clases);
        return this;
    }

    public Trimestre addClase(Clase clase) {
        this.clases.add(clase);
        clase.setTrimestre(this);
        return this;
    }

    public Trimestre removeClase(Clase clase) {
        this.clases.remove(clase);
        clase.setTrimestre(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Trimestre)) {
            return false;
        }
        return id != null && id.equals(((Trimestre) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Trimestre{" +
            "id=" + getId() +
            ", numTrimestre='" + getNumTrimestre() + "'" +
            "}";
    }
}
