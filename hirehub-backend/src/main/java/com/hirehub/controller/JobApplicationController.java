package com.hirehub.controller;

import com.hirehub.entity.JobApplication;
import com.hirehub.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository applicationRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(
            @RequestParam("jobId") Long jobId,
            @RequestParam("jobTitle") String jobTitle,
            @RequestParam("companyName") String companyName,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("experience") String experience,
            @RequestParam(value = "resume", required = false) MultipartFile resume) {
        try {
            JobApplication app = new JobApplication();
            app.setJobId(jobId);
            app.setJobTitle(jobTitle);
            app.setCompanyName(companyName);
            app.setFullName(fullName);
            app.setEmail(email);
            app.setPhone(phone);
            app.setExperience(experience);
            app.setStatus("Pending");
            app.setAppliedAt(LocalDateTime.now());

            if (resume != null && !resume.isEmpty()) {
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) uploadDir.mkdir();
                String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
                Files.write(Paths.get(UPLOAD_DIR + fileName), resume.getBytes());
                app.setResumePath(fileName);
            }

            JobApplication saved = applicationRepository.save(app);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error saving application");
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(newStatus);
            JobApplication updated = applicationRepository.save(app);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }
}