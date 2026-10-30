
package com.careertrack.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.careertrack.entity.Application;
import com.careertrack.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // GET: Fetch all applications
    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(
                applicationService.getAllApplications()
        );
    }

    // GET: Fetch one application by ID
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    // POST: Create a new application
    @PostMapping
    public ResponseEntity<Application> createApplication(
         @Valid @RequestBody Application application) {
        Application savedApplication =
                applicationService.createApplication(application);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedApplication);
    }

    // PUT: Update an existing application
    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
       @Valid @RequestBody Application application) {
        return ResponseEntity.ok(
                applicationService.updateApplication(id, application)
        );
    }

    // DELETE: Delete an application
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }
    

    @GetMapping("/search")
	public ResponseEntity<Page<Application>> searchApplications(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "applicationDate") String sortBy,
        @RequestParam(defaultValue = "desc") String direction) {

    	return ResponseEntity.ok(
            applicationService.searchApplications(
                    search, status, page, size, sortBy, direction)
    );
}

}
