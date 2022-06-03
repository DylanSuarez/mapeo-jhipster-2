package co.edu.sena.domain;

import co.edu.sena.domain.enumeration.State;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Ficha.
 */
@Entity
@Table(name = "ficha")
public class Ficha implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "nombre_ficha", length = 45, nullable = false, unique = true)
    private String nombreFicha;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_ficha", nullable = false)
    private State estadoFicha;

    @OneToMany(mappedBy = "ficha")
    @JsonIgnoreProperties(value = { "estudianteHorarios", "customer", "programadeformacion", "trimestre", "ficha" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    @OneToMany(mappedBy = "ficha")
    @JsonIgnoreProperties(value = { "ficha", "clase" }, allowSetters = true)
    private Set<ClaseFicha> claseFichas = new HashSet<>();

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

    public Ficha id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreFicha() {
        return this.nombreFicha;
    }

    public Ficha nombreFicha(String nombreFicha) {
        this.setNombreFicha(nombreFicha);
        return this;
    }

    public void setNombreFicha(String nombreFicha) {
        this.nombreFicha = nombreFicha;
    }

    public State getEstadoFicha() {
        return this.estadoFicha;
    }

    public Ficha estadoFicha(State estadoFicha) {
        this.setEstadoFicha(estadoFicha);
        return this;
    }

    public void setEstadoFicha(State estadoFicha) {
        this.estadoFicha = estadoFicha;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.setFicha(null));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.setFicha(this));
        }
        this.estudiantes = estudiantes;
    }

    public Ficha estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public Ficha addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.setFicha(this);
        return this;
    }

    public Ficha removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.setFicha(null);
        return this;
    }

    public Set<ClaseFicha> getClaseFichas() {
        return this.claseFichas;
    }

    public void setClaseFichas(Set<ClaseFicha> claseFichas) {
        if (this.claseFichas != null) {
            this.claseFichas.forEach(i -> i.setFicha(null));
        }
        if (claseFichas != null) {
            claseFichas.forEach(i -> i.setFicha(this));
        }
        this.claseFichas = claseFichas;
    }

    public Ficha claseFichas(Set<ClaseFicha> claseFichas) {
        this.setClaseFichas(claseFichas);
        return this;
    }

    public Ficha addClaseFicha(ClaseFicha claseFicha) {
        this.claseFichas.add(claseFicha);
        claseFicha.setFicha(this);
        return this;
    }

    public Ficha removeClaseFicha(ClaseFicha claseFicha) {
        this.claseFichas.remove(claseFicha);
        claseFicha.setFicha(null);
        return this;
    }

    public ProgramaDeFormacion getProgramadeformacion() {
        return this.programadeformacion;
    }

    public void setProgramadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.programadeformacion = programaDeFormacion;
    }

    public Ficha programadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.setProgramadeformacion(programaDeFormacion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ficha)) {
            return false;
        }
        return id != null && id.equals(((Ficha) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ficha{" +
            "id=" + getId() +
            ", nombreFicha='" + getNombreFicha() + "'" +
            ", estadoFicha='" + getEstadoFicha() + "'" +
            "}";
    }
}
