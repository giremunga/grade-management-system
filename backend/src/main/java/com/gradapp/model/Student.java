package com.gradapp.model;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Student {
    private final String id;
    private String name;
    private String email;
    private double gpa;
    private final List<Double> grades;
    private final Map<String, Double> subjectMarks;

    public Student(String id, String name) {
        this(id, name, null);
    }

    public Student(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.grades = new ArrayList<>();
        this.subjectMarks = new LinkedHashMap<>();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public List<Double> getGrades() {
        return grades;
    }

    public Map<String, Double> getSubjectMarks() {
        return new LinkedHashMap<>(subjectMarks);
    }

    public void setSubjectMarks(Map<String, Double> marks) {
        subjectMarks.clear();
        if (marks == null || marks.isEmpty()) {
            recalculateGpa();
            return;
        }
        addOrUpdateSubjectMarks(marks);
    }

    public void addOrUpdateSubjectMarks(Map<String, Double> marks) {
        if (marks == null || marks.isEmpty()) {
            return;
        }
        boolean changed = false;
        for (Map.Entry<String, Double> entry : marks.entrySet()) {
            String key = normalizeSubject(entry.getKey());
            if (key == null) {
                continue;
            }
            double sanitized = sanitizeScore(entry.getValue());
            Double existing = subjectMarks.get(key);
            if (existing == null || existing.doubleValue() != sanitized) {
                subjectMarks.put(key, sanitized);
                changed = true;
            }
        }
        if (changed) {
            recalculateGpa();
        }
    }

    public void addGrade(double grade) {
        if (grade >= 0 && grade <= 100) {
            grades.add(grade);
            recalculateGpa();
        }
    }

    public void removeGrade(int index) {
        if (index >= 0 && index < grades.size()) {
            grades.remove(index);
            recalculateGpa();
        }
    }

    private void recalculateGpa() {
        double sum = 0;
        int count = 0;

        if (!subjectMarks.isEmpty()) {
            for (double mark : subjectMarks.values()) {
                sum += mark;
            }
            count = subjectMarks.size();
        } else if (!grades.isEmpty()) {
            for (double grade : grades) {
                sum += grade;
            }
            count = grades.size();
        }

        gpa = count == 0 ? 0.0 : Math.round((sum / count) * 100.0) / 100.0;
    }

    private String normalizeSubject(String subject) {
        if (subject == null) {
            return null;
        }
        String trimmed = subject.trim();
        return trimmed.isEmpty() ? null : trimmed.toUpperCase();
    }

    private double sanitizeScore(Double score) {
        double value = (score == null || Double.isNaN(score)) ? 0.0 : score;
        if (value < 0.0) {
            return 0.0;
        }
        if (value > 100.0) {
            return 100.0;
        }
        return Math.round(value * 100.0) / 100.0;
    }
}
