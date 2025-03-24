package com.example.demo.services.impl;

import com.example.demo.models.PersonModel;
import com.example.demo.repositories.PersonRepository;
import com.example.demo.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PersonServiceImpl implements PersonService {
    private final PersonRepository personRepository;

    @Override
    public PersonModel save(PersonModel personModel) {
        return personRepository.save(personModel);
    }

    @Override
    public List<PersonModel> listAll() {
        return personRepository.findAll();
    }

    @Override
    public PersonModel find(Long id) {
        return personRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteId(Long id) {
        personRepository.deleteById(id);
    }


}
