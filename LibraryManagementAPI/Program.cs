using LibraryManagementAPI.Models; 
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Retrieve JWT settings from configuration
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtKey = builder.Configuration["Jwt:Key"];

// Ensure JWT key is not null or empty
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException(nameof(jwtKey), "JWT key cannot be null or empty.");
}

var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

builder.Services.AddControllers();

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Define the Security Scheme (JWT Bearer)
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,  // The token is passed in the HTTP Header
        Description = "Please insert JWT with Bearer into field", // Instructions displayed to the user in Swagger UI
        Name = "Authorization",                                  // The name of the header where the token should go
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey, // We're treating the JWT as an API key
        BearerFormat = "JWT",                                     // The format of the token, which is a JWT
        Scheme = "Bearer"                                         // The scheme used to authenticate the user
    });

    // Define which endpoints require security (i.e., JWT authentication)
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement 
    {
        {
            // Reference the Bearer security scheme we just defined
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"  // This ID refers to the "Bearer" security scheme defined above
                }
            },
            new string[] { }  // This means all endpoints that require this scheme don't need any additional scopes
        }
    });
});

//cross origin config
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3001") // Your frontend's URL
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // If you are using cookies or authentication
    });
});

var app = builder.Build();

// Enable CORS
app.UseCors();

// Configure Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Seed roles during startup
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    await SeedRoles(roleManager);
}

// Seed database with fake data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Get the database context
        var context = services.GetRequiredService<ApplicationDbContext>();

        // Try to apply pending migrations
        try
        {
            context.Database.Migrate();
            Console.WriteLine("Database migration applied successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while applying migrations: {ex.Message}");
        }

        // Try to seed the database
        try
        {
            var seeder = new DatabaseSeeder(context);
            seeder.Seed();
            Console.WriteLine("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while seeding the database: {ex.Message}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while resolving services: {ex.Message}");
    }
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

async Task SeedRoles(RoleManager<IdentityRole> roleManager)
{
    string[] roleNames = { "Librarian", "Customer" };
    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}
