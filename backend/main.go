package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ============================================
// MODELS (GORM Structs)
// ============================================

// Project represents a portfolio project entry.
type Project struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	TechStack   string    `json:"tech_stack"`
	ImageURL    string    `json:"image_url"`
	ProjectURL  string    `json:"project_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Certificate represents a certification/credential entry.
type Certificate struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name"`
	Issuer        string    `json:"issuer"`
	DateEarned    string    `json:"date_earned"`
	ImageURL      string    `json:"image_url"`
	CredentialURL string    `json:"credential_url"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// (Removed BlogPost struct)

// ContactMessage represents a contact form submission.
type ContactMessage struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Subject   string    `json:"subject"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

// LoginRequest represents login credentials.
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// ============================================
// GLOBAL DATABASE INSTANCE
// ============================================

var db *gorm.DB

// ============================================
// MAIN
// ============================================

func main() {
	// --- Database Setup ---
	var err error

	// Sesuaikan konfigurasi ini dengan database PostgreSQL Anda!
	// host = localhost (atau server database Anda)
	// user = username postgres Anda (biasanya postgres)
	// password = password postgres Anda
	// dbname = nama database yang sudah Anda buat
	// port = port postgres (biasanya 5432)
	dsn := "host=localhost user=postgres password=December271205 dbname=portofolio_db port=5432 sslmode=disable TimeZone=Asia/Jakarta"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database. Pastikan PostgreSQL sedang berjalan dan konfigurasinya benar. Error:", err)
	}
	log.Println("✅ Database PostgreSQL connected successfully")

	// Auto-migrate tables
	if err := db.AutoMigrate(&Project{}, &Certificate{}, &ContactMessage{}); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	log.Println("✅ Database migrated")

	// (Seed data logic removed so deleted items stay deleted)

	// --- Gin Router Setup ---
	r := gin.Default()

	// CORS middleware — allow frontend to access API
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// --- API Routes ---
	api := r.Group("/api")
	{
		// GET endpoints
		api.GET("/projects", getProjects)
		api.GET("/certificates", getCertificates)

		// POST endpoints
		api.POST("/contact", submitContact)
		api.POST("/login", loginAdmin)

		// Protected Routes (Require Login)
		protected := api.Group("/")
		protected.Use(authMiddleware())
		{
			// CRUD — Projects
			protected.POST("/projects", createProject)
			protected.PUT("/projects/:id", updateProject)
			protected.DELETE("/projects/:id", deleteProject)

			// CRUD — Certificates
			protected.POST("/certificates", createCertificate)
			protected.PUT("/certificates/:id", updateCertificate)
			protected.DELETE("/certificates/:id", deleteCertificate)
		}
	}

	// --- Serve Frontend Static Files ---
	r.Static("/assets", "../frontend-react/dist/assets")
	r.StaticFile("/", "../frontend-react/dist/index.html")
	r.StaticFile("/index.html", "../frontend-react/dist/index.html")

	// --- Start Server ---
	log.Println("🚀 Server running at http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token != "Bearer admin-secret-token" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized. Please login."})
			c.Abort()
			return
		}
		c.Next()
	}
}

// ============================================
// API HANDLERS — GET (Read)
// ============================================

// getProjects handles GET /api/projects
func getProjects(c *gin.Context) {
	var projects []Project
	result := db.Order("created_at desc").Find(&projects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	c.JSON(http.StatusOK, projects)
}

// getCertificates handles GET /api/certificates
func getCertificates(c *gin.Context) {
	var certificates []Certificate
	result := db.Order("created_at desc").Find(&certificates)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch certificates"})
		return
	}
	c.JSON(http.StatusOK, certificates)
}

// ============================================
// API HANDLERS — POST (Create)
// ============================================

// loginAdmin handles POST /api/login
func loginAdmin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Hardcoded credentials
	if req.Username == "Calvin3c" && req.Password == "December271205" {
		c.JSON(http.StatusOK, gin.H{"token": "admin-secret-token"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
	}
}

// submitContact handles POST /api/contact
func submitContact(c *gin.Context) {
	var msg ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	if result := db.Create(&msg); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Message sent successfully!"})
}

// createProject handles POST /api/projects
func createProject(c *gin.Context) {
	var project Project
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	if result := db.Create(&project); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}
	c.JSON(http.StatusCreated, project)
}

// createCertificate handles POST /api/certificates
func createCertificate(c *gin.Context) {
	var cert Certificate
	if err := c.ShouldBindJSON(&cert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	if result := db.Create(&cert); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create certificate"})
		return
	}
	c.JSON(http.StatusCreated, cert)
}

// ============================================
// API HANDLERS — PUT (Update)
// ============================================

// updateProject handles PUT /api/projects/:id
func updateProject(c *gin.Context) {
	id := c.Param("id")
	var project Project
	if err := db.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	db.Save(&project)
	c.JSON(http.StatusOK, project)
}

// updateCertificate handles PUT /api/certificates/:id
func updateCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert Certificate
	if err := db.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}
	if err := c.ShouldBindJSON(&cert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}
	db.Save(&cert)
	c.JSON(http.StatusOK, cert)
}

// ============================================
// API HANDLERS — DELETE
// ============================================

// deleteProject handles DELETE /api/projects/:id
func deleteProject(c *gin.Context) {
	id := c.Param("id")
	if result := db.Delete(&Project{}, id); result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

// deleteCertificate handles DELETE /api/certificates/:id
func deleteCertificate(c *gin.Context) {
	id := c.Param("id")
	if result := db.Delete(&Certificate{}, id); result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Certificate not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Certificate deleted successfully"})
}
