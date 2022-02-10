package controller

import (
	_ "errors"
	"net/http"

	"github.com/digimakergo/digimaker/rest"
)

func contentmodellhandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	//authorization
	userID := rest.CheckUserID(ctx, w)
	if userID == 0 {
		rest.WriteResponse("unauthorized", w)
		return
	}
	rest.WriteResponse("authorized", w)

	//validate given data

	//update the contenttype.json

	//re-compile files

	//alter database

}

func init() {
	rest.RegisterRoute("/dmdemo/contentmodell/update", contentmodellhandler, "POST")
}
