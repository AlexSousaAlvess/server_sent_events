package com.example.demo.services;

import com.example.demo.models.PersonModel;

import java.util.List;

public interface PersonService {
    PersonModel save(PersonModel personModel);


    List<PersonModel> listAll();

    PersonModel find(Long id);

    void deleteId(Long id);
}
