package co.edu.sena.domain;

import co.edu.sena.domain.enumeration.State;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A ProgramaDeFormacion.
 */
@Entity
@Table(name = "programa_de_formacion")
public class ProgramaDeFormacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "nombre_programa", length = 45, nullable = false, unique = true)
    private String nombrePrograma;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_programa", nullable = false)
    private State estadoPrograma;

    @OneToMany(mappedBy = "programadeformacion")
    @JsonIgnoreProperties(value = { "estudianteHorarios", "customer", "programadeformacion", "trimestre", "ficha" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    @OneToMany(mappedBy = "programadeformacion")
    @JsonIgnoreProperties(value = { "programadeformacion" }, allowSetters = true)
    private Set<ClaseProgramaDeFormacion> claseProgramaDeFormacions = new HashSet<>();

    @OneToMany(mappedBy = "programadeformacion")
    @JsonIgnoreProperties(value = { "estudiantes", "claseFichas", "programadeformacion" }, allowSetters = true)
    private Set<Ficha> fichas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "docentes", "admins", "programaDeFormacions", "regional" }, allowSetters = true)
    private CentroDeFormacion centroDeFormacion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "claseDocentes", "programaDeFormacions", "claseFichas", "trimestre" }, allowSetters = true)
    private Clase clase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ProgramaDeFormacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombrePrograma() {
        return this.nombrePrograma;
    }

    public ProgramaDeFormacion nombrePrograma(String nombrePrograma) {
        this.setNombrePrograma(nombrePrograma);
        return this;
    }

    public void setNombrePrograma(String nombrePrograma) {
        this.nombrePrograma = nombrePrograma;
    }

    public State getEstadoPrograma() {
        return this.estadoPrograma;
    }

    public ProgramaDeFormacion estadoPrograma(State estadoPrograma) {
        this.setEstadoPrograma(estadoPrograma);
        return this;
    }

    public void setEstadoPrograma(State estadoPrograma) {
        this.estadoPrograma = estadoPrograma;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.setProgramadeformacion(null));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.setProgramadeformacion(this));
        }
        this.estudiantes = estudiantes;
    }

    public ProgramaDeFormacion estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public ProgramaDeFormacion addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.setProgramadeformacion(this);
        return this;
    }

    public ProgramaDeFormacion removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.setProgramadeformacion(null);
        return this;
    }

    public Set<ClaseProgramaDeFormacion> getClaseProgramaDeFormacions() {
        return this.claseProgramaDeFormacions;
    }

    public void setClaseProgramaDeFormacions(Set<ClaseProgramaDeFormacion> claseProgramaDeFormacions) {
        if (this.claseProgramaDeFormacions != null) {
            this.claseProgramaDeFormacions.forEach(i -> i.setProgramadeformacion(null));
        }
        if (claseProgramaDeFormacions != null) {
            claseProgramaDeFormacions.forEach(i -> i.setProgramadeformacion(this));
        }
        this.claseProgramaDeFormacions = claseProgramaDeFormacions;
    }

    public ProgramaDeFormacion claseProgramaDeFormacions(Set<ClaseProgramaDeFormacion> claseProgramaDeFormacions) {
        this.setClaseProgramaDeFormacions(claseProgramaDeFormacions);
        return this;
    }

    public ProgramaDeFormacion addClaseProgramaDeFormacion(ClaseProgramaDeFormacion claseProgramaDeFormacion) {
        this.claseProgramaDeFormacions.add(claseProgramaDeFormacion);
        claseProgramaDeFormacion.setProgramadeformacion(this);
        return this;
    }

    public ProgramaDeFormacion removeClaseProgramaDeFormacion(ClaseProgramaDeFormacion claseProgramaDeFormacion) {
        this.claseProgramaDeFormacions.remove(claseProgramaDeFormacion);
        claseProgramaDeFormacion.setProgramadeformacion(null);
        return this;
    }

    public Set<Ficha> getFichas() {
        return this.fichas;
    }

    public void setFichas(Set<Ficha> fichas) {
        if (this.fichas != null) {
            this.fichas.forEach(i -> i.setProgramadeformacion(null));
        }
        if (fichas != null) {
            fichas.forEach(i -> i.setProgramadeformacion(this));
        }
        this.fichas = fichas;
    }

    public ProgramaDeFormacion fichas(Set<Ficha> fichas) {
        this.setFichas(fichas);
        return this;
    }

    public ProgramaDeFormacion addFicha(Ficha ficha) {
        this.fichas.add(ficha);
        ficha.setProgramadeformacion(this);
        return this;
    }

    public ProgramaDeFormacion removeFicha(Ficha ficha) {
        this.fichas.remove(ficha);
        ficha.setProgramadeformacion(null);
        return this;
    }

    public CentroDeFormacion getCentroDeFormacion() {
        return this.centroDeFormacion;
    }

    public void setCentroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.centroDeFormacion = centroDeFormacion;
    }

    public ProgramaDeFormacion centroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.setCentroDeFormacion(centroDeFormacion);
        return this;
    }

    public Clase getClase() {
        return this.clase;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }

    public ProgramaDeFormacion clase(Clase clase) {
        this.setClase(clase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProgramaDeFormacion)) {
            return false;
        }
        return id != null && id.equals(((ProgramaDeFormacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProgramaDeFormacion{" +
            "id=" + getId() +
            ", nombrePrograma='" + getNombrePrograma() + "'" +
            ", estadoPrograma='" + getEstadoPrograma() + "'" +
            "}";
    }
}
