package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Docente.
 */
@Entity
@Table(name = "docente")
public class Docente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "docente")
    @JsonIgnoreProperties(value = { "docente", "horario", "clase" }, allowSetters = true)
    private Set<ClaseDocente> claseDocentes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "estudiantes", "admins", "docentes", "tipoDocumento" }, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "docentes", "admins", "programaDeFormacions", "regional" }, allowSetters = true)
    private CentroDeFormacion centroDeFormacion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Docente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<ClaseDocente> getClaseDocentes() {
        return this.claseDocentes;
    }

    public void setClaseDocentes(Set<ClaseDocente> claseDocentes) {
        if (this.claseDocentes != null) {
            this.claseDocentes.forEach(i -> i.setDocente(null));
        }
        if (claseDocentes != null) {
            claseDocentes.forEach(i -> i.setDocente(this));
        }
        this.claseDocentes = claseDocentes;
    }

    public Docente claseDocentes(Set<ClaseDocente> claseDocentes) {
        this.setClaseDocentes(claseDocentes);
        return this;
    }

    public Docente addClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.add(claseDocente);
        claseDocente.setDocente(this);
        return this;
    }

    public Docente removeClaseDocente(ClaseDocente claseDocente) {
        this.claseDocentes.remove(claseDocente);
        claseDocente.setDocente(null);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Docente customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public CentroDeFormacion getCentroDeFormacion() {
        return this.centroDeFormacion;
    }

    public void setCentroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.centroDeFormacion = centroDeFormacion;
    }

    public Docente centroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.setCentroDeFormacion(centroDeFormacion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Docente)) {
            return false;
        }
        return id != null && id.equals(((Docente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Docente{" +
            "id=" + getId() +
            "}";
    }
}
