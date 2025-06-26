package com.example.demo.service;

import com.example.demo.model.Book;
import com.example.demo.model.BorrowRecord;
import com.example.demo.model.User;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String borrowBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            return "Book is currently not available.";
        }

        User user = getCurrentUser();

        // Tạo bản ghi mượn mới
        BorrowRecord record = new BorrowRecord();
        record.setBook(book);
        record.setUser(user);
        record.setBorrowDate(LocalDate.now());
        record.setDueDate(LocalDate.now().plusDays(7));
        record.setReturned(false);

        borrowRecordRepository.save(record);

        // Cập nhật trạng thái sách
        book.setAvailable(false);
        bookRepository.save(book);

        return "Book borrowed successfully.";
    }

    public String returnBook(Long bookId) {
        User user = getCurrentUser();
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // ✅ Tìm bản ghi chưa trả
        BorrowRecord record = borrowRecordRepository.findByUserAndBookAndReturnedFalse(user, book)
                .orElseThrow(() -> new RuntimeException("This book was not borrowed or already returned."));

        // Cập nhật trạng thái
        record.setReturned(true);
        borrowRecordRepository.save(record);

        book.setAvailable(true);
        bookRepository.save(book);

        return "Book returned successfully.";
    }

    public List<BorrowRecord> getMyBorrowedBooks() {
        return borrowRecordRepository.findByUserAndReturnedFalse(getCurrentUser());
    }

    // ✅ Thêm cho admin xem toàn bộ lịch sử
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }
}
