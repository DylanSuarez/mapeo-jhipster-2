package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ClaseFicha.
 */
@Entity
@Table(name = "clase_ficha")
public class ClaseFicha implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudiantes", "claseFichas", "programadeformacion" }, allowSetters = true)
    private Ficha ficha;

    @ManyToOne
    @JsonIgnoreProperties(value = { "claseDocentes", "programaDeFormacions", "claseFichas", "trimestre" }, allowSetters = true)
    private Clase clase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClaseFicha id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ficha getFicha() {
        return this.ficha;
    }

    public void setFicha(Ficha ficha) {
        this.ficha = ficha;
    }

    public ClaseFicha ficha(Ficha ficha) {
        this.setFicha(ficha);
        return this;
    }

    public Clase getClase() {
        return this.clase;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }

    public ClaseFicha clase(Clase clase) {
        this.setClase(clase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClaseFicha)) {
            return false;
        }
        return id != null && id.equals(((ClaseFicha) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClaseFicha{" +
            "id=" + getId() +
            "}";
    }
}
