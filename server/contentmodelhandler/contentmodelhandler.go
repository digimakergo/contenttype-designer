package controller

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/digimakergo/digimaker/rest"
)

type Contenttype struct {
	identifier struct {
		Name        string  `json:"name"`
		TableName   string  `json:"table_name"`
		HasVersion  bool    `json:"has_version"`
		HasLocation bool    `json:"has_location"`
		Fields      []Field `json:"fields"`
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

func contentmodelhandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	w.Header().Set("Content-Type", "application/json")
	//authorization
	userID := rest.CheckUserID(ctx, w)
	if userID == 0 {
		//rest.WriteResponse("unauthorized", w)
		//return
	}
	//rest.WriteResponse("connected", w)

	//getting the data
	w.Header().Set("Content-Type", "application/json")
	var field []Field
	_ = json.NewDecoder(r.Body).Decode(&field)
	for _, elem := range field {
		if elem.Type == "richtext" {

		}
	}

	//validate given data

	//update the contenttype.json
	//opening contenttype.json for adding to article perhaps be more general later
	file, error := os.Open("../../configs/contenttype.json")
	if error != nil {
		rest.HandleError(errors.New("Unable to load contentmodel"), w)
		return
	}

	defer file.Close()
	data, error := ioutil.ReadAll(file)
	if error != nil {
		rest.HandleError(errors.New("Unable to read contentmodel"), w)
		return
	}

	var contentmodel Contenttype
	error2 := json.Unmarshal(data, &contentmodel)
	if error2 != nil {
		rest.HandleError(errors.New("Unable to create object from json data"), w)
		return
	}

	//re-compile files

	//alter database

}

func init() {
	rest.RegisterRoute("/dmdemo/contentmodel/update", contentmodelhandler, "PUT")
}
