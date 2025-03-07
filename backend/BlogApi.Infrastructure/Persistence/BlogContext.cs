﻿using BlogApi.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Infrastructure.Persistence;

public class BlogContext(DbContextOptions<BlogContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<VerificationCodes> VerificationCodes { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<View> Views { get; set; }
}
