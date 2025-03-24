package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;

@Data
@Entity
@Table(name = "TB_PERSON")
public class PersonModel implements Serializable {
    private static final long serialVersionUID = 1L;
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;
    @Column(name = "fisrt_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column
    private String email;
}
