package com.gradapp.service;

import com.gradapp.model.Student;
import java.util.*;
import java.util.stream.Collectors;

public class GradeManager {
    private Map<String, Student> students;
    private int idCounter;

    public GradeManager() {
        this.students = new HashMap<>();
        this.idCounter = 1;
    }

    
    // Student Management
  
    
    public Student addStudent(String name) {
        String id = "STU" + String.format("%04d", idCounter++);
        Student student = new Student(id, name);
        students.put(id, student);
        return student;
    }

    public boolean removeStudent(String id) {
        return students.remove(id) != null;
    }

    public Student getStudent(String id) {
        return students.get(id);
    }

    public Collection<Student> getAllStudents() {
        return students.values();
    }

   
    // Grade Management
   
    
    public void addGradeToStudent(String studentId, double grade) {
        Student student = students.get(studentId);
        if (student != null) {
            student.addGrade(grade);
        }
    }

    public void removeGradeFromStudent(String studentId, int gradeIndex) {
        Student student = students.get(studentId);
        if (student != null) {
            student.removeGrade(gradeIndex);
        }
    }

   
    // GPA Sorting
    
    
    public List<Student> getStudentsByGPA(boolean descending) {
        List<Student> sorted = new ArrayList<>(students.values());
        if (descending) {
            sorted.sort((a, b) -> Double.compare(b.getGpa(), a.getGpa()));
        } else {
            sorted.sort((a, b) -> Double.compare(a.getGpa(), b.getGpa()));
        }
        return sorted;
    }

    
    // Helper: Letter Grade
    
    
    public String getLetterGrade(Student student) {
        double gpa = student.getGpa();
        if (gpa >= 90) return "A";
        if (gpa >= 80) return "B";
        if (gpa >= 70) return "C";
        if (gpa >= 60) return "D";
        return "F";
    }

    
    // DTO: Student with Letter Grade
   
    
    public StudentDTO getStudentDTO(Student student) {
        return new StudentDTO(student, getLetterGrade(student));
    }

    public List<StudentDTO> getAllStudentDTOs() {
        return students.values().stream()
                .map(this::getStudentDTO)
                .collect(Collectors.toList());
    }

   
    // Inner DTO class
   
    public static class StudentDTO {
        private String id;
        private String name;
        private double gpa;
        private List<Double> grades;
        private String letterGrade;

        public StudentDTO(Student student, String letterGrade) {
            this.id = student.getId();
            this.name = student.getName();
            this.gpa = student.getGpa();
            this.grades = new ArrayList<>(student.getGrades());
            this.letterGrade = letterGrade;
        }

        // Getters
        public String getId() { return id; }
        public String getName() { return name; }
        public double getGpa() { return gpa; }
        public List<Double> getGrades() { return grades; }
        public String getLetterGrade() { return letterGrade; }
    }
}
