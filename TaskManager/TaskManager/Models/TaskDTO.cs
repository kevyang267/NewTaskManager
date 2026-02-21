using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models
{
    public class TaskDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters.")]
        [Display(Name = "Task Title")]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        [Display(Name = "Task Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Is Completed")]
        public bool IsCompleted { get; set; }

        [DataType(DataType.DateTime)]
        [Display(Name = "Created At")]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.DateTime)]
        [Display(Name = "Completed At")]
        public DateTime? CompletedAt { get; set; }
    }
}