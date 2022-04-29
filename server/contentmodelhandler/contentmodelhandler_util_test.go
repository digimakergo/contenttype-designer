package controller

import "testing"

//Test get a file
func TestGetContentmodel(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
}

func TestGetFieldTypeDefinition(t *testing.T) {
	fieldstypes := GetFile("../../configs/FieldTypeDefinition.json")
	if fieldstypes == nil {
		t.Error("Expected the FieldTypeDefinition, got nil.")
	}
}

func TestGetFileFail(t *testing.T) {
	file := GetFile("")
	if file != nil {
		t.Error("Expected nil, got a file.")
	}
}

//Test write to a file
func TestWriteToFileOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	if !WriteToFile(contentmodel, "../../configs/contenttype.test.json") {
		t.Error("Expected to write to contenttype.test.json, got false")
	}
}
func TestWriteToNoFile(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	if WriteToFile(contentmodel, "") {
		t.Error("Unexpectedly wrote to a file")
	}
}

//Test get a contenttype
func TestGetContenttypeOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := GetContenttypeFromContentmodel("article", contentmodel)
	if contenttype == nil {
		t.Error("Expected the contenttype, got nil.")
	}
}
func TestGetContenttypeDoesntExist(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := GetContenttypeFromContentmodel("doesntexist", contentmodel)
	if contenttype != nil {
		t.Error("Expected the contenttype, got a contenttype.")
	}

}

// Test creating a contenttype
func TestCreateContenttypeOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")

	if data.Type == "error" {
		t.Error("Expected type success, got error.")
	}
	if contentmodel["crticle"] == nil {
		t.Error("Expected crticle to exist in contentmodel, got nil.")
	}
}

func TestCreateContenttypeDuplicateFail(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "article")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeWithFieldsOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	bol := true
	parameters := Parameters{MaxLength: 10, IsMultiLine: &bol}
	field := Field{Identifier: "title", Name: "Title", Type: "text", Parameters: &parameters}
	var fields []Field
	fields = append(fields, field)
	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, Fields: fields, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "error" {
		t.Error("Expected type success, got error.")
	}

	if contentmodel["crticle"] == nil {
		t.Error("Expected crticle to exist in contentmodel, got nil.")
	}
}

func TestCreateContenttypeMissingIdentifier(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}
func TestCreateContenttypeInvalidIdentifierCapitalized(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "Crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}
func TestCreateContenttypeInvalidIdentifierSign(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle-!?")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeInvalidIdentifierSpace(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crt icle")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeInvalidIdentifierNumbers(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle123")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeMissingName(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeMissingTableName(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

func TestCreateContenttypeMissingNamePattern(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: ""}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, got Success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, it was not nil.")
	}
}

//Testing removing a contenttype
func TestRemoveContenttypeOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	response := RemoveContenttypeMethod(contentmodel, "article")
	if response.Type != "Success" {
		t.Error("Expected type success, got error.")
	}

	if contentmodel["article"] != nil {
		t.Error("Expected article to be nil in contentmodel, it was not nil.")
	}
}

func TestRemoveContenttypeDoesntExist(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	response := RemoveContenttypeMethod(contentmodel, "doesntexist")
	if response.Type != "error" {
		t.Error("Expected type error, got success.")
	}
}

//Test updating a contenttype
func TestUpdateContenttypeOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")
	if response.Type == "error" {
		t.Error("Expected type Success, got error")
	}

	if contentmodel["brticle"] == nil {
		t.Error("Expected key 'brticle' to have value in contentmodel, got nil")
	}
}

func TestUpdateContenttypeMissingIdentifier(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}

func TestUpdateContenttypeInvalidIdentifierCapitalized(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "Brticle", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}
func TestUpdateContenttypeInvalidIdentifierSpace(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brt icle", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}
func TestUpdateContenttypeInvalidIdentifierSign(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle-!?", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}
func TestUpdateContenttypeInvalidIdentifierNumber(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle123", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}

func TestUpdateContenttypeMissingName(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle", Name: "", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}

func TestUpdateContenttypeMissingTableName(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle", Name: "Brticle", TableName: "", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}

func TestUpdateContenttypeMissingNamePattern(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	contenttype := ContenttypeUpdate{Identifier: "brticle", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: ""}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "article")

	if response.Type == "Success" {
		t.Error("Expected type error, got Success")
	}
	if contentmodel["brticle"] != nil {
		t.Error("Expected key 'brticle' to be nil in contentmodel, got a value")
	}
}

func TestUpdateContenttypeDoesntExist(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := ContenttypeUpdate{Identifier: "brticle", Name: "Brticle", TableName: "dm_brticle", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: "{}"}

	response := UpdateContenttypeMethod(contentmodel, contenttype, "doesntexist")
	if response.Type == "Success" {
		t.Error("Expected type error, got success.")
	}

	if contentmodel["doesntexist"] != nil {
		t.Error("Expected key 'doesntexist' to have value nil in contentmodel, got a value")
	}
}

//Test Updating contenttype fields
func TestUpdateContenttypeFieldsOK(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	var fields []Field
	booleanvalue := true

	parameters := Parameters{MaxLength: 10, IsMultiLine: &booleanvalue}
	field := Field{Identifier: "title", Name: "Title", Type: "text", Parameters: &parameters}
	fields = append(fields, field)

	response := UpdateContenttypeFieldMethod(contentmodel, "article", fields)
	if response.Type == "error" {
		t.Error("Expected type success, got error.")
	}
}

func TestUpdateContenttypeFieldsFailForANonExistingContenttype(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	var fields []Field
	booleanvalue := true

	parameters := Parameters{MaxLength: 10, IsMultiLine: &booleanvalue} // missing parameter
	field := Field{Identifier: "title", Name: "Title", Type: "text", Parameters: &parameters}
	fields = append(fields, field)

	response := UpdateContenttypeFieldMethod(contentmodel, "doesntexist", fields)
	if response.Type == "Success" {
		t.Error("Expected type error, got success.")
	}
}

//Test validation of contenttypes
func TestContenttypeValidationFail(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}

	contenttype := Contenttype{Name: "", TableName: "", HasVersion: true, HasLocation: false, HasLocationId: true, NamePattern: ""}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, did not get it.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to be nil in contentmodel, did not got nil.")
	}
}

//Test validation of fields
func TestFieldsValidationEmptyIdentifier(t *testing.T) {
	contentmodel := GetFile("../../configs/contenttype.json")
	if contentmodel == nil {
		t.Error("Expected the contentmodel, got nil.")
	}
	var fields []Field
	booleanvalue := true

	parameters := Parameters{MaxLength: 10, IsMultiLine: &booleanvalue} // missing parameter
	field := Field{Identifier: "", Name: "Title", Type: "title", Parameters: &parameters}
	fields = append(fields, field)

	contenttype := Contenttype{Name: "Crticle", TableName: "dm_crticle", HasVersion: true, HasLocation: false, HasLocationId: true, Fields: fields, NamePattern: "{}"}
	data := CreateContenttypeMethod(contentmodel, contenttype, "crticle")
	if data.Type == "Success" {
		t.Error("Expected type error, got success.")
	}

	if contentmodel["crticle"] != nil {
		t.Error("Expected crticle to not exist in contentmodel, it exist.")
	}
}

func TestFieldsValidationSpaceInIdentifier(t *testing.T) {
	var fields []Field

	parameters := Parameters{Mode: "compact"}
	field := Field{Identifier: "tit le", Name: "Title", Type: "richtext", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}

func TestFieldsValidationCapitalizationInIdentifier(t *testing.T) {
	var fields []Field

	parameters := Parameters{Format: "jpg"}
	field := Field{Identifier: "Title", Name: "Title", Type: "image", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}

func TestFieldsValidationMissingName(t *testing.T) {
	var fields []Field

	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "", Type: "checkbox", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingType(t *testing.T) {
	var fields []Field

	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}

func TestFieldsValidationMissingParametersIsMultiLine(t *testing.T) {
	var fields []Field

	parameters := Parameters{MaxLength: 10}
	field := Field{Identifier: "title", Name: "Title", Type: "text", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}

func TestFieldsValidationMissingParametersMaxLength(t *testing.T) {
	var fields []Field
	booleanvalue := true
	parameters := Parameters{IsMultiLine: &booleanvalue}
	field := Field{Identifier: "title", Name: "Title", Type: "text", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersMode(t *testing.T) {
	var fields []Field
	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "richtext", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersOptions(t *testing.T) {
	var fields []Field
	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "radio", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersMaxSize(t *testing.T) {
	var fields []Field
	parameters := Parameters{Format: "docx"}
	field := Field{Identifier: "title", Name: "Title", Type: "file", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersFormatFile(t *testing.T) {
	var fields []Field
	parameters := Parameters{MaxSize: 10}
	field := Field{Identifier: "title", Name: "Title", Type: "file", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersFormatImage(t *testing.T) {
	var fields []Field
	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "image", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersDateOnly(t *testing.T) {
	var fields []Field
	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "datetime", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersTypeRelation(t *testing.T) {
	var fields []Field
	parameters := Parameters{Value: "as", Editmode: "select"}
	field := Field{Identifier: "title", Name: "Title", Type: "relation", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersValueRelation(t *testing.T) {
	var fields []Field
	parameters := Parameters{Type: "as", Editmode: "select"}
	field := Field{Identifier: "title", Name: "Title", Type: "relation", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersEditmodeRelation(t *testing.T) {
	var fields []Field
	parameters := Parameters{Type: "as", Value: "as"}
	field := Field{Identifier: "title", Name: "Title", Type: "relation", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) != 0 {
		t.Error("Expected 0 validation errors, got more than that.")
	}
}

func TestFieldsValidationMissingParametersTypeRelationlist(t *testing.T) {
	var fields []Field
	parameters := Parameters{Value: "as", Editmode: "select"}
	field := Field{Identifier: "title", Name: "Title", Type: "relationlist", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersValueRelationlist(t *testing.T) {
	var fields []Field
	parameters := Parameters{Type: "as", Editmode: "select"}
	field := Field{Identifier: "title", Name: "Title", Type: "relationlist", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
func TestFieldsValidationMissingParametersEditmodeRelationlist(t *testing.T) {
	var fields []Field
	parameters := Parameters{Type: "as", Value: "as"}
	field := Field{Identifier: "title", Name: "Title", Type: "relationlist", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) != 0 {
		t.Error("Expected 0 validation errors, got more than that.")
	}
}

func TestFieldsValidationForContainerOK(t *testing.T) {
	var fields []Field
	var container []Field
	field := Field{Identifier: "title", Name: "Title", Type: "checkbox"}
	container = append(container, field)

	field = Field{Identifier: "itle", Name: "Title", Type: "container", Children: container}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) != 0 {
		t.Log(data)
		t.Error("Expected validation 0 errors, got more than 0.")
	}
}
func TestFieldsValidationForContainerDuplicateIdentifier(t *testing.T) {
	var fields []Field
	var container []Field
	field := Field{Identifier: "title", Name: "Title", Type: "checkbox"}
	container = append(container, field)

	field = Field{Identifier: "title", Name: "Title", Type: "container", Children: container}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected more than 0 validation errors, got 0.")
	}
}

func TestFieldsValidationDuplicateIdentifier(t *testing.T) {
	var fields []Field
	parameters := Parameters{}
	field := Field{Identifier: "title", Name: "Title", Type: "checkbox", Parameters: &parameters}
	fields = append(fields, field)

	parameters = Parameters{}
	field = Field{Identifier: "title", Name: "Title", Type: "checkbox", Parameters: &parameters}
	fields = append(fields, field)

	identifiers := make(map[string]int)
	data := ValidateFields(fields, identifiers)
	if len(data) == 0 {
		t.Error("Expected validation errors, got 0.")
	}
}
