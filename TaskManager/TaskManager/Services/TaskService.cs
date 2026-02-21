using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.Services
{
    public class TaskService : ITaskService
    {
        private readonly TaskManagerDbContext _context;

        public TaskService(TaskManagerDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskDTO>> GetAllAsync()
        {
            var entities = await _context.Tasks.ToListAsync();
            return entities.Select(MapToDTO).ToList();
        }

        public async Task<TaskDTO?> GetByIdAsync(int id)
        {
            var entity = await _context.Tasks.FindAsync(id);
            return entity == null ? null : MapToDTO(entity);
        }

        public async Task<TaskDTO> CreateAsync(TaskDTO task)
        {
            var entity = MapToEntity(task);
            _context.Tasks.Add(entity);
            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        public async Task UpdateAsync(TaskDTO task)
        {
            // Fetch the tracked entity
            var existingEntity = await _context.Tasks.FindAsync(task.Id);
            if (existingEntity == null)
            {
                throw new Exception("Task not found");
            }

            // Update the properties
            existingEntity.Title = task.Title;
            existingEntity.Description = task.Description;
            existingEntity.IsCompleted = task.IsCompleted;
            existingEntity.CompletedAt = task.CompletedAt;

            // No need to call Update() — EF Core is already tracking it
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Tasks.FindAsync(id);
            if (entity == null)
                return false;

            _context.Tasks.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping methods
        private TaskDTO MapToDTO(TaskEntity entity) => new()
        {
            Id = entity.Id,
            Title = entity.Title,
            Description = entity.Description,
            IsCompleted = entity.IsCompleted,
            CreatedAt = entity.CreatedAt,
            CompletedAt = entity.CompletedAt
        };

        private TaskEntity MapToEntity(TaskDTO dto) => new()
        {
            Id = dto.Id,
            Title = dto.Title,
            Description = dto.Description,
            IsCompleted = dto.IsCompleted,
            CreatedAt = dto.CreatedAt,
            CompletedAt = dto.CompletedAt
        };
    }
}
