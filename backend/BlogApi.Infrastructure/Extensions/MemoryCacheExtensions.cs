using System.Reflection;
using Microsoft.Extensions.Caching.Memory;

namespace BlogApi.Infrastructure.Extensions;

public static class MemoryCacheExtensions
{
    public static IEnumerable<string> GetKeys(this IMemoryCache memoryCache)
    {
        var field = typeof(MemoryCache).GetField("_entries", BindingFlags.NonPublic | BindingFlags.Instance);
        var entries = field?.GetValue(memoryCache) as IDictionary<object, object>;
        
        return entries?.Keys.Select(k => k.ToString()) ?? Enumerable.Empty<string>();
    }
} 