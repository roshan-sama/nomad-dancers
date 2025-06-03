package main

import (
	"fmt"
	"time"

	"net/http"

	"log"
	"os"

	"database/sql"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	ng "roshan.page/names-generator"
)

/*
Map Marker is only data this app persists, and represents the duration and location of a nomad dancer's stay.

This app will do one thing, and do it will. We'll add users, authentication and a whole lot else if this app actually gains traction
*/
type mapMarker struct {
	ID string `json:"id"`
	/* asdad*/
	AnonymizedCreatorName string `json:"anonymizedCreatorName"`
	SimpleMapsCityId      string `json:"simpleMapsCityId"`
	CityName              string `json:"cityName"`

	// DateRange dateRange `json:"dateRange"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type dateRange struct {
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func main() {
	db, err := sql.Open("sqlite3", "./mapMarkers.db")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	initializeDb(db)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		// Only needs to support one origin at this time
		AllowOrigins: []string{os.Getenv("CORS_ALLOW_ORIGIN")},
		AllowMethods: []string{"PUT", "POST", "PATCH", "GET", "OPTIONS", "DELETE"},
		AllowHeaders: []string{"*"},
		MaxAge:       12 * time.Hour,
	}))

	router.GET("/mapMarker/all", func(c *gin.Context) {
		getAllMapMarkers(c, db)
	})

	router.POST("/mapMarker", func(c *gin.Context) {
		var marker mapMarker
		if err := c.ShouldBindJSON(&marker); err != nil {
			c.IndentedJSON(http.StatusBadRequest, "Invalid JSON")
			return
		}
		addMapMarker(c, db, &marker)
	})

	router.DELETE("/mapMarker", func(c *gin.Context) {
		markerId := c.Query("markerId")
		if markerId == "" {
			c.IndentedJSON(http.StatusBadRequest, "markerId query parameter is required")
			return
		}
		deleteMapMarker(c, db, markerId)
	})

	router.Run("localhost:8080")
}

func getAllMapMarkers(c *gin.Context, db *sql.DB) {
	// TODO: Specify the actual row names so that row.Scan is in the correct order
	sqlStmt := `SELECT * FROM mapMarker;`

	rows, err := db.Query(sqlStmt)

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, "Database error - failed to get all map markers")
		return
	}
	defer rows.Close()

	var markers []mapMarker
	for rows.Next() {
		var marker mapMarker
		var startDateStr, endDateStr string

		err := rows.Scan(&marker.ID, &marker.SimpleMapsCityId, &marker.CityName, &startDateStr, &endDateStr, &marker.AnonymizedCreatorName)
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, "Error scanning row")
			return
		}

		// Parse the date strings
		marker.StartDate, err = time.Parse(time.RFC3339, startDateStr)
		if err != nil {
			log.Printf("Error parsing StartDate: %v", err)
			c.IndentedJSON(http.StatusInternalServerError, "Error parsing date")
			return
		}

		marker.EndDate, err = time.Parse(time.RFC3339, endDateStr)
		if err != nil {
			log.Printf("Error parsing EndDate: %v", err)
			c.IndentedJSON(http.StatusInternalServerError, "Error parsing date")
			return
		}

		markers = append(markers, marker)
	}

	c.IndentedJSON(http.StatusOK, markers)
}

func addMapMarker(c *gin.Context, db *sql.DB, marker *mapMarker) {
	sqlStmt := `
		INSERT INTO mapMarker (SimpleMapsCityId, CityName, StartDate, EndDate, AnonymizedCreatorName)
		VALUES (?, ?, ?, ?, ?);
	`

	startDateStr := marker.StartDate.Format(time.RFC3339)
	endDateStr := marker.EndDate.Format(time.RFC3339)
	anonymizedName := getValidName()

	result, err := db.Exec(sqlStmt, marker.SimpleMapsCityId, marker.CityName, startDateStr, endDateStr, anonymizedName)

	if err != nil {
		log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "Failed to create marker")
		return
	}

	// Get the ID of the newly created marker
	id, err := result.LastInsertId()
	if err != nil {
		log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "Failed to get created marker ID")
		return
	}

	createdMarker := mapMarker{
		ID:                    fmt.Sprintf("%d", id),
		SimpleMapsCityId:      marker.SimpleMapsCityId,
		CityName:              marker.CityName,
		StartDate:             marker.StartDate,
		EndDate:               marker.EndDate,
		AnonymizedCreatorName: anonymizedName,
	}

	c.IndentedJSON(http.StatusCreated, createdMarker)
}

func deleteMapMarker(c *gin.Context, db *sql.DB, markerId string) {
	sqlStmt := `DELETE FROM mapMarker WHERE ID = ?;`

	result, err := db.Exec(sqlStmt, markerId)
	if err != nil {
		log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "Failed to delete marker")
		return
	}

	// Check if any rows were affected (i.e., if the marker existed)
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Print(err)
		c.IndentedJSON(http.StatusInternalServerError, "Failed to verify deletion")
		return
	}

	if rowsAffected == 0 {
		c.IndentedJSON(http.StatusNotFound, "Marker not found")
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Marker deleted successfully"})
}

func getValidName() string {
	// TODO: Ensure no duplicates by querying database for possible
	// duplicate. Since users will be contacting each other, any confusion regarding
	// duplicates will be resolved quickly via chat on the sister app
	return ng.GetRandomName(0)
}

/*
TODO: Remove this and manage the database through a more robust database version control system if we have users
*/
func initializeDb(db *sql.DB) {
	sqlStmt := `
    CREATE TABLE IF NOT EXISTS mapMarker (
        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        SimpleMapsCityId TEXT,
		CityName TEXT,
		StartDate TEXT,
		EndDate TEXT,
		AnonymizedCreatorName TEXT
    );`

	_, err := db.Exec(sqlStmt)
	if err != nil {
		log.Fatal(err)
	}

	// startDate := time.Now().Format(time.RFC3339)
	// // Example end date, dance festivals are usually 3-4 days long
	// endDate := time.Now().Add(time.Hour * 72).Format(time.RFC3339)

	// sqlStmt = `
	//     INSERT INTO mapMarker (SimpleMapsCityId, CityName, StartDate, EndDate, AnonymizedCreatorName)
	//     VALUES (?, ?, ?, ?, ?);`

	// // NOTE: USE PARAMTERIZED QUERIES FOR ANY FIELD A USER CAN SPECIFY
	// //sqlStmt := `INSERT INTO mapMarker (SimpleMapsCityId, CityName) VALUES (?, ?)`
	// // _, err := db.Exec(sqlStmt, userInput.SimpleMapsCityId, userInput.CityName)
	// // This prevents Sql injection
	// _, err = db.Exec(sqlStmt, "1", "Baltimore", startDate, endDate, getValidName())
	// if err != nil {
	// 	log.Fatal(err)
	// }
}
