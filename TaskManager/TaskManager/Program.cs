using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using TaskManager.Data;
using TaskManager.Middleware.TaskManager.Middleware;
using TaskManager.Services;

// BUILDER 
var builder = WebApplication.CreateBuilder(args);

// CONFIGURATIONS 
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Optional: Customize Swagger documentation details
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TaskManagerAPI",
        Version = "v1"
    });
    // Add security definitions if needed (e.g., Bearer tokens)
});


builder.Services.AddDbContext<TaskManagerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITaskService, TaskService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection String: {connectionString}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskManagerV1");
    });
}

// Move migration into a local async method
async Task MigrateDatabaseAsync()
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<TaskManagerDbContext>();
        await context.Database.MigrateAsync();
        Console.WriteLine("Database migration completed successfully.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
        throw;
    }
}

await MigrateDatabaseAsync();

// USAGE 
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();
await app.RunAsync();