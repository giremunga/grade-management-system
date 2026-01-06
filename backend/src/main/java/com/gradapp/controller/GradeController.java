package com.gradapp.controller;

import com.gradapp.service.GradeManager;
import com.gradapp.model.Student;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") 
public class GradeController {

    private static final GradeManager gradeManager = new GradeManager();

    // STUDENTS
    
    @PostMapping("/students")
    public GradeManager.StudentDTO addStudent(@RequestBody StudentRequest request) {
        Student student = gradeManager.addStudent(
                request.getName(),
                request.getEmail(),
                request.getSubjectMarks()
        );
        return gradeManager.getStudentDTO(student);
    }

    @GetMapping("/students")
    public List<GradeManager.StudentDTO> getAllStudents() {
        return gradeManager.getAllStudentDTOs();
    }

    @GetMapping("/students/{id}")
    public GradeManager.StudentDTO getStudent(@PathVariable String id) {
        Student student = gradeManager.getStudent(id);
        if (student == null) return null;
        return gradeManager.getStudentDTO(student);
    }

    @DeleteMapping("/students/{id}")
    public boolean removeStudent(@PathVariable String id) {
        return gradeManager.removeStudent(id);
    }

    
    // GRADES
    
    @PostMapping("/students/{id}/grades")
    public GradeManager.StudentDTO addGrade(@PathVariable String id, @RequestBody GradeRequest request) {
        gradeManager.addGradeToStudent(id, request.getGrade());
        Student student = gradeManager.getStudent(id);
        return gradeManager.getStudentDTO(student);
    }

    @DeleteMapping("/students/{id}/grades/{index}")
    public GradeManager.StudentDTO removeGrade(@PathVariable String id, @PathVariable int index) {
        gradeManager.removeGradeFromStudent(id, index);
        Student student = gradeManager.getStudent(id);
        return gradeManager.getStudentDTO(student);
    }

    @PostMapping("/students/{id}/subjects")
    public GradeManager.StudentDTO updateSubjectMarks(@PathVariable String id, @RequestBody SubjectMarksRequest request) {
        gradeManager.updateSubjectMarks(id, request.getSubjectMarks());
        Student student = gradeManager.getStudent(id);
        if (student == null) {
            return null;
        }
        return gradeManager.getStudentDTO(student);
    }

    
    
    // REQUEST CLASSES
    
    public static class StudentRequest {
        private String name;
        private String email;
        private java.util.Map<String, Double> subjectMarks;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public java.util.Map<String, Double> getSubjectMarks() { return subjectMarks; }
        public void setSubjectMarks(java.util.Map<String, Double> subjectMarks) { this.subjectMarks = subjectMarks; }
    }

    public static class GradeRequest {
        private double grade;
        public double getGrade() { return grade; }
        public void setGrade(double grade) { this.grade = grade; }
    }

    public static class SubjectMarksRequest {
        private java.util.Map<String, Double> subjectMarks;
        public java.util.Map<String, Double> getSubjectMarks() { return subjectMarks; }
        public void setSubjectMarks(java.util.Map<String, Double> subjectMarks) { this.subjectMarks = subjectMarks; }
    }
}
