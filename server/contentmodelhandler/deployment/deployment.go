package controller

import (
	"fmt"
	"os"
	"os/exec"
	"plugin"
	"strconv"

	"github.com/digimakergo/digimaker/core/log"

	//"github.com/digimakergo/digimaker/rest"
	"github.com/digimakergo/digimaker/codegen/entity"
	_ "github.com/digimakergo/digimaker/codegen/table"
	"github.com/digimakergo/digimaker/core/definition"
)

var counter int = 0

func GenerateEntities() {
	preStrCounter := strconv.Itoa(counter)
	counter++
	strCounter := strconv.Itoa(counter)
	if counter > 0 {
		os.Mkdir("entity"+strCounter, 0770)
	}
	definition.LoadDefinition() //have to reload the definition from the contenttype.json to recompile the new entities
	entity.Generate("./entity" + strCounter)
	fmt.Println("building entity " + strCounter)

	cmd := exec.Command("go", "build", "-buildmode=plugin", "-o", "./plugin/entity"+strCounter+".so", "./entity"+strCounter+"/")
	cmd.Stderr = os.Stderr
	error := cmd.Run()
	if error != nil {
		log.Fatal(error)
		log.Fatal("Couldn't rebuild entities plugin")
	} else {
		//table.GenerateTable("article") //get the query to create the table
		LoadEntities()
	}
	if counter > 1 {
		fmt.Println("removing entity " + preStrCounter)
		e1 := os.RemoveAll("./entity" + preStrCounter)
		e2 := os.Remove("./plugin/entity" + preStrCounter + ".so")

		if e1 == nil || e2 != nil {
			log.Info("Couldn't remove previous files")
		}
	}
}

func LoadEntities() {
	strCounter := strconv.Itoa(counter)
	fmt.Println("opening entity " + strCounter)
	_, error := plugin.Open("./plugin/entity" + strCounter + ".so") //open it and let it be used

	if error != nil {
		log.Fatal("Couldn't load in plugin")
	}
}

func init() {
	LoadEntities()
	//rest.RegisterRoute("/dmdemo/generateenetities/", GenerateEntities, "GET")
}
