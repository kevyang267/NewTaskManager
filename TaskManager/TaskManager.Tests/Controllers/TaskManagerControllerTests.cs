using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManager.Controllers;
using TaskManager.Models;
using TaskManager.Services;
using Xunit;

namespace TaskManagerTests.Controllers
{
    public class TaskManagerControllerTests
    {
        [Fact]
        public async Task GetById_WhenTaskExists_ReturnsOk()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync(new TaskDTO { Id = 1, Title = "Test" });

            var controller = new TaskManagerController(mockService.Object);

            var result = await controller.GetById(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var dto = Assert.IsType<TaskDTO>(okResult.Value);
            Assert.Equal(1, dto.Id);
        }

        [Fact]
        public async Task GetById_WhenTaskMissing_ReturnsNotFound()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((TaskDTO?)null);

            var controller = new TaskManagerController(mockService.Object);

            var result = await controller.GetById(42);

            Assert.IsType<NotFoundResult>(result.Result);
        }

    [Fact]
        public async Task Create_WithValidTask_ReturnsCreatedAtAction()
        {
            var mockService = new Mock<ITaskService>();
            var inputDto = new TaskDTO { Title = "New Task", Description = "Desc" };
            var createdDto = new TaskDTO { Id = 1, Title = "New Task", Description = "Desc" };

            mockService.Setup(s => s.CreateAsync(It.IsAny<TaskDTO>()))
                .ReturnsAsync(createdDto);

            var controller = new TaskManagerController(mockService.Object);
            var result = await controller.Create(inputDto);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(nameof(controller.GetById), createdResult.ActionName);
            Assert.Equal(1, createdResult.RouteValues?["id"]);
            var dto = Assert.IsType<TaskDTO>(createdResult.Value);
            Assert.Equal(1, dto.Id);
        }

        [Fact]
        public async Task Update_WhenTaskExists_ReturnsNoContent()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync(new TaskDTO { Id = 1, Title = "Exists" });
            mockService.Setup(s => s.UpdateAsync(It.IsAny<TaskDTO>()))
                .Returns(Task.CompletedTask);

            var controller = new TaskManagerController(mockService.Object);
            var updateDto = new TaskDTO { Id = 1, Title = "Updated" };

            var result = await controller.Update(1, updateDto);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Update_WhenTaskNotFound_ReturnsNotFound()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.GetByIdAsync(1))
                .ReturnsAsync((TaskDTO?)null);

            var controller = new TaskManagerController(mockService.Object);
            var updateDto = new TaskDTO { Id = 1, Title = "Updated" };

            var result = await controller.Update(1, updateDto);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Update_WhenIdMismatch_ReturnsBadRequest()
        {
            var mockService = new Mock<ITaskService>();

            var controller = new TaskManagerController(mockService.Object);

            var updateDto = new TaskDTO { Id = 1, Title = "Updated" };

            var result = await controller.Update(2, updateDto);

            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task Delete_WhenTaskExists_ReturnsNoContent()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.DeleteAsync(1))
                .ReturnsAsync(true);

            var controller = new TaskManagerController(mockService.Object);

            var result = await controller.Delete(1);

            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task Delete_WhenTaskNotFound_ReturnsNotFound()
        {
            var mockService = new Mock<ITaskService>();
            mockService.Setup(s => s.DeleteAsync(1))
                .ReturnsAsync(false);

            var controller = new TaskManagerController(mockService.Object);

            var result = await controller.Delete(1);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetAll_ReturnsOkWithTasks()
        {
            var mockService = new Mock<ITaskService>();
            var tasks = new List<TaskDTO>
            {
            new TaskDTO { Id = 1, Title = "Task 1" },
            new TaskDTO { Id = 2, Title = "Task 2" }
            };

            mockService.Setup(s => s.GetAllAsync())
            .ReturnsAsync(tasks);

            var controller = new TaskManagerController(mockService.Object);

            var result = await controller.GetAll();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedTasks = Assert.IsAssignableFrom<IEnumerable<TaskDTO>>(okResult.Value);
            Assert.Equal(2, returnedTasks.Count());
        }

        [Fact]
        public async Task Create_CallsServiceWithCorrectData()
        {
            var mockService = new Mock<ITaskService>();
            var inputDto = new TaskDTO { Title = "Test", Description = "Desc" };
            mockService.Setup(s => s.CreateAsync(It.IsAny<TaskDTO>()))
                .ReturnsAsync(new TaskDTO { Id = 1, Title = "Test" });

            var controller = new TaskManagerController(mockService.Object);
            await controller.Create(inputDto);

            mockService.Verify(s => s.CreateAsync(
                It.Is<TaskDTO>(dto => dto.Title == "Test" && dto.Description == "Desc")
            ), Times.Once);
        }

        [Fact]
        public async Task Create_WithInvalidModel_ReturnsBadRequest()
        {
            var mockService = new Mock<ITaskService>();

            mockService.Setup(s => s.CreateAsync(It.IsAny<TaskDTO>()))
                .ReturnsAsync(new TaskDTO { Id = 1 });

            var controller = new TaskManagerController(mockService.Object);
            controller.ModelState.AddModelError("Title", "Required");

            var result = await controller.Create(new TaskDTO());

            Assert.IsType<BadRequestObjectResult>(result.Result);
        }
    }
}