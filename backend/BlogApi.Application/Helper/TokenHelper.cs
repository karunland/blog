using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BlogApi.Application.DTOs.User;
using Microsoft.IdentityModel.Tokens;

namespace BlogApi.Application.Helper;


public static class TokenHelper
{

    public static string GenerateToken(JwtTokenDto user)
    {
        var jwtSecret = "F833F51D8A55AA8D8EFACBB72AE3C2A863BA577C2F16E22495356C7FFD";

        JwtSecurityTokenHandler tokenHandler = new();
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity([
                new("LoggedInUser", user.ToJson().ToCryptoText())
            ]),
            Expires = DateTime.UtcNow.AddDays(30),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

}

