import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; //Editing tool framework packages

function Summary(){
    const[text,setText]=useState('')
    return(
        <div className='Summary'>
        <div className="editor">
            <CKEditor
            editor={ClassicEditor}
            data={text}
            onChange={(event:any, editor:any) => {
            const data= editor.getData()
            setText(data)}
            }
            />
        </div>
        <div>
            <h2>Summary</h2>
        </div>
        </div>
    )
}
export default  Summary