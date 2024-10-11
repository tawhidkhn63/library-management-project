using LibraryManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Security.Claims;

namespace LibraryManagementAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BooksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // get all books whether librarian or customer
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _context.Books.ToListAsync();
            return Ok(books);
        }

        // Get a single book by ID
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // Add a new book for librarians
        [Authorize(Roles = "Librarian")]
        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book added successfully!" });
        }

        // Update an existing book by librarian
        [Authorize(Roles = "Librarian")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            // Update fields
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Description = updatedBook.Description;
            book.CoverImage = updatedBook.CoverImage;
            book.Publisher = updatedBook.Publisher;
            book.PublicationDate = updatedBook.PublicationDate;
            book.Category = updatedBook.Category;
            book.ISBN = updatedBook.ISBN;
            book.PageCount = updatedBook.PageCount;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Book updated successfully!" });
        }

        // delete book
        [Authorize(Roles = "Librarian")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book deleted successfully!" });
        }

        // Checkout book for 5 days max
        [Authorize(Roles = "Customer")]
        [HttpPost("{id}/checkout")]
        public async Task<IActionResult> CheckoutBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            if (book.IsCheckedOut)
                return BadRequest(new { message = "Book is already checked out" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get current user ID
            book.IsCheckedOut = true;
            book.DueDate = DateTime.Now.AddDays(5); // 5-day checkout period
            book.CheckedOutByUserId = userId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Book checked out successfully", dueDate = book.DueDate });
        }

        // librarian return book
        [Authorize(Roles = "Librarian")]
        [HttpPost("{id}/return")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            if (!book.IsCheckedOut)
                return BadRequest(new { message = "Book is not checked out" });

            book.IsCheckedOut = false;
            book.DueDate = null;
            book.CheckedOutByUserId = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Book returned successfully" });
        }

    }

}