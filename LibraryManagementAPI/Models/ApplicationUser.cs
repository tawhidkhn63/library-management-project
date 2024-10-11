using Microsoft.AspNetCore.Identity;

namespace LibraryManagementAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Additional fields can be added here if needed
        public required string Role { get; set; }
    }
}
