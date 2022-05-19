package controller

import (
	"fmt"
	"os"
	"os/exec"
	"plugin"
	"strconv"

	"github.com/digimakergo/digimaker/codegen/entity"
	"github.com/digimakergo/digimaker/core/definition"
	"github.com/digimakergo/digimaker/core/log"
)

var counter int = 0

func GenerateEntities() {
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
		LoadEntities()
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
	entity.Generate("./entity0")
	exec.Command("go", "build", "-buildmode=plugin", "-o", "./plugin/entity0.so", "./entity0/")
	LoadEntities()
}
