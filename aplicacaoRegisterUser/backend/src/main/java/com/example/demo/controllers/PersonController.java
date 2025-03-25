package com.example.demo.controllers;

import com.example.demo.models.PersonModel;
import com.example.demo.services.NotificationService;
import com.example.demo.services.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
@RequestMapping("/person")
public class PersonController {
    private final PersonService personService;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<PersonModel> addPerson(@RequestBody PersonModel personModel) {
        PersonModel saved = personService.save(personModel);
        notificationService.sendNotification(
                "new-person",
                "Nova Pessoa cadastrada: " + saved.getFirstName()
        );
        return ResponseEntity.status(HttpStatus.OK).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<PersonModel>> findAll() {
        return ResponseEntity.status(HttpStatus.OK).body(personService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonModel> findById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(personService.find(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body("person deleted");
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonModel> update(@PathVariable Long id, @RequestBody PersonModel personModel) {
        PersonModel person = personService.find(id);
        BeanUtils.copyProperties(personModel, person, "id");
        return ResponseEntity.status(HttpStatus.OK).body(personService.save(person));

    }
}
