namespace LibraryManagementAPI.Models
{
    public class Book
    {
        public int Id { get; set; }
        
        // All non-nullable string properties are marked as 'required' which are strings
        public required string Title { get; set; }
        public required string Author { get; set; }
        public required string Description { get; set; }
        public required string CoverImage { get; set; }
        public required string Publisher { get; set; }
        
        // DateTime is not nullable, so ensure it is required if it should always have a value
        public required DateTime PublicationDate { get; set; }

        public required string Category { get; set; }
        public required string ISBN { get; set; }
        
        // PageCount is an integer, so no need to mark it as 'required'
        public int PageCount { get; set; }

        public bool IsCheckedOut { get; set; } = false; // Whether the book is checked out
        public DateTime? DueDate { get; set; } // Due date for the return of the book
        public string? CheckedOutByUserId { get; set; } // User who checked out the book
    }
}
