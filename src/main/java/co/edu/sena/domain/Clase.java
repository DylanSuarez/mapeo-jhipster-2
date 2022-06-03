package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Clase.
 */
@Entity
@Table(name = "clase")
public class Clase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "nombre_clase", length = 45, nullable = false, unique = true)
    private String nombreClase;

    @OneToMany(mappedBy = "clase")
    @JsonIgnoreProperties(value = { "docente", "horario", "clase" }, allowSetters = true)
    private Set<ClaseDocente> claseDocentes = new HashSet<>();

    @OneToMany(mappedBy = "clase")
    @JsonIgnoreProperties(
        value = { "estudiantes", "claseProgramaDeFormacions", "fichas", "centroDeFormacion", "clase" },
        allowSetters = true
    )
    private Set<ProgramaDeFormacion> programaDeFormacions = new HashSet<>();

    @OneToMany(mappedBy = "clase")
    @JsonIgnoreProperties(value = { "ficha", "clase" }, allowSetters = true)
    private Set<ClaseFicha> claseFichas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "clases" }, allowSetters = true)
    private Trimestre trimestre;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Clase id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreClase() {
        return this.nombreClase;
    }

    public Clase nombreClase(String nombreClase) {
        this.setNombreClase(nombreClase);
        return this;
    }

    public void setNombreClase(String nombreClase) {
        this.nombreClase = nombreClase;
    }

    public Set<ClaseDocente> getClaseDocentes() {
        return this.claseDocentes;
    }

    public void setClaseDocentes(Set<ClaseDocente> claseDocentes) {
        if (this.claseDocentes != null) {
            this.claseDocentes.forEach(i -> i.setClase(null));
        }
        if (claseDocentes != null) {
            claseDocentes.forEach(i -> i.setClase(this));
        }
        this.claseDocentes = claseDocentes;
    }

    public Clase claseDocentes(Set<ClaseDocente> claseDocentes) {
        this.setClaseDocentes(claseDocentes);
        return this;
    }

    public Clase addClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.add(claseDocente);
        claseDocente.setClase(this);
        return this;
    }

    public Clase removeClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.remove(claseDocente);
        claseDocente.setClase(null);
        return this;
    }

    public Set<ProgramaDeFormacion> getProgramaDeFormacions() {
        return this.programaDeFormacions;
    }

    public void setProgramaDeFormacions(Set<ProgramaDeFormacion> programaDeFormacions) {
        if (this.programaDeFormacions != null) {
            this.programaDeFormacions.forEach(i -> i.setClase(null));
        }
        if (programaDeFormacions != null) {
            programaDeFormacions.forEach(i -> i.setClase(this));
        }
        this.programaDeFormacions = programaDeFormacions;
    }

    public Clase programaDeFormacions(Set<ProgramaDeFormacion> programaDeFormacions) {
        this.setProgramaDeFormacions(programaDeFormacions);
        return this;
    }

    public Clase addProgramaDeFormacion(ProgramaDeFormacion programaDeFormacion) {
        this.programaDeFormacions.add(programaDeFormacion);
        programaDeFormacion.setClase(this);
        return this;
    }

    public Clase removeProgramaDeFormacion(ProgramaDeFormacion programaDeFormacion) {
        this.programaDeFormacions.remove(programaDeFormacion);
        programaDeFormacion.setClase(null);
        return this;
    }

    public Set<ClaseFicha> getClaseFichas() {
        return this.claseFichas;
    }

    public void setClaseFichas(Set<ClaseFicha> claseFichas) {
        if (this.claseFichas != null) {
            this.claseFichas.forEach(i -> i.setClase(null));
        }
        if (claseFichas != null) {
            claseFichas.forEach(i -> i.setClase(this));
        }
        this.claseFichas = claseFichas;
    }

    public Clase claseFichas(Set<ClaseFicha> claseFichas) {
        this.setClaseFichas(claseFichas);
        return this;
    }

    public Clase addClaseFicha(ClaseFicha claseFicha) {
        this.claseFichas.add(claseFicha);
        claseFicha.setClase(this);
        return this;
    }

    public Clase removeClaseFicha(ClaseFicha claseFicha) {
        this.claseFichas.remove(claseFicha);
        claseFicha.setClase(null);
        return this;
    }

    public Trimestre getTrimestre() {
        return this.trimestre;
    }

    public void setTrimestre(Trimestre trimestre) {
        this.trimestre = trimestre;
    }

    public Clase trimestre(Trimestre trimestre) {
        this.setTrimestre(trimestre);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Clase)) {
            return false;
        }
        return id != null && id.equals(((Clase) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Clase{" +
            "id=" + getId() +
            ", nombreClase='" + getNombreClase() + "'" +
            "}";
    }
}
