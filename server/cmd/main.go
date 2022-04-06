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

	router.HandleFunc("/api/contentmodel/{entity}/", contentmodelhandler.GetContenttype).Methods("GET")
	router.HandleFunc("/api/contentmodel/{entity}/", contentmodelhandler.UpdateContenttypeFields).Methods("PUT")
	router.HandleFunc("/api/contentmodel/{entity}/", contentmodelhandler.RemoveContenttype).Methods("DELETE")
	router.HandleFunc("/api/contentmodel/{entity}/", contentmodelhandler.CreateContenttype).Methods("POST")
	router.HandleFunc("/api/contenttypes/", contentmodelhandler.GetContenttypes).Methods("GET")
	router.HandleFunc("/api/contentmodel/", contentmodelhandler.GetContentmodel).Methods("GET")
	router.HandleFunc("/api/contenttypes/{entity}/", contentmodelhandler.UpdateContenttype).Methods("PUT")

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	//ttl := handlers.MaxAge(3600)
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Fatal(http.ListenAndServe(":9200", handlers.CORS(credentials, methods, origins)(router)))

}
