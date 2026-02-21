using TaskManager.Models;

namespace TaskManager.Security
{
    public interface ITokenService
    {
        Task<string> GenerateToken(UserEntity user);
    }
}