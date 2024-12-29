using System.ComponentModel;
using System.Reflection;

namespace BlogApi.Utilities;

public static class EnumHelper
{

    public static string GetEnumDescription(this Enum value)
    {
        FieldInfo field = value.GetType().GetField(value.ToString());
        if (field == null) return string.Empty;

        DescriptionAttribute attribute = (DescriptionAttribute)Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));
        return attribute?.Description ?? value.ToString();
    }
}
