using Bogus;
using LibraryManagementAPI.Models;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;

    public DatabaseSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public void Seed()
    {
        // Check if data already exists
        if (_context.Books.Any()) return;

        // Create a Faker instance for books
        var bookFaker = new Faker<Book>()
            .RuleFor(b => b.Title, f => f.Lorem.Sentence(3))
            .RuleFor(b => b.Author, f => f.Person.FullName)
            .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
            .RuleFor(b => b.CoverImage, f => f.Image.PicsumUrl())
            .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
            .RuleFor(b => b.PublicationDate, f => f.Date.Past(10))
            .RuleFor(b => b.Category, f => f.Commerce.Categories(1).First())
            .RuleFor(b => b.ISBN, f => f.Commerce.Ean13())
            .RuleFor(b => b.PageCount, f => f.Random.Int(100, 1000));

        // Generate a list of 50 books
        var books = bookFaker.Generate(50);

        // Add books to the context and save changes
        _context.Books.AddRange(books);
        _context.SaveChanges();
    }
}
