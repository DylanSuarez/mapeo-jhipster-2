package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "num_documento", length = 50, nullable = false, unique = true)
    private String numDocumento;

    @NotNull
    @Size(max = 50)
    @Column(name = "primer_nombre", length = 50, nullable = false)
    private String primerNombre;

    @Size(max = 50)
    @Column(name = "segundo_nombre", length = 50)
    private String segundoNombre;

    @NotNull
    @Size(max = 50)
    @Column(name = "primer_apellido", length = 50, nullable = false)
    private String primerApellido;

    @Size(max = 50)
    @Column(name = "segundo_apellido", length = 50)
    private String segundoApellido;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "estudianteHorarios", "customer", "programadeformacion", "trimestre", "ficha" }, allowSetters = true)
    private Set<Estudiante> estudiantes = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "customer", "centroDeFormacion" }, allowSetters = true)
    private Set<Admin> admins = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @JsonIgnoreProperties(value = { "claseDocentes", "customer", "centroDeFormacion" }, allowSetters = true)
    private Set<Docente> docentes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "customers" }, allowSetters = true)
    private TipoDocumento tipoDocumento;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Customer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumDocumento() {
        return this.numDocumento;
    }

    public Customer numDocumento(String numDocumento) {
        this.setNumDocumento(numDocumento);
        return this;
    }

    public void setNumDocumento(String numDocumento) {
        this.numDocumento = numDocumento;
    }

    public String getPrimerNombre() {
        return this.primerNombre;
    }

    public Customer primerNombre(String primerNombre) {
        this.setPrimerNombre(primerNombre);
        return this;
    }

    public void setPrimerNombre(String primerNombre) {
        this.primerNombre = primerNombre;
    }

    public String getSegundoNombre() {
        return this.segundoNombre;
    }

    public Customer segundoNombre(String segundoNombre) {
        this.setSegundoNombre(segundoNombre);
        return this;
    }

    public void setSegundoNombre(String segundoNombre) {
        this.segundoNombre = segundoNombre;
    }

    public String getPrimerApellido() {
        return this.primerApellido;
    }

    public Customer primerApellido(String primerApellido) {
        this.setPrimerApellido(primerApellido);
        return this;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return this.segundoApellido;
    }

    public Customer segundoApellido(String segundoApellido) {
        this.setSegundoApellido(segundoApellido);
        return this;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Customer user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Estudiante> getEstudiantes() {
        return this.estudiantes;
    }

    public void setEstudiantes(Set<Estudiante> estudiantes) {
        if (this.estudiantes != null) {
            this.estudiantes.forEach(i -> i.setCustomer(null));
        }
        if (estudiantes != null) {
            estudiantes.forEach(i -> i.setCustomer(this));
        }
        this.estudiantes = estudiantes;
    }

    public Customer estudiantes(Set<Estudiante> estudiantes) {
        this.setEstudiantes(estudiantes);
        return this;
    }

    public Customer addEstudiante(Estudiante estudiante) {
        this.estudiantes.add(estudiante);
        estudiante.setCustomer(this);
        return this;
    }

    public Customer removeEstudiante(Estudiante estudiante) {
        this.estudiantes.remove(estudiante);
        estudiante.setCustomer(null);
        return this;
    }

    public Set<Admin> getAdmins() {
        return this.admins;
    }

    public void setAdmins(Set<Admin> admins) {
        if (this.admins != null) {
            this.admins.forEach(i -> i.setCustomer(null));
        }
        if (admins != null) {
            admins.forEach(i -> i.setCustomer(this));
        }
        this.admins = admins;
    }

    public Customer admins(Set<Admin> admins) {
        this.setAdmins(admins);
        return this;
    }

    public Customer addAdmin(Admin admin) {
        this.admins.add(admin);
        admin.setCustomer(this);
        return this;
    }

    public Customer removeAdmin(Admin admin) {
        this.admins.remove(admin);
        admin.setCustomer(null);
        return this;
    }

    public Set<Docente> getDocentes() {
        return this.docentes;
    }

    public void setDocentes(Set<Docente> docentes) {
        if (this.docentes != null) {
            this.docentes.forEach(i -> i.setCustomer(null));
        }
        if (docentes != null) {
            docentes.forEach(i -> i.setCustomer(this));
        }
        this.docentes = docentes;
    }

    public Customer docentes(Set<Docente> docentes) {
        this.setDocentes(docentes);
        return this;
    }

    public Customer addDocente(Docente docente) {
        this.docentes.add(docente);
        docente.setCustomer(this);
        return this;
    }

    public Customer removeDocente(Docente docente) {
        this.docentes.remove(docente);
        docente.setCustomer(null);
        return this;
    }

    public TipoDocumento getTipoDocumento() {
        return this.tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public Customer tipoDocumento(TipoDocumento tipoDocumento) {
        this.setTipoDocumento(tipoDocumento);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", numDocumento='" + getNumDocumento() + "'" +
            ", primerNombre='" + getPrimerNombre() + "'" +
            ", segundoNombre='" + getSegundoNombre() + "'" +
            ", primerApellido='" + getPrimerApellido() + "'" +
            ", segundoApellido='" + getSegundoApellido() + "'" +
            "}";
    }
}
