package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A ClaseDocente.
 */
@Entity
@Table(name = "clase_docente")
public class ClaseDocente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties(value = { "claseDocentes", "customer", "centroDeFormacion" }, allowSetters = true)
    private Docente docente;

    @ManyToOne
    @JsonIgnoreProperties(value = { "estudianteHorarios", "claseDocentes" }, allowSetters = true)
    private Horario horario;

    @ManyToOne
    @JsonIgnoreProperties(value = { "claseDocentes", "programaDeFormacions", "claseFichas", "trimestre" }, allowSetters = true)
    private Clase clase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClaseDocente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Docente getDocente() {
        return this.docente;
    }

    public void setDocente(Docente docente) {
        this.docente = docente;
    }

    public ClaseDocente docente(Docente docente) {
        this.setDocente(docente);
        return this;
    }

    public Horario getHorario() {
        return this.horario;
    }

    public void setHorario(Horario horario) {
        this.horario = horario;
    }

    public ClaseDocente horario(Horario horario) {
        this.setHorario(horario);
        return this;
    }

    public Clase getClase() {
        return this.clase;
    }

    public void setClase(Clase clase) {
        this.clase = clase;
    }

    public ClaseDocente clase(Clase clase) {
        this.setClase(clase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClaseDocente)) {
            return false;
        }
        return id != null && id.equals(((ClaseDocente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClaseDocente{" +
            "id=" + getId() +
            "}";
    }
}
