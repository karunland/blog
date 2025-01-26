using System.Net;
using System.Text.Json.Serialization;
using BlogApi.Application.Common.Messages;

namespace BlogApi.Application.DTOs;

public readonly record struct ApiError
{
    public HttpStatusCode? Code { get; } = HttpStatusCode.OK;

    [JsonIgnore]
    public string ErrorMessage { get; }

    private ApiError(string message, HttpStatusCode? code)
    {
        ErrorMessage = message;
        Code = code;
    }

    public static ApiError Failure(string message = null, HttpStatusCode? code = HttpStatusCode.OK)
    {
        return new ApiError(message ?? Messages.Fail, code);
    }

}