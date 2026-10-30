
package com.careertrack.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

import com.careertrack.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {


	@Query("""
    SELECT a FROM Application a
    WHERE a.user.id = :userId
    AND (
        :search IS NULL
        OR LOWER(a.company) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(a.jobTitle) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(a.location) LIKE LOWER(CONCAT('%', :search, '%'))
    )
    AND (:status IS NULL OR a.status = :status)
    """)
	
	Page<Application> searchApplications(
        @Param("userId") Long userId,
        @Param("search") String search,
        @Param("status") String status,
        Pageable pageable
);

    
    List<Application> findByUserId(Long userId);
    
    Optional<Application> findByIdAndUserId(Long id, Long userId);
    
    
}

