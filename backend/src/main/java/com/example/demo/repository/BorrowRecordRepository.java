package com.example.demo.repository;

import com.example.demo.model.BorrowRecord;
import com.example.demo.model.Book;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    // Lấy tất cả sách người dùng đang mượn mà chưa trả
    List<BorrowRecord> findByUserAndReturnedFalse(User user);

    // (CŨ) Tìm bản ghi gần nhất theo ngày mượn (có thể sai nếu bản ghi đã được trả)
    Optional<BorrowRecord> findTopByUserAndBookOrderByBorrowDateDesc(User user, Book book);

    // ✅ (MỚI) Tìm bản ghi chưa trả ứng với user và book
    Optional<BorrowRecord> findByUserAndBookAndReturnedFalse(User user, Book book);
}
