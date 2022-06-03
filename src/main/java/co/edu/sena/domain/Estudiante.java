package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Estudiante.
 */
@Entity
@Table(name = "estudiante")
public class Estudiante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "huella", nullable = false, unique = true)
    private Long huella;

    @OneToMany(mappedBy = "estudiante")
    @JsonIgnoreProperties(value = { "estudiante", "horario" }, allowSetters = true)
    private Set<EstudianteHorario> estudianteHorarios = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "estudiantes", "admins", "docentes", "tipoDocumento" }, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(
        value = { "estudiantes", "claseProgramaDeFormacions", "fichas", "centroDeFormacion", "clase" },
        allowSetters = true
    )
    private ProgramaDeFormacion programadeformacion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "clases" }, allowSetters = true)
    private Trimestre trimestre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "claseFichas", "programadeformacion" }, allowSetters = true)
    private Ficha ficha;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estudiante id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHuella() {
        return this.huella;
    }

    public Estudiante huella(Long huella) {
        this.setHuella(huella);
        return this;
    }

    public void setHuella(Long huella) {
        this.huella = huella;
    }

    public Set<EstudianteHorario> getEstudianteHorarios() {
        return this.estudianteHorarios;
    }

    public void setEstudianteHorarios(Set<EstudianteHorario> estudianteHorarios) {
        if (this.estudianteHorarios != null) {
            this.estudianteHorarios.forEach(i -> i.setEstudiante(null));
        }
        if (estudianteHorarios != null) {
            estudianteHorarios.forEach(i -> i.setEstudiante(this));
        }
        this.estudianteHorarios = estudianteHorarios;
    }

    public Estudiante estudianteHorarios(Set<EstudianteHorario> estudianteHorarios) {
        this.setEstudianteHorarios(estudianteHorarios);
        return this;
    }

    public Estudiante addEstudianteHorario(EstudianteHorario estudianteHorario) {
        this.estudianteHorarios.add(estudianteHorario);
        estudianteHorario.setEstudiante(this);
        return this;
    }

    public Estudiante removeEstudianteHorario(EstudianteHorario estudianteHorario) {
        this.estudianteHorarios.remove(estudianteHorario);
        estudianteHorario.setEstudiante(null);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Estudiante customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public ProgramaDeFormacion getProgramadeformacion() {
        return this.programadeformacion;
    }

    public void setProgramadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.programadeformacion = programaDeFormacion;
    }

    public Estudiante programadeformacion(ProgramaDeFormacion programaDeFormacion) {
        this.setProgramadeformacion(programaDeFormacion);
        return this;
    }

    public Trimestre getTrimestre() {
        return this.trimestre;
    }

    public void setTrimestre(Trimestre trimestre) {
        this.trimestre = trimestre;
    }

    public Estudiante trimestre(Trimestre trimestre) {
        this.setTrimestre(trimestre);
        return this;
    }

    public Ficha getFicha() {
        return this.ficha;
    }

    public void setFicha(Ficha ficha) {
        this.ficha = ficha;
    }

    public Estudiante ficha(Ficha ficha) {
        this.setFicha(ficha);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estudiante)) {
            return false;
        }
        return id != null && id.equals(((Estudiante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estudiante{" +
            "id=" + getId() +
            ", huella=" + getHuella() +
            "}";
    }
}
