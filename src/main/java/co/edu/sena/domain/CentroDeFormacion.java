package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A CentroDeFormacion.
 */
@Entity
@Table(name = "centro_de_formacion")
public class CentroDeFormacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "nombre_centro", length = 45, nullable = false, unique = true)
    private String nombreCentro;

    @OneToMany(mappedBy = "centroDeFormacion")
    @JsonIgnoreProperties(value = { "claseDocentes", "customer", "centroDeFormacion" }, allowSetters = true)
    private Set<Docente> docentes = new HashSet<>();

    @OneToMany(mappedBy = "centroDeFormacion")
    @JsonIgnoreProperties(value = { "customer", "centroDeFormacion" }, allowSetters = true)
    private Set<Admin> admins = new HashSet<>();

    @OneToMany(mappedBy = "centroDeFormacion")
    @JsonIgnoreProperties(
        value = { "estudiantes", "claseProgramaDeFormacions", "fichas", "centroDeFormacion", "clase" },
        allowSetters = true
    )
    private Set<ProgramaDeFormacion> programaDeFormacions = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "centroDeFormacions" }, allowSetters = true)
    private Regional regional;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CentroDeFormacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCentro() {
        return this.nombreCentro;
    }

    public CentroDeFormacion nombreCentro(String nombreCentro) {
        this.setNombreCentro(nombreCentro);
        return this;
    }

    public void setNombreCentro(String nombreCentro) {
        this.nombreCentro = nombreCentro;
    }

    public Set<Docente> getDocentes() {
        return this.docentes;
    }

    public void setDocentes(Set<Docente> docentes) {
        if (this.docentes != null) {
            this.docentes.forEach(i -> i.setCentroDeFormacion(null));
        }
        if (docentes != null) {
            docentes.forEach(i -> i.setCentroDeFormacion(this));
        }
        this.docentes = docentes;
    }

    public CentroDeFormacion docentes(Set<Docente> docentes) {
        this.setDocentes(docentes);
        return this;
    }

    public CentroDeFormacion addDocente(Docente docente) {
        this.docentes.add(docente);
        docente.setCentroDeFormacion(this);
        return this;
    }

    public CentroDeFormacion removeDocente(Docente docente) {
        this.docentes.remove(docente);
        docente.setCentroDeFormacion(null);
        return this;
    }

    public Set<Admin> getAdmins() {
        return this.admins;
    }

    public void setAdmins(Set<Admin> admins) {
        if (this.admins != null) {
            this.admins.forEach(i -> i.setCentroDeFormacion(null));
        }
        if (admins != null) {
            admins.forEach(i -> i.setCentroDeFormacion(this));
        }
        this.admins = admins;
    }

    public CentroDeFormacion admins(Set<Admin> admins) {
        this.setAdmins(admins);
        return this;
    }

    public CentroDeFormacion addAdmin(Admin admin) {
        this.admins.add(admin);
        admin.setCentroDeFormacion(this);
        return this;
    }

    public CentroDeFormacion removeAdmin(Admin admin) {
        this.admins.remove(admin);
        admin.setCentroDeFormacion(null);
        return this;
    }

    public Set<ProgramaDeFormacion> getProgramaDeFormacions() {
        return this.programaDeFormacions;
    }

    public void setProgramaDeFormacions(Set<ProgramaDeFormacion> programaDeFormacions) {
        if (this.programaDeFormacions != null) {
            this.programaDeFormacions.forEach(i -> i.setCentroDeFormacion(null));
        }
        if (programaDeFormacions != null) {
            programaDeFormacions.forEach(i -> i.setCentroDeFormacion(this));
        }
        this.programaDeFormacions = programaDeFormacions;
    }

    public CentroDeFormacion programaDeFormacions(Set<ProgramaDeFormacion> programaDeFormacions) {
        this.setProgramaDeFormacions(programaDeFormacions);
        return this;
    }

    public CentroDeFormacion addProgramaDeFormacion(ProgramaDeFormacion programaDeFormacion) {
        this.programaDeFormacions.add(programaDeFormacion);
        programaDeFormacion.setCentroDeFormacion(this);
        return this;
    }

    public CentroDeFormacion removeProgramaDeFormacion(ProgramaDeFormacion programaDeFormacion) {
        this.programaDeFormacions.remove(programaDeFormacion);
        programaDeFormacion.setCentroDeFormacion(null);
        return this;
    }

    public Regional getRegional() {
        return this.regional;
    }

    public void setRegional(Regional regional) {
        this.regional = regional;
    }

    public CentroDeFormacion regional(Regional regional) {
        this.setRegional(regional);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CentroDeFormacion)) {
            return false;
        }
        return id != null && id.equals(((CentroDeFormacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CentroDeFormacion{" +
            "id=" + getId() +
            ", nombreCentro='" + getNombreCentro() + "'" +
            "}";
    }
}
