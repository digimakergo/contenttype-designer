package controller

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"regexp"
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
	Options     string `json:"options,omitempty"`
	MaxSize     int    `json:"max_size,omitempty"`
	Format      string `json:"format,omitempty"`
	Dateonly    *bool  `json:"dateonly,omitempty"`
	Type        string `json:"type,omitempty"`
	Value       string `json:"value,omitempty"`
	Editmode    string `json:"editmode,omitempty"`
}

type Field struct {
	Identifier string      `json:"identifier"`
	Name       string      `json:"name"`
	Type       string      `json:"type"`
	Required   bool        `json:"required"`
	IsOutput   bool        `json:"is_output"`
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
	Type     string      `json:"type"`
	Response interface{} `json:"response"`
}
type ErrorResponse struct {
	Message string `json:"message"`
	From    string `json:"from"`
	Field   string `json:"field"`
}

func CreateContenttypeMethod(contentmodel map[string]interface{}, contenttype Contenttype, contenttypeStr string) Response {
	if contentmodel[contenttypeStr] != nil {
		return Response{Type: "error", Response: "Contenttype '" + contenttypeStr + "' already exist."}
	}

	//validate
	messages := ValidateContenttype(contenttypeStr, contenttype)

	if len(messages) > 0 {
		return Response{Type: "error", Response: &messages}
	}

	if len(contenttype.Fields) > 0 {
		identifiers := make(map[string]int)
		errors := ValidateFields(contenttype.Fields, identifiers)
		if len(errors) > 0 {
			return Response{Type: "error", Response: &errors}
		}
	}

	contentmodel[contenttypeStr] = contenttype

	return Response{Type: "Success", Response: "Successfully created '" + contenttypeStr + "'"}
}

func UpdateContenttypeMethod(contentmodel map[string]interface{}, contenttype ContenttypeUpdate, contenttypeStr string) Response {
	if contentmodel[contenttypeStr] == nil {
		return Response{Type: "error", Response: "Contenttype '" + contenttypeStr + "' doesn't exist."}

	}

	//validate
	messages := ValidateContenttypeUpdate(contenttype)
	if len(messages) > 0 {
		return Response{Type: "error", Response: &messages}
	}
	if contenttypeStr != contenttype.Identifier {
		delete(contentmodel, contenttypeStr)
	}

	var con Contenttype
	con.Name = contenttype.Name
	con.TableName = contenttype.TableName
	con.HasVersion = contenttype.HasVersion
	con.HasLocation = contenttype.HasLocation
	con.HasLocationId = contenttype.HasLocationId
	con.NamePattern = contenttype.NamePattern

	contentmodel[contenttype.Identifier] = con

	return Response{Type: "Success", Response: "Successfully Updated '" + contenttypeStr + "'"}
}

func UpdateContenttypeFieldMethod(contentmodel map[string]interface{}, contenttype string, fields []Field) Response {

	if contentmodel[contenttype] == nil {
		return Response{Type: "error", Response: "Contenttype '" + contenttype + "' doesn't exist"}
	}
	identifiers := make(map[string]int)
	errors := ValidateFields(fields, identifiers)

	if len(errors) > 0 {
		return Response{Type: "error", Response: &errors}
	}

	con := GetContenttypeFromContentmodel(contenttype, contentmodel)
	if con == nil {
		return Response{Type: "error", Response: "Cannot get a specific contenttype"}
	}

	con.Fields = fields
	contentmodel[contenttype] = con

	return Response{Type: "Success", Response: "Successfully updated the fields of '" + contenttype + "'"}
}

func RemoveContenttypeMethod(contentmodel map[string]interface{}, contenttype string) Response {
	if contentmodel[contenttype] == nil {
		return Response{Type: "error", Response: "Contenttype '" + contenttype + "' doesn't exist"}
	}

	delete(contentmodel, contenttype)
	return Response{Type: "Success", Response: "Successfully removed '" + contenttype + "'"}
}

func ValidateFields(fields []Field, identifiers map[string]int) []ErrorResponse {
	var messages []ErrorResponse
	regex := "[A-ZøæåØÆÅ\\s\\d\\W]"
	for _, elem := range fields {

		//common Validation
		match, _ := regexp.MatchString(regex, elem.Identifier)

		if elem.Identifier == "" || match == true {
			m := ErrorResponse{Message: "Identifier does not have a valid value", From: elem.Identifier, Field: "identifier"}
			messages = append(messages, m)
		}
		if identifiers[elem.Identifier] == 1 {
			m := ErrorResponse{Message: "Identifier is a duplicate", From: elem.Identifier, Field: "identifier"}
			messages = append(messages, m)
		} else {
			identifiers[elem.Identifier] = 1
		}
		if len(elem.Name) == 0 {
			m := ErrorResponse{Message: "Name does not have a valid value", From: elem.Identifier, Field: "name"}
			messages = append(messages, m)
		}
		if len(elem.Type) == 0 {
			m := ErrorResponse{Message: "Type does not have a valid value", From: elem.Identifier, Field: "type"}
			messages = append(messages, m)
		}

		//type ValidateFields
		if elem.Type == "text" {
			if elem.Parameters.MaxLength <= 0 {
				m := ErrorResponse{Message: "Max length field does not have a valid value", From: elem.Identifier, Field: "max_length"}
				messages = append(messages, m)
			}
			if elem.Parameters.IsMultiLine == nil {
				m := ErrorResponse{Message: "Type does not have a valid value", From: elem.Identifier, Field: "is_multi_line"}
				messages = append(messages, m)
			}
		} else if elem.Type == "richtext" {
			if len(elem.Parameters.Mode) == 0 {
				m := ErrorResponse{Message: "Mode does not have a value selected", From: elem.Identifier, Field: "mode"}
				messages = append(messages, m)
			}
		} else if elem.Type == "radio" {
			if len(elem.Parameters.Options) == 0 {
				elem.Parameters.Options = "-1"
			}
		} else if elem.Type == "file" {
			if elem.Parameters.MaxSize <= 0 {
				m := ErrorResponse{Message: "Max size field does not have a valid value", From: elem.Identifier, Field: "max_size"}
				messages = append(messages, m)
			}
			if len(elem.Parameters.Format) == 0 {
				m := ErrorResponse{Message: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				messages = append(messages, m)
			}
		} else if elem.Type == "image" {
			if len(elem.Parameters.Format) == 0 {
				m := ErrorResponse{Message: "Format does not have a selected value", From: elem.Identifier, Field: "format"}
				messages = append(messages, m)
			}
		} else if elem.Type == "datetime" {
			if elem.Parameters.Dateonly == nil {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "dateonly"}
				messages = append(messages, m)
			}
		} else if elem.Type == "relation" {
			if elem.Parameters.Type == "" {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "type"}
				messages = append(messages, m)
			}
			if elem.Parameters.Value == "" {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "value"}
				messages = append(messages, m)
			}
			if elem.Parameters.Editmode == "" {
				elem.Parameters.Editmode = "browse"
			}
		} else if elem.Type == "relationlist" {
			if elem.Parameters.Type == "" {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "type"}
				messages = append(messages, m)
			}
			if elem.Parameters.Value == "" {
				m := ErrorResponse{Message: "Parameter does not have a valid value", From: elem.Identifier, Field: "value"}
				messages = append(messages, m)
			}
			if elem.Parameters.Editmode == "" {
				elem.Parameters.Editmode = "browse"
			}
		} else if elem.Type == "container" {
			temp := ValidateFields(elem.Children, identifiers)
			for _, err := range temp {
				messages = append(messages, err)
			}
		}

	}

	return messages
}

func ValidateContenttype(contenttypeStr string, contenttype Contenttype) []ErrorResponse {
	match, _ := regexp.MatchString("[A-ZøæåØÆÅ\\s\\d\\W]", contenttypeStr)
	var messages []ErrorResponse
	if contenttypeStr == "" || match == true {
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
	return messages
}
func ValidateContenttypeUpdate(contenttype ContenttypeUpdate) []ErrorResponse {
	match, _ := regexp.MatchString("[A-ZøæåØÆÅ\\s\\d\\W]", contenttype.Identifier)
	var messages []ErrorResponse
	if contenttype.Identifier == "" || match == true {
		m := ErrorResponse{Message: "Identifier does not have a valid value", From: contenttype.Identifier, Field: "identifier"}
		messages = append(messages, m)
	}
	if len(contenttype.Name) == 0 {
		m := ErrorResponse{Message: "Name cannot be empty", From: contenttype.Identifier, Field: "name"}
		messages = append(messages, m)
	}
	if len(contenttype.TableName) == 0 {
		m := ErrorResponse{Message: "Table name cannot be empty", From: contenttype.Identifier, Field: "table_name"}
		messages = append(messages, m)
	}
	if len(contenttype.NamePattern) == 0 {
		m := ErrorResponse{Message: "Name pattern cannot be empty", From: contenttype.Identifier, Field: "name_pattern"}
		messages = append(messages, m)
	}
	return messages
}

func GetFile(filepath string) map[string]interface{} {
	contentmodel := make(map[string]interface{})
	file, error := os.Open(filepath)
	if error != nil {
		return nil
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		return nil
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &contentmodel)
	if error2 != nil {
		return nil
	}
	return contentmodel
}

func GetContenttypeFromContentmodel(contenttype string, contentmodel map[string]interface{}) *Contenttype {
	data, error := json.Marshal(contentmodel[contenttype])
	if error != nil {
		return nil
	}

	var con *Contenttype
	error1 := json.Unmarshal([]byte(data), &con)

	if error1 != nil {
		return nil
	}
	return con
}

func WriteToFile(object interface{}, filepath string) bool {
	data, error := json.MarshalIndent(object, "", " ")
	if error != nil {
		return false
	}

	error = ioutil.WriteFile(filepath, data, 0770) //should this stay
	if error != nil {
		return false
	}
	return true
}
