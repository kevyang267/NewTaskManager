using Microsoft.EntityFrameworkCore;
using TaskManager.Services;
using TaskManager.Models;
using TaskManagerTests.TestUtilities;
using Xunit;
using TaskManager.Data;    


namespace TaskManagerTests.Services
{
    public class TaskServiceTests
    {
        private static TaskService CreateService(out TaskManagerDbContext context)
        {
            context = DbContextFactory.CreateInMemory();
            return new TaskService(context);
        }

        [Fact]
        public async Task CreateAsync_ShouldPersistTask()
        {
            var service = CreateService(out var context);

            var dto = new TaskDTO
            {
                Title = "Test Task",
                Description = "Test Description",
                IsCompleted = false
            };

            var result = await service.CreateAsync(dto);

            Assert.True(result.Id > 0);
            var entity = await context.Tasks.FindAsync(result.Id);
            Assert.NotNull(entity);
            Assert.Equal("Test Task", entity!.Title);
        }

        [Fact]
        public async Task GetByIdAsync_WhenTaskExists_ReturnsTask()
        {
            var service = CreateService(out var context);

            var entity = new TaskEntity { Title = "Existing Task" };
            context.Tasks.Add(entity);
            await context.SaveChangesAsync();

            var result = await service.GetByIdAsync(entity.Id);

            Assert.NotNull(result);
            Assert.Equal(entity.Id, result!.Id);
            Assert.Equal("Existing Task", result.Title);
        }

        [Fact]
        public async Task GetByIdAsync_WhenTaskDoesNotExist_ReturnsNull()
        {
            var service = CreateService(out _);
            var result = await service.GetByIdAsync(999);
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingTask()
        {
            var service = CreateService(out var context);

            var entity = new TaskEntity { Title = "Original" };
            context.Tasks.Add(entity);
            await context.SaveChangesAsync();

            var updatedDto = new TaskDTO
            {
                Id = entity.Id,
                Title = "Updated",
                Description = "Updated",
                IsCompleted = true
            };

            await service.UpdateAsync(updatedDto);

            var updated = await context.Tasks.FindAsync(entity.Id);
            Assert.NotNull(updated);
            Assert.Equal("Updated", updated!.Title);
            Assert.True(updated.IsCompleted);
        }

        [Fact]
        public async Task DeleteAsync_WhenTaskExists_ReturnsTrue()
        {
            var service = CreateService(out var context);

            var entity = new TaskEntity { Title = "To Delete" };
            context.Tasks.Add(entity);
            await context.SaveChangesAsync();

            var result = await service.DeleteAsync(entity.Id);

            Assert.True(result);
            Assert.Null(await context.Tasks.FindAsync(entity.Id));
        }

        [Fact]
        public async Task DeleteAsync_WhenTaskDoesNotExist_ReturnsFalse()
        {
            var service = CreateService(out _);
            var result = await service.DeleteAsync(123);
            Assert.False(result);
        }
    }
}
