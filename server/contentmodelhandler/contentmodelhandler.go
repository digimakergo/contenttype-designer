package controller

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"

	//_ "dmdemo/pkg/controller/deployment" // bruker bare init metoden for å åpne entity0.so

	"github.com/digimakergo/digimaker/core/definition"
	"github.com/digimakergo/digimaker/rest"
	"github.com/gorilla/mux"
)

type Contenttype struct {
	Name          string  `json:"name"`
	TableName     string  `json:"table_name"`
	HasVersion    bool    `json:"has_version"`
	HasLocation   bool    `json:"has_location"`
	HasLocationId bool    `json:"has_location_id"`
	Fields        []Field `json:"fields"`
	NamePattern   string  `json:"name_pattern"`
}

type ContenttypeUpdate struct {
	Identifier    string  `json:"identifier,omitempty"`
	Name          string  `json:"name"`
	TableName     string  `json:"table_name"`
	HasVersion    bool    `json:"has_version"`
	HasLocation   bool    `json:"has_location"`
	HasLocationId bool    `json:"has_location_id"`
	Fields        []Field `json:"fields"`
	NamePattern   string  `json:"name_pattern"`
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
	Type     string `json:"type"`
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
	Type     string      `json:"type"`
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
		if elem.Identifier == "" {
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

func UpdateContenttypeFields(w http.ResponseWriter, router *http.Request) {
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

	if contentmodel[contenttype] == nil {
		m2 := Response{Type: "error", Response: "Contenttype '" + contenttype + "' doesn't exist"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	errors := validation(fields)

	if len(errors) > 0 {
		message := MessageError{Type: "error", Response: &errors}
		json.NewEncoder(w).Encode(message)
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

	con.Fields = fields
	contentmodel[contenttype] = con

	data, _ = json.MarshalIndent(contentmodel, "", " ")
	error = ioutil.WriteFile("./configs/contenttype.json", data, 0770) //should this stay

	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition() //deployment.GenerateEntities()
	m := Response{Type: "Success", Response: "Successfully updated the fields of '" + contenttype + "'"}
	json.NewEncoder(w).Encode(m)

}

func GetContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttype := mux.Vars(router)["entity"]
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

	if contentmodel[contenttype] == nil {
		m2 := Response{Type: "error", Response: "'" + contenttype + "' doesn't exist"}
		json.NewEncoder(w).Encode(m2)
		return
	}
	m := MessageI{Type: "Success", Response: contentmodel[contenttype]}
	json.NewEncoder(w).Encode(m)
}

/*func GetContenttypes(w http.ResponseWriter, router *http.Request) {
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

	var contenttypes []string
	for key, _ := range contentmodel {
		contenttypes = append(contenttypes, key)
	}
	m := MessageI{Type: "Success", Response: contenttypes}
	json.NewEncoder(w).Encode(m)
}*/

func GetContentmodel(w http.ResponseWriter, router *http.Request) {
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
	/*var contenttypes []ContenttypeFocus
	for key, value := range contentmodel {

		data, error3 := json.Marshal(value)
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
		c := ContenttypeFocus{Identifier: key, Name: con.Name, TableName: con.TableName, HasVersion: con.HasVersion, HasLocation: con.HasLocation, HasLocationId: con.HasLocationId, Fields: con.Fields, NamePattern: con.NamePattern}
		contenttypes = append(contenttypes, c)
	}*/

	m := MessageI{Type: "Success", Response: contentmodel}
	json.NewEncoder(w).Encode(m)
}

func RemoveContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttype := mux.Vars(router)["entity"]
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
	if contentmodel[contenttype] == nil {
		m2 := Response{Type: "error", Response: "Contenttype '" + contenttype + "' doesn't exist"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	delete(contentmodel, contenttype)

	data, _ = json.MarshalIndent(contentmodel, "", " ")
	error = ioutil.WriteFile("./configs/contenttype.json", data, 0770) //should this stay

	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition() //deployment.GenerateEntities()

	m := MessageI{Type: "Success", Response: "Successfully removed '" + contenttype + "'"}
	json.NewEncoder(w).Encode(m)
}

func CreateContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttypeStr := mux.Vars(router)["entity"]
	var contenttype Contenttype
	error := json.NewDecoder(router.Body).Decode(&contenttype)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		json.NewEncoder(w).Encode(m2)
		return
	}

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

	if contentmodel[contenttypeStr] != nil {
		m2 := Response{Type: "error", Response: "Contenttype '" + contenttypeStr + "' already exist."}
		json.NewEncoder(w).Encode(m2)
		return
	}

	//validate
	match, _ := regexp.MatchString("[A-ZøæåØÆÅ\\s\\d\\W]", contenttypeStr)
	var messages []ErrorResponse
	if contenttypeStr != "" || match == true {
		m := ErrorResponse{Message: "Identifier does not have a valid value", From: contenttypeStr, Field: "identifier"}
		messages = append(messages, m)
	}
	if len(contenttype.Name) == 0 {
		m := ErrorResponse{Message: "Name cannot be empty", From: contenttypeStr, Field: "name"}
		messages = append(messages, m)
	}
	if len(contenttype.TableName) == 0 {
		m := ErrorResponse{Message: "Table name cannot be empty", From: contenttypeStr, Field: "table_name"}
		messages = append(messages, m)
	}
	if len(contenttype.NamePattern) == 0 {
		m := ErrorResponse{Message: "Name pattern cannot be empty", From: contenttypeStr, Field: "name_pattern"}
		messages = append(messages, m)
	}

	if len(messages) > 0 {
		message := MessageError{Type: "error", Response: &messages}
		json.NewEncoder(w).Encode(message)
		return
	}

	if len(contenttype.Fields) > 0 {
		errors := validation(contenttype.Fields)
		if len(errors) > 0 {
			message := MessageError{Type: "error", Response: &errors}
			json.NewEncoder(w).Encode(message)
			return
		}
	}

	contentmodel[contenttypeStr] = contenttype
	//save contentmodel
	data, _ = json.MarshalIndent(contentmodel, "", " ")
	error = ioutil.WriteFile("./configs/contenttype.json", data, 0770) //should this stay

	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	} else {
		definition.LoadDefinition() //deployment.GenerateEntities()
	}

	m := MessageI{Type: "Success", Response: "Successfully created '" + contenttypeStr + "'"}
	json.NewEncoder(w).Encode(m)

}

func UpdateContenttype(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	contenttypeStr := mux.Vars(router)["entity"]
	var contenttype ContenttypeUpdate
	error := json.NewDecoder(router.Body).Decode(&contenttype)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load request body"}
		json.NewEncoder(w).Encode(m2)
		return
	}

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

	if contentmodel[contenttypeStr] == nil {
		m2 := Response{Type: "error", Response: "Contenttype '" + contenttypeStr + "' doesn't exist."}
		json.NewEncoder(w).Encode(m2)
		return
	}

	data, error3 := json.Marshal(contentmodel[contenttypeStr])
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

	//validate
	match, _ := regexp.MatchString("[A-ZøæåØÆÅ\\s\\d\\W]", contenttype.Identifier)
	var messages []ErrorResponse

	if contenttype.Identifier == "" || match == true {
		m := ErrorResponse{Message: "Identifier does not have a valid value", From: contenttypeStr, Field: "identifier"}
		messages = append(messages, m)
	}
	if len(contenttype.Name) == 0 {
		m := ErrorResponse{Message: "Name cannot be empty", From: contenttypeStr, Field: "name"}
		messages = append(messages, m)
	}
	if len(contenttype.TableName) == 0 {
		m := ErrorResponse{Message: "Table name cannot be empty", From: contenttypeStr, Field: "table_name"}
		messages = append(messages, m)
	}
	if len(contenttype.NamePattern) == 0 {
		m := ErrorResponse{Message: "Name pattern cannot be empty", From: contenttypeStr, Field: "name_pattern"}
		messages = append(messages, m)
	}

	if len(messages) > 0 {
		message := MessageError{Type: "error", Response: &messages}
		json.NewEncoder(w).Encode(message)
		return
	}
	if contenttypeStr != contenttype.Identifier {
		delete(contentmodel, contenttypeStr)
	}

	con.Name = contenttype.Name
	con.TableName = contenttype.TableName
	con.HasVersion = contenttype.HasVersion
	con.HasLocation = contenttype.HasLocation
	con.HasLocationId = contenttype.HasLocationId
	con.NamePattern = contenttype.NamePattern

	contentmodel[contenttype.Identifier] = con

	//save contentmodel
	data, _ = json.MarshalIndent(contentmodel, "", " ")
	error = ioutil.WriteFile("./configs/contenttype.json", data, 0770) //should this stay

	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to save to contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	definition.LoadDefinition() //deployment.GenerateEntities()

	m := MessageI{Type: "Success", Response: "Successfully Updated '" + contenttypeStr + "'"}
	json.NewEncoder(w).Encode(m)

}

func GetFieldTypes(w http.ResponseWriter, router *http.Request) {
	fieldtypes := make(map[string]interface{})
	file, error := os.Open("./configs/FieldTypeDefinition.json")
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load FieldTypeDefinition.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		m2 := Response{Type: "error", Response: "Unable to load FieldTypeDefinition.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &fieldtypes)
	if error2 != nil {
		m2 := Response{Type: "error", Response: "Unable to byte FieldTypeDefinition.json"}
		json.NewEncoder(w).Encode(m2)
		return
	}

	m := MessageI{Type: "Success", Response: fieldtypes}
	json.NewEncoder(w).Encode(m)
}

func init() {

	rest.RegisterRoute("/contentmodel/{entity}/", GetContenttype, "GET")
	rest.RegisterRoute("/contentmodel/fields/{entity}/", UpdateContenttypeFields, "PUT")
	rest.RegisterRoute("/contentmodel/{entity}/", RemoveContenttype, "DELETE")
	rest.RegisterRoute("/contentmodel/{entity}/", CreateContenttype, "POST")
	//rest.RegisterRoute("/contenttypes/", GetContenttypes,"GET")
	rest.RegisterRoute("/contentmodel/", GetContentmodel, "GET")
	rest.RegisterRoute("/contentmodel/{entity}/", UpdateContenttype, "PUT")
	rest.RegisterRoute("/contenttype/fieldtypes/", GetFieldTypes, "GET")

}
