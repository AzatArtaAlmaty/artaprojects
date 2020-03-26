package com.ekpd.qr.entity;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(
        name = "eds_info"
)
@XmlRootElement
@NamedQueries({@NamedQuery(
        name = "EdsInfo.findAll",
        query = "SELECT e FROM EdsInfo e"
), @NamedQuery(
        name = "EdsInfo.findByEdsId",
        query = "SELECT e FROM EdsInfo e WHERE e.edsId = :edsId"
), @NamedQuery(
        name = "EdsInfo.findByUserId",
        query = "SELECT e FROM EdsInfo e WHERE e.userid = :userid"
), @NamedQuery(
        name = "EdsInfo.findByCaId",
        query = "SELECT e FROM EdsInfo e WHERE e.caId = :caId"
), @NamedQuery(
        name = "EdsInfo.findByTimeEnd",
        query = "SELECT e FROM EdsInfo e WHERE e.timeEnd = :timeEnd"
), @NamedQuery(
        name = "EdsInfo.findByUpdate",
        query = "SELECT e FROM EdsInfo e WHERE e.update = :update"
)})
@Data
public class EdsInfo implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    @Basic(
            optional = false
    )
    @Column(
            name = "eds_id"
    )
    private Integer edsId;
    @Size(
            max = 42
    )
    @Column(
            name = "user_id"
    )
    private String userid;
    @Lob
    @Size(
            max = 65535
    )
    @Column(
            name = "id_KeyEds"
    )
    private String idKeyEds;
    @Lob
    @Column(
            name = "publicKey"
    )
    private byte[] publicKey;
    @Column(
            name = "CA_ID"
    )
    private Integer caId;
    @Size(
            max = 42
    )
    @Column(
            name = "timeEnd"
    )
    private String timeEnd;
    @Column(
            name = "update"
    )
    @Temporal(TemporalType.TIMESTAMP)
    private Date update;
    @Lob
    @Size(
            max = 65535
    )
    @Column(
            name = "infoEDS"
    )
    private String infoEDS;

    public EdsInfo() {
    }
}