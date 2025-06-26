package com.example.demo.controller;

import com.example.demo.model.BorrowRecord;
import com.example.demo.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    public ResponseEntity<String> borrowBook(@PathVariable Long bookId) {
        String result = borrowService.borrowBook(bookId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/return/{bookId}")
    public ResponseEntity<String> returnBook(@PathVariable Long bookId) {
        String result = borrowService.returnBook(bookId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my-borrows")
    public ResponseEntity<List<BorrowRecord>> getMyBorrowedBooks() {
        return ResponseEntity.ok(borrowService.getMyBorrowedBooks());
    }

    // ✅ Thêm endpoint này để admin xem toàn bộ lịch sử mượn sách
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowRecord>> getAllBorrowRecords() {
        return ResponseEntity.ok(borrowService.getAllBorrowRecords());
    }
}
