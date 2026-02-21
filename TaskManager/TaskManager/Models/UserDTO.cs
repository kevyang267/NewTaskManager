using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models
{
    public class UserDTO
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage ="Email address is required")]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8)]
        [MaxLength(512)]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
