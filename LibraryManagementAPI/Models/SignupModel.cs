namespace LibraryManagementAPI.Models
{
    public class SignupModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
    }
}
