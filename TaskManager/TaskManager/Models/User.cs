namespace TaskManager.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }

    public record RegisterRequest(string Email, string Password);
    public record LoginRequest(string Email, string Password);
}