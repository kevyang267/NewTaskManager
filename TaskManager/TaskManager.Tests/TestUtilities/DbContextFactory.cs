using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

namespace TaskManagerTests.TestUtilities
{
    public static class DbContextFactory
    {
        public static TaskManagerDbContext CreateInMemory()
        {
            var options = new DbContextOptionsBuilder<TaskManagerDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new TaskManagerDbContext(options);
        }
    }
}