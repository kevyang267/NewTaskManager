using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using TaskManager.Services;
using Microsoft.AspNetCore.Authorization;

namespace TaskManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TaskManagerController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskManagerController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDTO>>> GetAll()
        {
            var tasks = await _taskService.GetAllAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDTO>> GetById(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskDTO>> Create([FromBody] TaskDTO task)
        { 

            var createdTask = await _taskService.CreateAsync(task);
            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] TaskDTO task)
        {
            if (id != task.Id)
            {
                return BadRequest(new { message = "ID mismatch" });
            }

            await _taskService.UpdateAsync(task);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _taskService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}