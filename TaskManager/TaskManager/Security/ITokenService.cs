using TaskManager.Models;

namespace TaskManager.Security
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
