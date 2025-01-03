using System.ComponentModel;

namespace BlogApi.Core.Enums;

public enum BlogSortType
{
    [Description("En Yeni")]
    Newest = 0,
    
    [Description("En Eski")]
    Oldest = 1,
    
    [Description("En Çok Görüntülenen")]
    MostViewed = 2,
    
    [Description("En Çok Yorumlanan")]
    MostCommented = 3
} 