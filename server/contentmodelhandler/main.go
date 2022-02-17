package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Contenttype struct {
	identifier struct {
		Name        string  `json:"name"`
		TableName   string  `json:"table_name"`
		HasVersion  bool    `json:"has_version"`
		HasLocation bool    `json:"has_location"`
		Fields      []Field `json:"fields"`
		NamePattern string  `json:"name_pattern"`
	}
}

type Field struct {
	Identifier string `json:"identifier"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	Required   bool   `json:"required"`
	Parameters *struct {
		MaxLength   int    `json:"max_length,omitempty"`
		IsMultiLine *bool  `json:"is_multi_line,omitempty"`
		Mode        string `json:"mode,omitempty"`
		Options     *bool  `json:"options,omitempty"`
		MaxSize     int    `json:"max_size,omitempty"`
		Format      string `json:"format,omitempty"`
		Dateonly    *bool  `json:"dateonly,omitempty"`
	} `json:"parameters,omitempty"`
	Children []Field `json:"children,omitempty"`
}

type Message struct {
	Type     string `json: "type"`
	Response string `json:"response"`
}
type MessageError struct {
	Type     string `json:"type"`
	Response string `json:"response"`
	From     string `json:"from"`
	Field    string `json:"field"`
}
type MessageC struct {
	Response []Contenttype `json:"response"`
}
type MessageF struct {
	Response []Field `json:"response"`
}
type MessageI struct {
	Response map[string]interface{} `json:"response"`
}

func validation(fields []Field) []MessageError {
	var errors []MessageError
	regex := "[A-ZøæåØÆÅ\\s\\d\\W]"
	for _, elem := range fields {

		//common validation
		match, _ := regexp.MatchString(regex, elem.Identifier)
		if match == true {
			m := MessageError{Type: "Error", Response: "Identifier does not have a valid value", From: elem.Identifier, Field: "identifier"}
			errors = append(errors, m)
		}
		if len(elem.Name) == 0 {
			m := MessageError{Type: "Error", Response: "Name does not have a valid value", From: elem.Identifier, Field: "name"}
			errors = append(errors, m)
		}
		if len(elem.Type) == 0 {
			m := MessageError{Type: "Error", Response: "Type does not have a valid value", From: elem.Identifier, Field: "type"}
			errors = append(errors, m)
		}

		//type validation
		if elem.Type == "text" {

			if elem.Parameters.MaxLength <= 0 {
				m := MessageError{Type: "Error", Response: "Max length field does not have a valid value", From: elem.Identifier, Field: "max_length"}
				errors = append(errors, m)
			}
			if elem.Parameters.IsMultiLine == nil {
				m := MessageError{Type: "Error", Response: "Type does not have a valid value", From: elem.Identifier, Field: "is_multi_line"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "richtext" {
			if len(elem.Parameters.Mode) == 0 {
				m := MessageError{Type: "Error", Response: "Mode does not have a value selected", From: elem.Identifier, Field: "mode"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "radio" {
			if elem.Parameters.Options == nil {
				m := MessageError{Type: "Error", Response: "Parameter does not have a valid value", From: elem.Identifier, Field: "options"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "file" {
			if elem.Parameters.MaxSize <= 0 {
				m := MessageError{Type: "Error", Response: "Max size field does not have a valid value", From: elem.Identifier, Field: "max_size"}
				errors = append(errors, m)
			}
			if len(elem.Parameters.Format) == 0 {
				m := MessageError{Type: "Error", Response: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "image" {
			if len(elem.Parameters.Format) == 0 {
				m := MessageError{Type: "Error", Response: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "datetime" {
			if elem.Parameters.Dateonly == nil {
				m := MessageError{Type: "Error", Response: "Parameter does not have a valid value", From: elem.Identifier, Field: "dateonly"}
				errors = append(errors, m)
			}
		}
		if elem.Type == "container" {
			temp := validation(elem.Children)
			for _, err := range temp {
				errors = append(errors, err)
			}
		}

	}
	return errors
}

func test(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var fields []Field

	error := json.NewDecoder(router.Body).Decode(&fields)
	if error != nil {
		m2 := Message{Type: "Error", Response: "Unable to load request body"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	errors := validation(fields)
	if len(errors) > 0 {
		json.NewEncoder(w).Encode(errors)
		return
	}
	m := MessageF{Response: fields}
	json.NewEncoder(w).Encode(m)

	var contenttype map[string]interface{}
	file, error := os.Open("../contenttype.json")
	if error != nil {
		m2 := Message{Type: "Error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		m2 := Message{Type: "Error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &contenttype)
	if error2 != nil {
		m2 := Message{Type: "Error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error2)
		return
	}

	//m3 := MessageI{Response: contenttype}
	//json.NewEncoder(w).Encode(m3)
	//fmt.Println(contenttype["article"])
}

func main() {
	//router
	router := mux.NewRouter()
	router.HandleFunc("/test", test).Methods("POST")

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"POST"})
	//ttl := handlers.MaxAge(3600)
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Fatal(http.ListenAndServe(":9200", handlers.CORS(credentials, methods, origins)(router)))

}
