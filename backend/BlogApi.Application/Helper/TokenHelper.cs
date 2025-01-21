using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using BlogApi.Application.Common.Settings;
using BlogApi.Application.DTOs.User;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace BlogApi.Application.Helper;


public class TokenHelper(BaseSettings baseSettings)
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

     public async Task<bool> VerifyGoogleAccessToken(string token)
    {
        HttpClient client = new();
        var response = await client.GetAsync($"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}");
        if (response.IsSuccessStatusCode)
        {
            await response.Content.ReadAsStringAsync();
            
            
            // JSON'dan gerekli bilgileri çıkarın ve doğrulayın.
            return true;
        }

        return false;
    }

    public async Task<GoogleJsonWebSignature.Payload> GetPayloadFromGoogle(string token)
    {
        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [baseSettings.GoogleClientId]
            };
            var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
            return payload;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return null;
        }
    }

    public async Task<UserInfo> GetUserInfoFromGoogle(string token)
    {
        HttpClient client = new();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo");

        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            var userInfo = JsonConvert.DeserializeObject<UserInfo>(json);
            return userInfo;
        }

        return null;
    }
}


public class UserInfo
{
    [JsonProperty("sub")] public string Id { get; set; }

    [JsonProperty("name")] public string Name { get; set; }
    [JsonProperty("given_name")] public string GivenName { get; set; }
    [JsonProperty("family_name")] public string FamilyName { get; set; }
    [JsonProperty("email")] public string Email { get; set; }
    [JsonProperty("picture")] public string Picture { get; set; }
}
