using System.ComponentModel;

namespace BlogApi.Core.Enums;

public enum BlogSortTypesEnum
{
    [Description("En Yeniler")]
    EnYeniler = 1,
    [Description("En Eskiler")]
    EnEskiler = 2,
}
