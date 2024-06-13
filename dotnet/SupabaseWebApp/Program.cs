using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SupabaseWebApp.Data;
using SupabaseWebApp.Services;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Configure Entity Framework and Identity
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("InMemoryDb"));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}


builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add Razor Pages
builder.Services.AddRazorPages();

builder.Services.AddHttpClient<SupabaseService>();
builder.Services.AddTransient<SupabaseService>();

builder.Services.AddLogging();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.Run();
