using System.ComponentModel;

namespace BlogApi.Core.Enums;

public enum BlogStatusEnum
{
    [Description("Draft")]
    Draft = 1,
    [Description("Published")]
    Published = 2,
    [Description("Archived")]
    Archived = 3
}