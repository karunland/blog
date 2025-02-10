using BlogApi.Application.DTOs.File;
using BlogApi.Core.Enums;
using Microsoft.AspNetCore.StaticFiles;

namespace BlogApi.Infrastructure.Persistence.Repositories;

public class FileRepo
{
    private const string BasePath = "BlogApiFiles";

    private static readonly string[] SupportedFileTypes =
    [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
    ];

    public FileRepo()
    {
        if (!Directory.Exists(BasePath))
            Directory.CreateDirectory(BasePath);
    }
    
    private static string GetFolderName(FileTypeEnum type)
    {
        var folderFileName = type switch
        {
            FileTypeEnum.ProfilePicture => "ProfilePicture",
            FileTypeEnum.Thumbnail => "Thumbnail",
            FileTypeEnum.BlogImage => "BlogImage",
            // FileTypeEnum.ProfileGif => "ProfileGif",
            _ => "",
        };

        return folderFileName;
    }

    public async Task<FileResponse> UploadFileAsync(UploadFileAsyncDto model,
        CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(model.File.FileName).ToLower();

        if (!SupportedFileTypes.Contains(extension))
            throw new InvalidOperationException("Dosya formatı desteklenmiyor");

        if (model.File.Length > 20_971_520)
        {
            throw new InvalidOperationException("Dosya max sınırı 20 megabyte!");
        }

        var folderName = GetFolderName(model.Type);
        var pathToSave = Path.Combine(BasePath, folderName);

        if (!Directory.Exists(pathToSave))
            Directory.CreateDirectory(pathToSave);

        var fileName = (Guid.NewGuid() + Guid.NewGuid().ToString()).Replace("-", "") + extension;
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = $"{folderName}_{fileName}";

        await using (Stream fileStream = new FileStream(fullPath, FileMode.Create))
            await model.File.CopyToAsync(fileStream, cancellationToken);

        return new FileResponse
        {
            FileName = fileName,
            FileUrl = dbPath,
            Extension = extension,
            FileSize = model.File.Length,
            OriginalFileName = model.File.FileName
        };
    }

    public async Task<FileResponse> GetFileAsync(string file)
    {
        file = file.Replace("_", "/");

        if (string.IsNullOrWhiteSpace(file))
            throw new ArgumentNullException();

        var filePath = Path.Combine(BasePath, file);

        if (!File.Exists(filePath))
            throw new FileNotFoundException();

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(filePath, out var contentType))
        {
            throw new InvalidOperationException();
        }

        var fileBytes = await File.ReadAllBytesAsync(filePath);
        var name = file[(file.LastIndexOf('/') + 1)..];

        return new FileResponse { ContentType = contentType, FileName = name, FileContents = fileBytes };
    }
}
