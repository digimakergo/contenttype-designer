package controller

import (
	"encoding/json"
	"net/http"

	"github.com/digimakergo/digimaker/rest"
	"github.com/gorilla/mux"

	//_ "dmdemo/pkg/controller/deployment" // bruker bare init metoden for å åpne entity0.so
	"github.com/digimakergo/digimaker/core/definition"
)

func UpdateContenttypeFields(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var fields []Field
	contenttype := mux.Vars(router)["entity"]
	if contenttype == "" {
		m2 := Response{Type: "error", Response: "Please choose a entity name"}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(m2)
		return
	}

	error := json.NewDecoder(router.Body).Decode(&fields)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(m2)
		return
	}

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	response := UpdateContenttypeFieldMethod(contentmodel, contenttype, fields)
	if response.Type == "error" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	if !WriteToFile(contentmodel, "./configs/contenttype.json") {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition()
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func GetContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttype := mux.Vars(router)["entity"]

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	if contentmodel[contenttype] == nil {
		m2 := Response{Type: "error", Response: "'" + contenttype + "' doesn't exist"}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(m2)
		return
	}
	m := Response{Type: "Success", Response: contentmodel[contenttype]}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(m)
}

func GetContentmodel(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	m := Response{Type: "Success", Response: contentmodel}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(m)
}

func RemoveContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttype := mux.Vars(router)["entity"]

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	response := RemoveContenttypeMethod(contentmodel, contenttype)
	if response.Type == "error" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	if !WriteToFile(contentmodel, "./configs/contenttype.json") {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition()
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func CreateContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttypeStr := mux.Vars(router)["entity"]
	var contenttype Contenttype
	error := json.NewDecoder(router.Body).Decode(&contenttype)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(m2)
		return
	}

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	data := CreateContenttypeMethod(contentmodel, contenttype, contenttypeStr)
	if data.Type != "Success" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(data)
		return
	}
	//save contentmodel
	if !WriteToFile(contentmodel, "./configs/contenttype.json") {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition()
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(data)
}

func UpdateContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttypeStr := mux.Vars(router)["entity"]
	var contenttype ContenttypeUpdate
	error := json.NewDecoder(router.Body).Decode(&contenttype)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(m2)
		return
	}

	contentmodel := GetFile("./configs/contenttype.json")
	if contentmodel == nil {
		m2 := Response{Type: "error", Response: "Unable to load contentmodel"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	response := UpdateContenttypeMethod(contentmodel, contenttype, contenttypeStr)
	if response.Type == "error" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(response)
		return
	}

	//save contentmodel
	if !WriteToFile(contentmodel, "./configs/contenttype.json") {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition()
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)

}

func GetFieldTypes(w http.ResponseWriter, router *http.Request) {
	fieldtypes := GetFile("./configs/FieldTypeDefinition.json")
	if fieldtypes == nil {
		m2 := Response{Type: "error", Response: "Unable to load FieldTypeDefinition"}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(m2)
		return
	}

	m := Response{Type: "Success", Response: fieldtypes}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(m)
}

func init() {
	rest.RegisterRoute("/contentmodel/{entity}/", GetContenttype, "GET")
	rest.RegisterRoute("/contentmodel/fields/{entity}/", UpdateContenttypeFields, "PUT")
	rest.RegisterRoute("/contentmodel/{entity}/", RemoveContenttype, "DELETE")
	rest.RegisterRoute("/contentmodel/{entity}/", CreateContenttype, "POST")
	rest.RegisterRoute("/contentmodel/", GetContentmodel, "GET")
	rest.RegisterRoute("/contentmodel/{entity}/", UpdateContenttype, "PUT")
	rest.RegisterRoute("/contenttype/fieldtypes/", GetFieldTypes, "GET")
}
