using System.Text.Json;

namespace BlogApi.Application.Helper;

public static class JsonTools
{
    public static T FromJson<T>(this string jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString))
            return default;
        return JsonSerializer.Deserialize<T>(jsonString);
    }

    public static string ToJson(this object obj)
    {
        return JsonSerializer.Serialize(obj);
    }
}