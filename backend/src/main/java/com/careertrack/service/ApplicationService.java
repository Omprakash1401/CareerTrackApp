
package com.careertrack.service;


import com.careertrack.exception.ResourceNotFoundException;
import com.careertrack.exception.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

import com.careertrack.entity.Application;
import com.careertrack.repository.ApplicationRepository;

@Service
public class ApplicationService {

	private final ApplicationRepository applicationRepository;
	private final UserRepository userRepository;

	public ApplicationService(
	        ApplicationRepository applicationRepository,
	        UserRepository userRepository) {
	    this.applicationRepository = applicationRepository;
	    this.userRepository = userRepository;
	}

    // Get all applications

public List<Application> getAllApplications() {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !(authentication.getPrincipal() instanceof Long userId)) {
        throw new org.springframework.security.access.AccessDeniedException(
                "Authenticated user not found.");
    }

    return applicationRepository.findByUserId(userId);
}


    // Get one application by ID

public Application getApplicationById(Long id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !(authentication.getPrincipal() instanceof Long userId)) {
        throw new org.springframework.security.access.AccessDeniedException(
                "Authenticated user not found.");
    }

    return applicationRepository.findByIdAndUserId(id, userId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Application not found with ID: " + id));
}


    // Add a new application

public Application createApplication(Application application) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !(authentication.getPrincipal() instanceof Long userId)) {
        throw new org.springframework.security.access.AccessDeniedException(
                "Authenticated user not found.");
    }

    User user = userRepository.findById(userId)
            .orElseThrow(() ->
                    new com.careertrack.exception.ResourceNotFoundException(
                            "Authenticated user no longer exists."));

    application.setId(null);
    application.setUser(user);

    return applicationRepository.save(application);
}


    // Update an existing application

public Application updateApplication(
        Long id,
        Application updatedApplication) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !(authentication.getPrincipal() instanceof Long userId)) {
        throw new org.springframework.security.access.AccessDeniedException(
                "Authenticated user not found.");
    }

    Application existingApplication =
            applicationRepository.findByIdAndUserId(id, userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Application not found with ID: " + id));

    existingApplication.setCompany(updatedApplication.getCompany());
    existingApplication.setJobTitle(updatedApplication.getJobTitle());
    existingApplication.setLocation(updatedApplication.getLocation());
    existingApplication.setJobType(updatedApplication.getJobType());
    existingApplication.setWorkMode(updatedApplication.getWorkMode());
    existingApplication.setApplicationDate(
            updatedApplication.getApplicationDate());
    existingApplication.setStatus(updatedApplication.getStatus());
    existingApplication.setJobUrl(updatedApplication.getJobUrl());
    existingApplication.setNotes(updatedApplication.getNotes());

    // Keep the original owner; never trust an owner supplied by the client.
    return applicationRepository.save(existingApplication);
}


    // Delete an application

	public void deleteApplication(Long id) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null
            || !(authentication.getPrincipal() instanceof Long userId)) {
        throw new org.springframework.security.access.AccessDeniedException(
                "Authenticated user not found.");
    }

    Application application =
            applicationRepository.findByIdAndUserId(id, userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Application not found with ID: " + id));

    applicationRepository.delete(application);
}

    

public Page<Application> searchApplications(
        String search,
        String status,
        int page,
        int size,
        String sortBy,
        String direction) {
	
	Authentication authentication =
	        SecurityContextHolder.getContext().getAuthentication();

	if (authentication == null
	        || !(authentication.getPrincipal() instanceof Long userId)) {
	    throw new org.springframework.security.access.AccessDeniedException(
	            "Authenticated user not found.");
	}
	
if (page < 0) {
    throw new BadRequestException(
        "Page number cannot be negative."
    );
}

if (size < 1 || size > 100) {
    throw new BadRequestException(
        "Page size must be between 1 and 100."
    );
}

if (status != null && !status.isBlank()
        && !java.util.Set.of(
            "Applied",
            "Assessment",
            "Interview",
            "Offer",
            "Rejected"
        ).contains(status)) {
    throw new BadRequestException(
        "Invalid application status."
    );
}

if (!java.util.Set.of(
        "applicationDate",
        "company",
        "jobTitle",
        "status"
    ).contains(sortBy)) {
    throw new BadRequestException(
        "Invalid sort field."
    );
}

if (!"asc".equalsIgnoreCase(direction)
        && !"desc".equalsIgnoreCase(direction)) {
    throw new BadRequestException(
        "Sort direction must be asc or desc."
    );
}



Sort.Direction sortDirection =
        Sort.Direction.fromString(direction);

Pageable pageable = PageRequest.of(
        page,
        size,
        Sort.by(sortDirection, sortBy)
);

return applicationRepository.searchApplications(
        userId,
        search,
        status,
        pageable
);

}

}
