package main

import (
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
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

	DateRange dateRange `json:"dateRange"`
}

type dateRange struct {
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func main() {
	router := gin.Default()
	router.GET("/mapMarker/all", getAllMapMarkers)

	router.Run("localhost:8080")
}

func getAllMapMarkers(c *gin.Context) {
	dateRange := dateRange{
		EndDate:   time.Now().Add(time.Hour * 72),
		StartDate: time.Now(),
	}

	exampleMarker := mapMarker{
		ID:               "1",
		SimpleMapsCityId: "1",
		CityName:         "Baltimore",
		DateRange:        dateRange,
	}

	c.IndentedJSON(http.StatusOK, exampleMarker)
}
