import React from 'react'
import { Form, Input } from 'antd';


function Title() {
    return (
        <Form.Item
        label='Tittel'
        name='tittel'
        rules={[{required:true, message: 'Please enter the Title'}]}>

          <Input>
          
          </Input>
        </Form.Item>
    )
}

export default Title
