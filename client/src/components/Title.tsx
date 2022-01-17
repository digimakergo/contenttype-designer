import React from 'react'
import { Form, Col,Row } from 'react-bootstrap';


function Title() {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="Title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Write the title of the article"/>
        </Form.Group>
      </Form>
    )
}

export default Title
