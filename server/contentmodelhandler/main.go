package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

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
		MaxLength   string `json:"max_length,omitempty"`
		IsMultiLine *bool  `json:"is_multi_line,omitempty"`
		Mode        string `json:"mode,omitempty"`
		Options     string `json:"Options,omitempty"`
		MaxSize     string `json:"max_size,omitempty"`
		Format      string `json:"format,omitempty"`
		Dateonly    string `json:"dateonly,omitempty"`
	} `json:"parameters,omitempty"`
	Children []Field `json:"children,omitempty"`
}

type Message struct {
	Response string `json:"response"`
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

func test(w http.ResponseWriter, router *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var field []Field
	error := json.NewDecoder(router.Body).Decode(&field)
	if error != nil {
		m2 := Message{Response: "Unable to load request body"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	for _, elem := range field {
		if elem.Type == "richtext" {

		}
	}

	m := MessageF{Response: field}
	json.NewEncoder(w).Encode(m)

	var contenttype map[string]interface{}
	file, error := os.Open("../contenttype.json")
	if error != nil {
		m2 := Message{Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		m2 := Message{Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error)
		return
	}
	//var res map[string]interface{}
	error2 := json.Unmarshal([]byte(data), &contenttype)
	if error2 != nil {
		m2 := Message{Response: "Unable to load contenttype.json"}
		json.NewEncoder(w).Encode(m2)
		fmt.Println(error2)
		return
	}

	m3 := MessageI{Response: contenttype}
	json.NewEncoder(w).Encode(m3)
	//fmt.Println(contenttype["article"])
}

func main() {
	//router
	router := mux.NewRouter()

	router.HandleFunc("/test", test).Methods("GET")
	log.Fatal(http.ListenAndServe(":8000", router))

}
