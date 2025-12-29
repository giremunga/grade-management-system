package com.gradapp;

public class Student {
    private String id;
    private String name;
    private double gpa;
    private java.util.List<Double> grades;

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
        this.grades = new java.util.ArrayList<>();
        this.gpa = 0.0;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public java.util.List<Double> getGrades() {
        return grades;
    }

    public void addGrade(double grade) {
        if (grade >= 0 && grade <= 100) {
            grades.add(grade);
            calculateGPA();
        }
    }

    public void removeGrade(int index) {
        if (index >= 0 && index < grades.size()) {
            grades.remove(index);
            calculateGPA();
        }
    }

    private void calculateGPA() {
        if (grades.isEmpty()) {
            gpa = 0.0;
            return;
        }
        double sum = 0;
        for (double grade : grades) {
            sum += grade;
        }
        gpa = Math.round((sum / grades.size()) * 100.0) / 100.0;
    }
}
