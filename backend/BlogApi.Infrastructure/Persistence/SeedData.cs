using System.Runtime.InteropServices.JavaScript;
using BlogApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence;

public static class SeedData
{
    public static void SeedDatabase(this BlogContext context)
    {
        var ss = @"<div>
                        <h1>What is Lorem Ipsum?</h1>
                        <p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div>
                        <div>
                        <h1>Why do we use it?</h1>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                        </div>
                        <p>&nbsp;</p>
                        <div>
                        <h2>Where does it come from?</h2>
                        <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.</p>
                        <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
                        </div>
                        <div>
                        <h2>Where can I get some?</h2>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.<br><br></p>
                        <div>
                        <h1>What is Lorem Ipsum?</h1>
                        <p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                        </div>
                        <div>
                        <h2>Why do we use it?</h2>
                        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                        </div>
                        <p>&nbsp;</p>
                        <div>
                        <h2>Where does it come from?</h2>
                        <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.</p>
                        <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
                        </div>
                        <div>
                        <h2>Where can I get some?</h2>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
                        </div>
                        </div>";
        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new()
                {
                    Id = 1,
                    FirstName = "harun",
                    LastName = "korkmaz",
                    Username = "harunkorkmaz",
                    Email = "1harunkorkmaz@gmail.com",
                    Password = "7C4A8D09CA3762AF61E59520943DC26494F8941B",
                    FileUrl = "ProfilePicture_unnamed.jpg",
                    FileName = "ProfilePicture_unnamed.jpg",
                    Extension = ".jpg",
                    IsMailVerified = true,
                    IsGoogleRegister = false,
                },
                new()
                {
                    Id = 2,
                    FirstName = "John",
                    LastName = "Doe",
                    Username = "johndoe",
                    Email = "johndoe@gmail.com",
                    Password = "7C4A8D09CA3762AF61E59520943DC26494F8941B",
                    FileUrl = "ProfilePicture_ff92118a2c6d471d90ec324578003123808c954ffb2a4b689f4ba377e9dfdb1a.jpg",
                    FileName = "ProfilePicture_ff92118a2c6d471d90ec324578003123808c954ffb2a4b689f4ba377e9dfdb1a.jpg",
                    Extension = ".jpg",
                    IsMailVerified = true,
                    IsGoogleRegister = false,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2024, 1, 2), DateTimeKind.Utc),
                }
            };
            context.Users.AddRange(users);
        }

        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Technology", Slug = "technology", CreatedAt = DateTime.UtcNow },
                new() { Name = "Health", Slug = "health", CreatedAt = DateTime.UtcNow },
                new() { Name = "Travel", Slug = "travel", CreatedAt = DateTime.UtcNow },
                new() { Name = "Education", Slug = "education", CreatedAt = DateTime.UtcNow },
                new() { Name = "Business", Slug = "business", CreatedAt = DateTime.UtcNow },
                new() { Name = "Science", Slug = "science", CreatedAt = DateTime.UtcNow },
                new() { Name = "Lifestyle", Slug = "lifestyle", CreatedAt = DateTime.UtcNow },
                new() { Name = "Fashion", Slug = "fashion", CreatedAt = DateTime.UtcNow },
                new() { Name = "Food", Slug = "food", CreatedAt = DateTime.UtcNow },
                new() { Name = "Sports", Slug = "sports", CreatedAt = DateTime.UtcNow },
                new() { Name = "Gaming", Slug = "gaming", CreatedAt = DateTime.UtcNow },
                new() { Name = "Movies", Slug = "movies", CreatedAt = DateTime.UtcNow },
                new() { Name = "Finance", Slug = "finance", CreatedAt = DateTime.UtcNow },
                new() { Name = "Politics", Slug = "politics", CreatedAt = DateTime.UtcNow }
            };
            context.Categories.AddRange(categories);

            context.SaveChanges();
        }

        if (!context.Blogs.Any())
        {
            var blogs = new List<Blog>
            {
                new() {
                    Title = "Top Recipes for Foodies",
                    Content = ss,
                    Slug = "top-recipes-for-foodies",
                    CategoryId = context.Categories.FirstOrDefault(c => c.Name == "Food").Id,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_old-people.jpg",
                    CreatedAt = DateTime.UtcNow,
                    Comments = [new() { UserId = context.Users.FirstOrDefault().Id, Content = "Good article." }, new() { UserId = context.Users.FirstOrDefault().Id, Content = "This is a good article." }]
                },
                new() {
                    Title = "The History of Soccer",
                    Content = ss,
                    Slug = "history-of-soccer",
                    Category = context.Categories.FirstOrDefault(c => c.Name == "Sports"),
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow,
                    Comments = [new() { UserId = context.Users.FirstOrDefault().Id, Content = "Harika bir makale." }, new() { UserId = context.Users.FirstOrDefault().Id, Content = "Bu da harika bir makale." }]
                },
                new() {
                    Title = "Gaming in 2024",
                    Content = ss,
                    Slug = "gaming-in-2024",
                    CategoryId = context.Categories.FirstOrDefault(c => c.Name == "Gaming").Id,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_mouse.jpg",
                    CreatedAt = DateTime.UtcNow,
                    Comments = [new() { UserId = context.Users.FirstOrDefault().Id, Content = "Good article." }, new() { UserId = context.Users.FirstOrDefault().Id, Content = "This is a good article." }]
                },
                new() {
                    Title = "Top Movies to Watch",
                    Content = ss,
                    Slug = "top-movies-to-watch",
                    CategoryId = context.Categories.FirstOrDefault(c => c.Name == "Movies").Id,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_default.jpg",
                    CreatedAt = DateTime.UtcNow,
                    Comments = [new() { UserId = context.Users.FirstOrDefault().Id, Content = "Good article." }, new() { UserId = context.Users.FirstOrDefault().Id, Content = "This is a good article." }]
                },
                new() {
                    Title = "Investing Basics",
                    Content = ss,
                    Slug = "investing-basics",
                    CategoryId = context.Categories.FirstOrDefault(c => c.Name == "Finance").Id,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow,
                    Comments = [new() { UserId = context.Users.FirstOrDefault().Id, Content = "Good article." }, new() { UserId = context.Users.FirstOrDefault().Id, Content = "This is a good article." }]
                }
            };

            context.Blogs.AddRange(blogs);
        }
        
        context.SaveChanges();
    }
}