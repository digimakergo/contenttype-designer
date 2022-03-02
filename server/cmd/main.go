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
	Name        string  `json:"name"`
	TableName   string  `json:"table_name"`
	HasVersion  *bool   `json:"has_version"`
	HasLocation *bool   `json:"has_location"`
	Fields      []Field `json:"fields"`
	NamePattern string  `json:"name_pattern"`
}

type Parameters struct {
	MaxLength   int    `json:"max_length,omitempty"`
	IsMultiLine *bool  `json:"is_multi_line,omitempty"`
	Mode        string `json:"mode,omitempty"`
	Options     *bool  `json:"options,omitempty"`
	MaxSize     int    `json:"max_size,omitempty"`
	Format      string `json:"format,omitempty"`
	Dateonly    *bool  `json:"dateonly,omitempty"`
}

type Field struct {
	Identifier string      `json:"identifier"`
	Name       string      `json:"name"`
	Type       string      `json:"type"`
	Required   bool        `json:"required"`
	Parameters *Parameters `json:"parameters,omitempty"`
	Children   []Field     `json:"children,omitempty"`
}

func (field *Field) setName(newName string) {
	field.Name = newName
}
func (field *Field) setType(newType string) {
	field.Type = newType
}
func (field *Field) setRequired(newRequired bool) {
	field.Required = newRequired
}

func (field *Field) setParameters(newParameters *Parameters) {
	field.Parameters = newParameters
}
func (field *Field) setChildren(newFields []Field) {
	field.Children = newFields
}

type Response struct {
	Type     string `json: "type"`
	Response string `json:"response"`
}
type MessageError struct {
	Type     string           `json:"type"`
	Response *[]ErrorResponse `json:"response,omitempty"`
}
type ErrorResponse struct {
	Message string `json:"message"`
	From    string `json:"from"`
	Field   string `json:"field"`
}

type MessageI struct {
	Response interface{} `json:"response"`
}

func validation(fields []Field) []ErrorResponse {
	var messages []ErrorResponse
	regex := "[A-ZøæåØÆÅ\\s\\d\\W]" // make validation for special characters for name and type (regex)
	for _, elem := range fields {

		//common validation
		match, _ := regexp.MatchString(regex, elem.Identifier)
		if match == true {
			m := ErrorResponse{Message: "Identifier does not have a valid value", From: elem.Identifier, Field: "identifier"}
			messages = append(messages, m)
		}
		if len(elem.Name) == 0 {
			m := ErrorResponse{Message: "Name does not have a valid value", From: elem.Identifier, Field: "name"}
			messages = append(messages, m)
		}
		if len(elem.Type) == 0 {
			m := ErrorResponse{Message: "Type does not have a valid value", From: elem.Identifier, Field: "type"}
			messages = append(messages, m)
		}

		//type validation
		if elem.Type == "text" {

			if elem.Parameters.MaxLength <= 0 {
				m := ErrorResponse{Message: "Max length field does not have a valid value", From: elem.Identifier, Field: "max_length"}
				messages = append(messages, m)
			}
			if elem.Parameters.IsMultiLine == nil {
				m := ErrorResponse{Message: "Type does not have a valid value", From: elem.Identifier, Field: "is_multi_line"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "richtext" {
			if len(elem.Parameters.Mode) == 0 {
				m := ErrorResponse{Message: "Mode does not have a value selected", From: elem.Identifier, Field: "mode"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "radio" {
			if elem.Parameters.Options == nil {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "options"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "file" {
			if elem.Parameters.MaxSize <= 0 {
				m := ErrorResponse{Message: "Max size field does not have a valid value", From: elem.Identifier, Field: "max_size"}
				messages = append(messages, m)
			}
			if len(elem.Parameters.Format) == 0 {
				m := ErrorResponse{Message: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "image" {
			if len(elem.Parameters.Format) == 0 {
				m := ErrorResponse{Message: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "datetime" {
			if elem.Parameters.Dateonly == nil {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "dateonly"}
				messages = append(messages, m)
			}
		}
		if elem.Type == "container" {
			temp := validation(elem.Children)
			for _, err := range temp {
				messages = append(messages, err)
			}
		}

	}

	return messages
}

func input(fieldFile []Field, fieldsInput []Field) []Field {

	for _, inpField := range fieldsInput {
		exist := false
		for i, field := range fieldFile {
			if field.Identifier == inpField.Identifier {
				exist = true

				fieldFile[i].setName(inpField.Name)
				//con.Fields[i].setType(inpField.Type)
				fieldFile[i].setRequired(inpField.Required)
				if fieldFile[i].Type != "container" && inpField.Type != "container" {
					fieldFile[i].setParameters(inpField.Parameters)
				} else if fieldFile[i].Type == "container" && inpField.Type == "container" {
					fieldFile[i].Children = input(fieldFile[i].Children, inpField.Children)
				}
				break
			}
		}
		if exist == false {
			fieldFile = append(fieldFile, inpField)
		}

	}
	return fieldFile
}
func test(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var fields []Field

	contenttype := mux.Vars(router)["entity"]
	if contenttype == "" {
		m2 := Response{Type: "error", Response: "Please choose a entity name"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	error := json.NewDecoder(router.Body).Decode(&fields)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	errors := validation(fields)
	if len(errors) > 0 {
		message := MessageError{Type: "error", Response: &errors}
		json.NewEncoder(w).Encode(message)
		return
	}
	//m := MessageF{Response: fields}
	//json.NewEncoder(w).Encode(m)

	contentmodel := make(map[string]interface{})
	file, error := os.Open("./configs/contenttype.json")
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &contentmodel)
	if error2 != nil {
		m2 := Response{Type: "error", Response: "Unable to byte contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}
	data, error3 := json.Marshal(contentmodel[contenttype])
	if error3 != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	var con Contenttype
	error2 = json.Unmarshal([]byte(data), &con)

	if error2 != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json into a variable"}
		json.NewEncoder(w).Encode(m2)
		return
	}
	/*for _, inpField := range fields {
		exist := false
		for i, field := range con.Fields {
			if field.Identifier == inpField.Identifier {
				exist = true

				con.Fields[i].setName(inpField.Name)
				//con.Fields[i].setType(inpField.Type)
				con.Fields[i].setRequired(inpField.Required)
				if con.Fields[i].Type != "container" {
					con.Fields[i].setParameters(inpField.Parameters)
				}else{

				}
				break
			}
		}
		if exist == false {
			con.Fields = append(con.Fields, inpField)
		}
	}*/
	con.Fields = fields //input(con.Fields, fields)
	contentmodel[contenttype] = con

	//m3 := MessageI{Response: contentmodel}
	//json.NewEncoder(w).Encode(m3)

	data, _ = json.MarshalIndent(contentmodel, "", " ")
	error = ioutil.WriteFile("./configs/contenttype.temp.json", data, 0664) //should this stay

	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.temp.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	m := Response{Type: "Success", Response: "Successfully saved the new contenttype"}
	json.NewEncoder(w).Encode(m)

}

func testerr(w http.ResponseWriter, router *http.Request) {
	m2 := Response{Type: "error", Response: "Please choose a entity name"}
	json.NewEncoder(w).Encode(m2)
	return
}

func GetContentModel(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contentmodel := make(map[string]interface{})
	file, error := os.Open("./configs/contenttype.json")
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &contentmodel)
	if error2 != nil {
		m2 := Response{Type: "error", Response: "Unable to byte contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}
	m := MessageI{Response: contentmodel}
	json.NewEncoder(w).Encode(m)
}

func main() {
	//router
	router := mux.NewRouter()
	router.HandleFunc("/api/contentmodelhandler/{entity}/", test).Methods("POST")
	router.HandleFunc("/api/contentmodelhandler/", testerr).Methods("POST")
	router.HandleFunc("/api/contentmodelhandler/", GetContentModel).Methods("GET")

	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"POST"})
	//ttl := handlers.MaxAge(3600)
	origins := handlers.AllowedOrigins([]string{"*"})

	log.Fatal(http.ListenAndServe(":9200", handlers.CORS(credentials, methods, origins)(router)))

}
