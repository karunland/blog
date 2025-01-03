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
                new() {
                    Title = "The Future of AI",
                    Content = @"<h2>Artificial Intelligence: Shaping Our Future</h2>
                               <p>AI is revolutionizing the world in ways we never imagined. From self-driving cars to advanced medical diagnostics, the impact of AI is being felt across every industry.</p>
                               <h3>Key Areas of AI Development</h3>
                               <ul>
                                   <li>Machine Learning</li>
                                   <li>Natural Language Processing</li>
                                   <li>Computer Vision</li>
                                   <li>Robotics</li>
                               </ul>
                               <p>As we look to the future, AI will continue to evolve and shape our daily lives. Companies are investing heavily in AI research and development, leading to breakthrough innovations.</p>
                               <blockquote>
                                   <p>The development of full artificial intelligence could spell the end of the human race. - Stephen Hawking</p>
                               </blockquote>
                               <h3>Impact on Society</h3>
                               <p>While AI brings numerous benefits, it also raises important ethical questions that we must address as a society.</p>",
                    Slug = "future-of-ai",
                    CategoryId = 1,
                    UserId = 1,
                    ViewCount = 100,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_mouse.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(1)
                },
                new() {
                    Title = "Top 10 Healthy Foods",
                    Content = @"<h2>Essential Foods for a Healthy Lifestyle</h2>
                               <p>Maintaining a healthy diet is crucial for overall wellbeing. Here are some superfoods you should include in your daily meals.</p>
                               <h3>Top 10 Superfoods</h3>
                               <ol>
                                   <li><strong>Blueberries</strong> - Rich in antioxidants</li>
                                   <li><strong>Salmon</strong> - High in omega-3 fatty acids</li>
                                   <li><strong>Kale</strong> - Packed with vitamins and minerals</li>
                                   <li><strong>Quinoa</strong> - Complete protein source</li>
                                   <li><strong>Avocado</strong> - Healthy fats and fiber</li>
                               </ol>
                               <h3>Benefits of Healthy Eating</h3>
                               <ul>
                                   <li>Increased energy levels</li>
                                   <li>Better immune system</li>
                                   <li>Improved mental clarity</li>
                                   <li>Healthy weight maintenance</li>
                               </ul>
                               <p><em>Remember: You are what you eat!</em></p>",
                    Slug = "top-10-healthy-foods",
                    CategoryId = 2,
                    UserId = 2,
                    ViewCount = 200,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_old-people.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(2)
                },
                new() {
                    Title = "Traveling to Japan",
                    Content = @"<h2>Discovering the Land of the Rising Sun</h2>
                               <p>Japan is a country where ancient traditions blend seamlessly with modern technology. Let's explore what makes Japan a unique travel destination.</p>
                               <h3>Must-Visit Destinations</h3>
                               <ul>
                                   <li><strong>Tokyo</strong> - The bustling metropolis</li>
                                   <li><strong>Kyoto</strong> - Cultural heart of Japan</li>
                                   <li><strong>Mount Fuji</strong> - Japan's iconic symbol</li>
                                   <li><strong>Osaka</strong> - Food lover's paradise</li>
                               </ul>
                               <h3>Travel Tips</h3>
                               <ol>
                                   <li>Learn basic Japanese phrases</li>
                                   <li>Get a Japan Rail Pass</li>
                                   <li>Try local cuisine</li>
                                   <li>Respect local customs</li>
                               </ol>
                               <blockquote>
                                   <p>To travel is to live. - Hans Christian Andersen</p>
                               </blockquote>",
                    Slug = "traveling-to-japan",
                    CategoryId = 3,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_default.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(3)
                },
                new() {
                    Title = "The Rise of Online Education",
                    Content = @"<h2>The Future of Learning is Digital</h2>
                               <p>Online education has transformed the way we learn and acquire new skills. This revolution in education is making learning more accessible than ever before.</p>
                               <h3>Advantages of Online Learning</h3>
                               <ul>
                                   <li>Flexibility in schedule</li>
                                   <li>Learn at your own pace</li>
                                   <li>Access to global resources</li>
                                   <li>Cost-effective education</li>
                               </ul>
                               <h3>Popular Learning Platforms</h3>
                               <ol>
                                   <li><strong>Coursera</strong> - University partnerships</li>
                                   <li><strong>Udemy</strong> - Skill-based courses</li>
                                   <li><strong>edX</strong> - Academic excellence</li>
                               </ol>
                               <p><em>Education is not preparation for life; education is life itself.</em></p>",
                    Slug = "rise-of-online-education",
                    CategoryId = 4,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(4)
                },
                new() {
                    Title = "How to Start a Business",
                    Content = @"<h2>Essential Guide for Entrepreneurs</h2>
                               <p>Starting a business requires careful planning and execution. Here's your comprehensive guide to launching a successful venture.</p>
                               <h3>Key Steps to Start</h3>
                               <ol>
                                   <li><strong>Market Research</strong> - Know your audience</li>
                                   <li><strong>Business Plan</strong> - Create a roadmap</li>
                                   <li><strong>Funding</strong> - Secure capital</li>
                                   <li><strong>Legal Requirements</strong> - Register your business</li>
                               </ol>
                               <h3>Common Challenges</h3>
                               <ul>
                                   <li>Financial management</li>
                                   <li>Time constraints</li>
                                   <li>Market competition</li>
                                   <li>Resource allocation</li>
                               </ul>
                               <blockquote>
                                   <p>Success is not final, failure is not fatal: it is the courage to continue that counts.</p>
                               </blockquote>",
                    Slug = "how-to-start-a-business",
                    CategoryId = 5,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(5)
                },
                new() {
                    Title = "Space Exploration Updates",
                    Content = @"<h2>Latest Discoveries in Space Science</h2>
                               <p>Space exploration continues to push the boundaries of human knowledge. Here are the latest developments in space science and exploration.</p>
                               <h3>Recent Missions</h3>
                               <ul>
                                   <li><strong>Mars Rover</strong> - New discoveries on the red planet</li>
                                   <li><strong>James Webb Telescope</strong> - Deep space observations</li>
                                   <li><strong>SpaceX Launches</strong> - Commercial space flight</li>
                               </ul>
                               <h3>Future Projects</h3>
                               <ol>
                                   <li>Artemis Moon Mission</li>
                                   <li>Mars Human Landing</li>
                                   <li>Deep Space Exploration</li>
                               </ol>
                               <blockquote>
                                   <p>That's one small step for man, one giant leap for mankind. - Neil Armstrong</p>
                               </blockquote>",
                    Slug = "space-exploration-updates",
                    CategoryId = 6,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_mouse.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(6)
                },
                new() {
                    Title = "Minimalist Lifestyle",
                    Content = @"<h2>Living with Less: A Guide to Minimalism</h2>
                               <p>Minimalism isn't just about decluttering; it's about intentional living and finding freedom through simplicity.</p>
                               <h3>Benefits of Minimalism</h3>
                               <ul>
                                   <li>Reduced stress and anxiety</li>
                                   <li>More time and energy</li>
                                   <li>Financial freedom</li>
                                   <li>Environmental impact</li>
                               </ul>
                               <h3>Steps to Minimalism</h3>
                               <ol>
                                   <li><strong>Declutter</strong> - Start with physical items</li>
                                   <li><strong>Simplify</strong> - Digital and commitments</li>
                                   <li><strong>Maintain</strong> - Create lasting habits</li>
                               </ol>
                               <blockquote>
                                   <p>Less is more. - Ludwig Mies van der Rohe</p>
                               </blockquote>",
                    Slug = "minimalist-lifestyle",
                    CategoryId = 7,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_old-people.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(7)
                },
                new() {
                    Title = "Summer Fashion Trends",
                    Content = @"<h2>Style Guide: Summer 2024</h2>
                               <p>Stay ahead of the fashion curve with these trending styles and must-have pieces for the summer season.</p>
                               <h3>Key Trends</h3>
                               <ul>
                                   <li><strong>Colors</strong> - Pastels and neon</li>
                                   <li><strong>Patterns</strong> - Floral and geometric</li>
                                   <li><strong>Fabrics</strong> - Sustainable materials</li>
                                   <li><strong>Accessories</strong> - Minimalist jewelry</li>
                               </ul>
                               <h3>Essential Items</h3>
                               <ol>
                                   <li>Linen dresses</li>
                                   <li>Wide-leg pants</li>
                                   <li>Crop tops</li>
                                   <li>Statement sandals</li>
                               </ol>
                               <p><em>Fashion is about dressing according to what's fashionable. Style is more about being yourself.</em></p>",
                    Slug = "summer-fashion-trends",
                    CategoryId = 8,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_default.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(8)
                },
                new() {
                    Title = "Top Recipes for Foodies",
                    Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>",
                    Slug = "top-recipes-for-foodies",
                    CategoryId = 9,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_old-people.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(9)
                },
                new() {
                    Title = "The History of Soccer",
                    Content = "From its origins to modern times...",
                    Slug = "history-of-soccer",
                    CategoryId = 10,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(10)
                },
                new() {
                    Title = "Gaming in 2024",
                    Content = "Upcoming games and consoles...",
                    Slug = "gaming-in-2024",
                    CategoryId = 11,
                    UserId = 2,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_mouse.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(11)
                },
                new() {
                    Title = "Top Movies to Watch",
                    Content = "Don't miss these blockbusters...",
                    Slug = "top-movies-to-watch",
                    CategoryId = 12,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_default.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(12)
                },
                new() {
                    Title = "Investing Basics",
                    Content = "Learn how to grow your wealth...",
                    Slug = "investing-basics",
                    CategoryId = 13,
                    UserId = 1,
                    ViewCount = 300,
                    Likes = [new() { UserId = 2 }],
                    ImageUrl = "Thumbnail_statistic.jpg",
                    CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(13)
                },
                new() { Title = "Politics in 2024", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 14, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(14)  },
                new() { Title = "Politics in 2024", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(15)  },
                new() { Title = "Politics in 2024 4", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(16)  },
                new() { Title = "Politics in 2024 2", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(17)  },
                new() { Title = "Politics in 2024 3", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(18)  },
                new() { Title = "Politics in 2024 4", Content = @"<h2>Culinary Adventures: Must-Try Recipes</h2>
                               <p>Explore these delicious recipes that will take your cooking skills to the next level.</p>
                               <h3>Featured Recipes</h3>
                               <ol>
                                   <li><strong>Pasta Carbonara</strong>
                                       <ul>
                                           <li>Fresh eggs</li>
                                           <li>Pecorino Romano</li>
                                           <li>Guanciale</li>
                                       </ul>
                                   </li>
                                   <li><strong>Thai Green Curry</strong>
                                       <ul>
                                           <li>Coconut milk</li>
                                           <li>Fresh herbs</li>
                                           <li>Thai chilies</li>
                                       </ul>
                                   </li>
                               </ol>
                               <h3>Cooking Tips</h3>
                               <ul>
                                   <li>Prep ingredients beforehand</li>
                                   <li>Use fresh ingredients</li>
                                   <li>Temperature control is key</li>
                               </ul>
                               <blockquote>
                                   <p>Cooking is like love. It should be entered into with abandon or not at all.</p>
                               </blockquote>", Slug = "politics-in-2024", CategoryId = 1, UserId = 2, ViewCount = 300, Likes = [new() { UserId = 2 }], ImageUrl = "Thumbnail_default.jpg", CreatedAt = DateTime.UtcNow - TimeSpan.FromDays(19)  },
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