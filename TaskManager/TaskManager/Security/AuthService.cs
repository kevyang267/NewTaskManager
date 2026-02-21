using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;
using TaskManager.Security;

namespace TaskManager.Services
{
    public class AuthService : IAuthService
    {
        private readonly TaskManagerDbContext _context;
        private readonly TokenService _tokenService;  

        public AuthService(TaskManagerDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var email = request.Email.Trim().ToLower();

            if (await _context.Users.AnyAsync(u => u.Email == email))
                throw new InvalidOperationException("Email already in use");

            var user = new UserEntity
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return await _tokenService.GenerateToken(user);
        }

        public async Task<string> LoginAsync(LoginRequest request)
        {
            var email = request.Email.Trim().ToLower();
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password");

            return await _tokenService.GenerateToken(user);
        }
    }
}