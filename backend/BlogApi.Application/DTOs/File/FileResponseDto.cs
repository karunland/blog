namespace BlogApi.Application.DTOs.File;


public record FileResponse
{
    public byte[] FileContents { get; set; }
    public string ContentType { get; set; }
    public string FileName { get; set; }
    public string FileUrl { get; set; }
    public string Extension { get; set; }
    public double FileSize { get; set; }
    public string OriginalFileName { get; set; }
}
