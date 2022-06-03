package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Admin.
 */
@Entity
@Table(name = "admin")
public class Admin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 45)
    @Column(name = "cargo", length = 45, nullable = false)
    private String cargo;

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

    public Admin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCargo() {
        return this.cargo;
    }

    public Admin cargo(String cargo) {
        this.setCargo(cargo);
        return this;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Admin customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public CentroDeFormacion getCentroDeFormacion() {
        return this.centroDeFormacion;
    }

    public void setCentroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.centroDeFormacion = centroDeFormacion;
    }

    public Admin centroDeFormacion(CentroDeFormacion centroDeFormacion) {
        this.setCentroDeFormacion(centroDeFormacion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Admin)) {
            return false;
        }
        return id != null && id.equals(((Admin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Admin{" +
            "id=" + getId() +
            ", cargo='" + getCargo() + "'" +
            "}";
    }
}
