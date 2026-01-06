package com.gradapp.service;

import com.gradapp.model.Student;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class GradeManager {
    private final Map<String, Student> students;
    private int idCounter;

    public GradeManager() {
        this.students = new HashMap<>();
        this.idCounter = 1;
    }

    
    // Student Management
  
    
    public Student addStudent(String name, String email, Map<String, Double> subjectMarks) {
        String id = "STU" + String.format("%04d", idCounter++);
        Student student = new Student(id, name, email);
        student.addOrUpdateSubjectMarks(subjectMarks);
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

    public void updateSubjectMarks(String studentId, Map<String, Double> subjectMarks) {
        Student student = students.get(studentId);
        if (student != null) {
            student.addOrUpdateSubjectMarks(subjectMarks);
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
        private final String id;
        private final String name;
        private final String email;
        private final double gpa;
        private final List<Double> grades;
        private final Map<String, Double> subjectMarks;
        private final String letterGrade;

        public StudentDTO(Student student, String letterGrade) {
            this.id = student.getId();
            this.name = student.getName();
            this.email = student.getEmail();
            this.gpa = student.getGpa();
            this.grades = new ArrayList<>(student.getGrades());
            this.subjectMarks = new java.util.LinkedHashMap<>(student.getSubjectMarks());
            this.letterGrade = letterGrade;
        }

        // Getters
        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public double getGpa() { return gpa; }
        public List<Double> getGrades() { return grades; }
        public Map<String, Double> getSubjectMarks() { return subjectMarks; }
        public String getLetterGrade() { return letterGrade; }
    }
}
