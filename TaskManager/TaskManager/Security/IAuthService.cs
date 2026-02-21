using Microsoft.AspNetCore.Identity.Data;

namespace TaskManager.Security
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest request);
        Task<string> LoginAsync(LoginRequest request);
    }
}
