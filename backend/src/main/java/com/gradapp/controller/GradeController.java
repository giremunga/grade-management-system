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
        Student student = gradeManager.addStudent(request.getName());
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

    
    
    // REQUEST CLASSES
    
    public static class StudentRequest {
        private String name;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class GradeRequest {
        private double grade;
        public double getGrade() { return grade; }
        public void setGrade(double grade) { this.grade = grade; }
    }
}
