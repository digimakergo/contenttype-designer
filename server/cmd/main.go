package main

import (
	"log"
	"net/http"

	contentmodelhandler "server/contentmodelhandler"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	//router
	router := mux.NewRouter()
	router.HandleFunc("/api/contentmodelhandler/{entity}/", contentmodelhandler.UpdateContentmodel).Methods("POST")
	router.HandleFunc("/api/contentmodelhandler/", contentmodelhandler.UpdateContentmodelNoTypeChosen).Methods("POST")
	router.HandleFunc("/api/contentmodelhandler/", contentmodelhandler.GetContentModel).Methods("GET")

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"POST"})
	//ttl := handlers.MaxAge(3600)
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Fatal(http.ListenAndServe(":9200", handlers.CORS(credentials, methods, origins)(router)))

}
