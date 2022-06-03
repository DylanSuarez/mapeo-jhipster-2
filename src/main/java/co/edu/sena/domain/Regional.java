package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Regional.
 */
@Entity
@Table(name = "regional")
public class Regional implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "nombre_regional", length = 45, nullable = false, unique = true)
    private String nombreRegional;

    @OneToMany(mappedBy = "regional")
    @JsonIgnoreProperties(value = { "docentes", "admins", "programaDeFormacions", "regional" }, allowSetters = true)
    private Set<CentroDeFormacion> centroDeFormacions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Regional id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreRegional() {
        return this.nombreRegional;
    }

    public Regional nombreRegional(String nombreRegional) {
        this.setNombreRegional(nombreRegional);
        return this;
    }

    public void setNombreRegional(String nombreRegional) {
        this.nombreRegional = nombreRegional;
    }

    public Set<CentroDeFormacion> getCentroDeFormacions() {
        return this.centroDeFormacions;
    }

    public void setCentroDeFormacions(Set<CentroDeFormacion> centroDeFormacions) {
        if (this.centroDeFormacions != null) {
            this.centroDeFormacions.forEach(i -> i.setRegional(null));
        }
        if (centroDeFormacions != null) {
            centroDeFormacions.forEach(i -> i.setRegional(this));
        }
        this.centroDeFormacions = centroDeFormacions;
    }

    public Regional centroDeFormacions(Set<CentroDeFormacion> centroDeFormacions) {
        this.setCentroDeFormacions(centroDeFormacions);
        return this;
    }

    public Regional addCentroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.centroDeFormacions.add(centroDeFormacion);
        centroDeFormacion.setRegional(this);
        return this;
    }

    public Regional removeCentroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.centroDeFormacions.remove(centroDeFormacion);
        centroDeFormacion.setRegional(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Regional)) {
            return false;
        }
        return id != null && id.equals(((Regional) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Regional{" +
            "id=" + getId() +
            ", nombreRegional='" + getNombreRegional() + "'" +
            "}";
    }
}
