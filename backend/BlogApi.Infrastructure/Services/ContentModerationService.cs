// using System.Text.RegularExpressions;
// using BlogApi.Application.Common.Settings;
// using BlogApi.Application.DTOs;
// using OpenAI;
//
//
// namespace BlogApi.Infrastructure.Services;
//
// public class ContentModerationService
// {
//     private readonly OpenAIClient _api;
//
//     public ContentModerationService(BaseSettings settings)
//     {
//         _api = new OpenAIClient(settings.OpenAIApiKey);
//     }
//
//     public async Task<ApiResult> CheckTextContent(string content)
//     {
//         try
//         {
//             var plainText = Regex.Replace(content, "<.*?>", string.Empty);
//             
//             var result = await _api.Moderations.Create(new ModerationRequest(input: plainText));
//
//             if (result.Results[0].Flagged)
//             {
//                 var categories = result.Results[0].Categories
//                     .Where(c => c.Value)
//                     .Select(c => c.Key)
//                     .ToList();
//
//                 return ApiError.Failure($"İçerik uygunsuz bulundu. Sebep: {string.Join(", ", categories)}");
//             }
//
//             return ApiResult.Success();
//         }
//         catch (Exception ex)
//         {
//             return ApiError.Failure($"İçerik kontrolü sırasında hata oluştu: {ex.Message}");
//         }
//     }
//
//     public async Task<(bool isAppropriate, string reason)> CheckImage(byte[] imageBytes)
//     {
//         try
//         {
//             // OpenAI'nin Vision API'sini kullanarak görsel içerik kontrolü
//             // Not: Bu özellik henüz tam olarak desteklenmiyor, alternatif olarak Google Cloud Vision API kullanılabilir
//             return (true, string.Empty);
//         }
//         catch (Exception ex)
//         {
//             return (false, $"Görsel kontrolü sırasında hata oluştu: {ex.Message}");
//         }
//     }
// } 