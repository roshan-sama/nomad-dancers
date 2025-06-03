package main

import (
	"time"

	"net/http"

	"log"

	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	ng "roshan.page/names-generator"
)

// Do one thing, and do it will.
// We'll add users, authentication and a whole lot else
// if this app actually gains traction
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
	router.GET("/mapMarker/all", func(c *gin.Context) {
		getAllMapMarkers(c, db)
	})

	router.Run("localhost:8080")
}

func getAllMapMarkers(c *gin.Context, db *sql.DB) {
	// TODO: Specify the actual row names so that row.Scan is in the correct order
	sqlStmt := `SELECT * FROM mapMarkers;`

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

func getValidName() string {
	// TODO: Ensure no duplicates by querying database for possible
	// duplicate. Since users will be contacting each other, any confusion regarding
	// duplicates will be resolved quickly via chat on the sister app
	return ng.GetRandomName(0)
}

/*
	TODO: Remove this and manage the database through

a more robust database version control system if we
have users
*/
func initializeDb(db *sql.DB) {
	sqlStmt := `
    CREATE TABLE IF NOT EXISTS mapMarkers (
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

	startDate := time.Now().Format(time.RFC3339)
	// Example end date, dance festivals are usually 3-4 days long
	endDate := time.Now().Add(time.Hour * 72).Format(time.RFC3339)

	sqlStmt = `
        INSERT INTO mapMarkers (SimpleMapsCityId, CityName, StartDate, EndDate, AnonymizedCreatorName)
        VALUES (?, ?, ?, ?, ?);`

	// NOTE: USE PARAMTERIZED QUERIES FOR ANY FIELD A USER CAN SPECIFY
	//sqlStmt := `INSERT INTO mapMarkers (SimpleMapsCityId, CityName) VALUES (?, ?)`
	// _, err := db.Exec(sqlStmt, userInput.SimpleMapsCityId, userInput.CityName)
	// This prevents Sql injection
	_, err = db.Exec(sqlStmt, "1", "Baltimore", startDate, endDate, getValidName())
	if err != nil {
		log.Fatal(err)
	}
}
