package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Horario.
 */
@Entity
@Table(name = "horario")
public class Horario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "hora_inicio", nullable = false)
    private Instant horaInicio;

    @NotNull
    @Column(name = "hora_final", nullable = false)
    private Instant horaFinal;

    @NotNull
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @NotNull
    @Size(max = 45)
    @Column(name = "jornada", length = 45, nullable = false)
    private String jornada;

    @OneToMany(mappedBy = "horario")
    @JsonIgnoreProperties(value = { "estudiante", "horario" }, allowSetters = true)
    private Set<EstudianteHorario> estudianteHorarios = new HashSet<>();

    @OneToMany(mappedBy = "horario")
    @JsonIgnoreProperties(value = { "docente", "horario", "clase" }, allowSetters = true)
    private Set<ClaseDocente> claseDocentes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Horario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getHoraInicio() {
        return this.horaInicio;
    }

    public Horario horaInicio(Instant horaInicio) {
        this.setHoraInicio(horaInicio);
        return this;
    }

    public void setHoraInicio(Instant horaInicio) {
        this.horaInicio = horaInicio;
    }

    public Instant getHoraFinal() {
        return this.horaFinal;
    }

    public Horario horaFinal(Instant horaFinal) {
        this.setHoraFinal(horaFinal);
        return this;
    }

    public void setHoraFinal(Instant horaFinal) {
        this.horaFinal = horaFinal;
    }

    public LocalDate getFecha() {
        return this.fecha;
    }

    public Horario fecha(LocalDate fecha) {
        this.setFecha(fecha);
        return this;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getJornada() {
        return this.jornada;
    }

    public Horario jornada(String jornada) {
        this.setJornada(jornada);
        return this;
    }

    public void setJornada(String jornada) {
        this.jornada = jornada;
    }

    public Set<EstudianteHorario> getEstudianteHorarios() {
        return this.estudianteHorarios;
    }

    public void setEstudianteHorarios(Set<EstudianteHorario> estudianteHorarios) {
        if (this.estudianteHorarios != null) {
            this.estudianteHorarios.forEach(i -> i.setHorario(null));
        }
        if (estudianteHorarios != null) {
            estudianteHorarios.forEach(i -> i.setHorario(this));
        }
        this.estudianteHorarios = estudianteHorarios;
    }

    public Horario estudianteHorarios(Set<EstudianteHorario> estudianteHorarios) {
        this.setEstudianteHorarios(estudianteHorarios);
        return this;
    }

    public Horario addEstudianteHorario(EstudianteHorario estudianteHorario) {
        this.estudianteHorarios.add(estudianteHorario);
        estudianteHorario.setHorario(this);
        return this;
    }

    public Horario removeEstudianteHorario(EstudianteHorario estudianteHorario) {
        this.estudianteHorarios.remove(estudianteHorario);
        estudianteHorario.setHorario(null);
        return this;
    }

    public Set<ClaseDocente> getClaseDocentes() {
        return this.claseDocentes;
    }

    public void setClaseDocentes(Set<ClaseDocente> claseDocentes) {
        if (this.claseDocentes != null) {
            this.claseDocentes.forEach(i -> i.setHorario(null));
        }
        if (claseDocentes != null) {
            claseDocentes.forEach(i -> i.setHorario(this));
        }
        this.claseDocentes = claseDocentes;
    }

    public Horario claseDocentes(Set<ClaseDocente> claseDocentes) {
        this.setClaseDocentes(claseDocentes);
        return this;
    }

    public Horario addClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.add(claseDocente);
        claseDocente.setHorario(this);
        return this;
    }

    public Horario removeClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.remove(claseDocente);
        claseDocente.setHorario(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Horario)) {
            return false;
        }
        return id != null && id.equals(((Horario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Horario{" +
            "id=" + getId() +
            ", horaInicio='" + getHoraInicio() + "'" +
            ", horaFinal='" + getHoraFinal() + "'" +
            ", fecha='" + getFecha() + "'" +
            ", jornada='" + getJornada() + "'" +
            "}";
    }
}
