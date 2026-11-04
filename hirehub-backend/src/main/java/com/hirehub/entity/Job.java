package com.hirehub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String location;
    
    private String type;
    
    private String salary;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String postedAt;

    @PrePersist
    protected void onCreate() {
        if (this.postedAt == null || this.postedAt.isEmpty()) {
            this.postedAt = LocalDate.now().toString(); // e.g. "2026-11-04"
        }
    }
}