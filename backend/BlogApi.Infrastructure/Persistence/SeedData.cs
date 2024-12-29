using System.Runtime.InteropServices.JavaScript;
using BlogApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedDatabaseAsync(this BlogContext context)
    {
        if (!await context.Users.AnyAsync())
        {
            var users = new List<User>
            {
                new()
                {
                    Id = 1,
                    FirstName = "name",
                    LastName = "surname",
                    Username = "username",
                    Email = "test@test.test",
                    Password = "7C4A8D09CA3762AF61E59520943DC26494F8941B",
                },
                new()
                {
                    Id = 2,
                    FirstName = "John",
                    LastName = "Doe",
                    Username = "johndoe",
                    Email = "johndoe@gmail.com",
                    Password = "7C4A8D09CA3762AF61E59520943DC26494F8941B",
                }
            };
            context.Users.AddRange(users);
        }

        if (!await context.Categories.AnyAsync())
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
        }

        if (!await context.Blogs.AnyAsync())
        {
            var blogs = new List<Blog>
            {
                new() { Title = "The Future of AI", Content = "AI is revolutionizing the world...", Slug = "future-of-ai", CategoryId = 1, UserId = 1 , ViewCount = 100, Likes = [new() { UserId = 2 }] },
                new() { Title = "Top 10 Healthy Foods", Content = "Eating healthy is essential for a long life...", Slug = "top-10-healthy-foods", CategoryId = 2, UserId = 2, ViewCount = 200, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Traveling to Japan", Content = "Explore the beauty of Japan in 2024...", Slug = "traveling-to-japan", CategoryId = 3, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "The Rise of Online Education", Content = "E-learning is the new norm...", Slug = "rise-of-online-education", CategoryId = 4, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "How to Start a Business", Content = "Tips for entrepreneurs...", Slug = "how-to-start-a-business", CategoryId = 5, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Space Exploration Updates", Content = "NASA announces new missions...", Slug = "space-exploration-updates", CategoryId = 6, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Minimalist Lifestyle", Content = "Declutter your life with minimalism...", Slug = "minimalist-lifestyle", CategoryId = 7, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Summer Fashion Trends", Content = "Stay stylish with these trends...", Slug = "summer-fashion-trends", CategoryId = 1, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Top Recipes for Foodies", Content = "Delicious recipes to try at home...", Slug = "top-recipes-for-foodies", CategoryId = 9, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "The History of Soccer", Content = "From its origins to modern times...", Slug = "history-of-soccer", CategoryId = 10, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Gaming in 2024", Content = "Upcoming games and consoles...", Slug = "gaming-in-2024", CategoryId = 11, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Top Movies to Watch", Content = "Don't miss these blockbusters...", Slug = "top-movies-to-watch", CategoryId = 12, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Investing Basics", Content = "Learn how to grow your wealth...", Slug = "investing-basics", CategoryId = 13, UserId = 1, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 14, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024 4", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024 2", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024 3", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
                new() { Title = "Politics in 2024 4", Content = "Key political events and elections...", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }]  },
            };

            context.Blogs.AddRange(blogs);
        }

        if (!await context.Comments.AnyAsync())
        {
            var comments = new List<Comment>
            {
                new() { BlogId = 1, UserId = 2, Content = "Great article!"},
                new() { BlogId = 1, UserId = 1, Content = "I agree with you."},
                new() { BlogId = 2, UserId = 1, Content = "Very informative."},
                new() { BlogId = 2, UserId = 2, Content = "thx."},
                new() { BlogId = 3, UserId = 2, Content = "I love Japan!"},
                new() { BlogId = 3, UserId = 1, Content = "Me too!"},
                new() { BlogId = 4, UserId = 1, Content = "E-learning is the future."},
                new() { BlogId = 4, UserId = 2, Content = "I agree."},
                new() { BlogId = 5, UserId = 2, Content = "Starting a business is tough."},
                new() { BlogId = 5, UserId = 1, Content = "It takes hard work."},
                new() { BlogId = 6, UserId = 1, Content = "Space is fascinating."},
                new() { BlogId = 6, UserId = 2, Content = "I love astronomy."},
                new() { BlogId = 7, UserId = 2, Content = "Minimalism is the way to go."},
                new() { BlogId = 7, UserId = 1, Content = "Less is more."},
                new() { BlogId = 8, UserId = 1, Content = "Fashion is my passion."},
                new() { BlogId = 8, UserId = 2, Content = "I love shopping."},
                new() { BlogId = 9, UserId = 2, Content = "I love cooking!"},
                new() { BlogId = 9, UserId = 1, Content = "Me too!"},
                new() { BlogId = 10, UserId = 1, Content = "Soccer is the best sport."},
                new() { BlogId = 10, UserId = 2, Content = "I'm a fan."},
                new() { BlogId = 11, UserId = 2, Content = "Gaming is my hobby."},
                new() { BlogId = 11, UserId = 1, Content = "I play games too."},
                new() { BlogId = 12, UserId = 1, Content = "Movies are my escape."},
                new() { BlogId = 12, UserId = 2, Content = "I love watching movies."},
                new() { BlogId = 13, UserId = 2, Content = "Investing is important."},
                new() { BlogId = 13, UserId = 1, Content = "Grow your wealth."},
                new() { BlogId = 14, UserId = 1, Content = "Politics is interesting."},
                new() { BlogId = 14, UserId = 2, Content = "I follow politics."},
                new() { BlogId = 15, UserId = 2, Content = "Politics is interesting."},
                new() { BlogId = 15, UserId = 1, Content = "I follow politics."},
                new() { BlogId = 16, UserId = 1, Content = "Politics is interesting."},
                new() { BlogId = 16, UserId = 2, Content = "I follow politics."},
            };

            context.Comments.AddRange(comments);
        }
        await context.SaveChangesAsync();
    }
}