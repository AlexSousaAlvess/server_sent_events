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

    // Lista de inscritos SSE
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @PostMapping
    public ResponseEntity<PersonModel> addPerson(@RequestBody PersonModel personModel) {
        PersonModel saved = personService.save(personModel);
        notifySubscribers(saved);
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

    // 🔔 Endpoint SSE para o front se inscrever
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        // Remove o emitter quando a conexão for fechada
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        return emitter;
    }

    // 🚀 Notifica todos os inscritos sobre a nova pessoa
    private void notifySubscribers(PersonModel person) {
        notificationService.save("new-person", "Nova pessoa cadastrada: " + person.getFirstName());

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("new-person")
                        .data(person));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
