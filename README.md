# Library Management Project

This is a full-stack web application for managing a library system. The project consists of a backend API built with .NET Core and a React frontend application, both of which allow users to manage books, authors, and customers.

## Features

- **Librarian Role**: Manage books, customers, and checkouts.
- **Customer Role**: View available books, checkout history, and reserve books.
- **Authentication**: Secure login and role-based access control using ASP.NET Identity.
- **Database**: SQL Server for storing book, customer, and transaction data.
- **Frontend**: A modern React frontend application for interacting with the library.

## Technologies Used

- **Backend**: 
  - .NET Core Web API using .NET 8
  - ASP.NET Identity for user management
  - Entity Framework Core for database access
  - SQL Server for database management
  - (Bonus) Configured Swagger UI / OpenAPI documentation for the API
  - (Bonus) xUnit tests for API
  - (Bonus) Database seeded with fake book date using Bogus for .Net
  
- **Frontend**: 
  - ReactJS for building the user interface
  - Axios for making HTTP requests to the backend
  - (Bonus) MUI component library

## Prerequisites

- [.NET Core SDK](https://dotnet.microsoft.com/download) installed on your machine
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) for frontend
- [Docker](https://www.docker.com/) (optional, for running with containers)
- SQL Server

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tawhidkhn63/library-management-project.git
cd library-management-project
```

### 2. Setting Up the Backend

Navigate to the LibraryManagementAPI folder:
```bash
cd LibraryManagementAPI
```

Update appsettings.json with your SQL Server connection string and password:
```json
"ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=LibraryDb;User Id=sa;Password=YourPassword;Encrypt=False;"
}
```

Run SQL server container on Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e 'SA_PASSWORD=YourPassword' \
--platform linux/amd64 \
-p 1433:1433 --name sqlserver \
-d mcr.microsoft.com/mssql/server:2022-latest

docker start sqlserver
```


Run migrations and update the database:

```bash
dotnet ef database update
```

Start the API:
```bash
dotnet run
```

### 3. Setting Up the Frontend
Navigate to the library-management-frontend folder:
```bash
cd ../library-management-frontend
```

Install dependencies:
```bash
npm install
```

Start the development server on Port 3001 
```bash
PORT=3001 npm start
```

If using another port then change frontend port number for CORS config in
LibraryManagementAPI/Program.cs

```csharp
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
```

### 4. Running the Application

The backend API should be running on http://localhost:5260 (or the configured port).

The frontend application will run on http://localhost:3001 (or the configured port).




