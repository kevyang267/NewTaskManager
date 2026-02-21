using TaskManager.Models;
using TaskManager.Data;

namespace TaskManager.Services
{
    public interface ITaskService
    {
        Task<List<TaskDTO>> GetAllAsync();
        Task<TaskDTO?> GetByIdAsync(int id);
        Task<TaskDTO> CreateAsync(TaskDTO task);
        Task UpdateAsync(TaskDTO task);
        Task<bool> DeleteAsync(int id);
    }
}