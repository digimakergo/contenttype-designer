const {Builder, By, Key, util} = require("selenium-webdriver");
const assert = require("assert");
const { get } = require("http");

async function deleteContenttype(contenttype){
    // Starting the driver
    let driver = await new Builder().forBrowser('firefox').build()
    await driver.get("http://localhost:3000/")
    
    // Selecting the contenttype
    let select = await driver.findElement(By.id("ManageContentTypes_select"));
    select.findElement(By.css("option[value='"+contenttype+"']")).click();
    let data = await select.getText();

    // Deleting the contenttype
    await driver.findElement(By.name("delete_contenttype")).click();

    // Checking that its deleted
    let newData = await select.getText();
    assert.notStrictEqual(newData, data);
    let isEmpty = await select.getAttribute("value");
    assert.strictEqual("", isEmpty);

    




    // Closing window
    await driver.quit();
}
//deleteContenttype("brtikkel");


async function editContenttype(contenttype) {
    //editing the contenttype
    // Starting the driver
    let driver = await new Builder().forBrowser('firefox').build()
    await driver.get("http://localhost:3000/")
    
    // Selecting the contenttype
    let select = await driver.findElement(By.id("ManageContentTypes_select"));
    select.findElement(By.css("option[value='"+contenttype+"']")).click();
    let selectedValue = await select.getAttribute("value");
    console.log(selectedValue)
    //assert.notStrictEqual("", selectedValue)

       
    await driver.findElement(By.name("edit_contenttype")).click();

    let identi = await driver.findElement(By.className("contenttype-identifier"));
    let name = await driver.findElement(By.className("contenttype-name"));
    let pattern = await driver.findElement(By.className("contenttype-namepattern"));

    //emptying fields
    identi.clear();
    name.clear();
    pattern.clear();
    
    await driver.findElement(By.name("saveContenttype")).click();   
    
    let identi_err = await driver.findElement(By.className("contenttype-error-identifier")).getAttribute("value");
    let name_err = await driver.findElement(By.className("contenttype-error-name")).getAttribute("value");
    let pattern_err = await driver.findElement(By.className("contenttype-error-namepattern")).getAttribute("value");


    assert.notStrictEqual("", identi_err)
    assert.notStrictEqual("", name_err)
    assert.notStrictEqual("", pattern_err)


    //duplicate identifier
    identi.sendKeys("user", Key.RETURN);
    name.sendKeys("Frontpage", Key.RETURN);
    pattern.sendKeys("{}", Key.RETURN);
    await driver.findElement(By.name("saveContenttype")).click();   
    
    identi_err = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
    assert.notStrictEqual("", identi_err);
    
    identi.clear();identi.sendKeys("frontpage", Key.RETURN);
    await driver.findElement(By.name("saveContenttype")).click();   

    identi_err1 = await driver.findElement(By.className("contenttype-error-identifier")).getAttribute("value");
    identi_err2 = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
    assert.strictEqual(null, identi_err1);
    assert.strictEqual(null, identi_err2);
    






    
    


    
    
}
//editContenttype("frontpage");


async function edit_contenttype_fields(contenttype) {

    //editing the contenttype's fields attributtes
    // Starting the driver
    let driver = await new Builder().forBrowser('firefox').build()
    await driver.get("http://localhost:3000/")
    
    // Selecting the contenttype
    let select = await driver.findElement(By.id("ManageContentTypes_select"));
    select.findElement(By.css("option[value='"+contenttype+"']")).click();
    let selectedValue = await select.getAttribute("value");
    console.log(selectedValue)
    //assert.notStrictEqual("", selectedValue)

       
    await driver.findElement(By.name("edit_contenttype")).click();
    await driver.findElement(By.name("edit-fields")).click();

    let name = await driver.findElement(By.className("id-0-name"));
    let identifier = await driver.findElement(By.className("id-0-identifier"));
    let max = await driver.findElement(By.className("id-0-max_length"));

    const submit = await driver.findElement(By.id("submitdata"));
    

    
    name.clear();
    identifier.clear();
    
    await driver.executeScript("arguments[0].scrollIntoView(true)", max)
    await driver.sleep(500)
    max.clear();

    await driver.executeScript("arguments[0].scrollIntoView(true)", submit)
    await driver.sleep(500)
    submit.click(); 

    let name_err = await driver.findElement(By.className("feilmelding id-0-name-error")).getAttribute("value");
    let identifier_err = await driver.findElement(By.className("id-0-identifier-error")).getAttribute("value");
    let maxVal = await max.getAttribute("value");


    assert.notStrictEqual("", name_err)
    assert.notStrictEqual("", identifier_err)
    assert.strictEqual(true, Number(maxVal) <= 0)

    await driver.findElement(By.name("hide-errors")).click();

    //success

    name.sendKeys("Title", Key.RETURN);
    identifier.sendKeys("title", Key.RETURN);
    max.sendKeys("100", Key.RETURN);
    await driver.sleep(500)
    submit.click();   
    
    name_err = await driver.findElement(By.className("feilmelding id-0-name-error")).getAttribute("value");
    identifier_err = await driver.findElement(By.className("id-0-identifier-error")).getAttribute("value");
    maxVal = await max.getAttribute("value");

    assert.notStrictEqual("", name_err)
    assert.notStrictEqual("", identifier_err)
    assert.strictEqual(false, Number(maxVal) <= 0)


    await driver.executeScript("arguments[0].scrollIntoView(true)", submit)
    await driver.sleep(500)
    submit.click();


    //duplicate 
    


}

edit_contenttype_fields("test")

async function add_contenttype_fields(contenttype) {
     //editing the contenttype's fields attributtes
    // Starting the driver
    let driver = await new Builder().forBrowser('firefox').build()
    await driver.get("http://localhost:3000/")
    
    // Selecting the contenttype
    let select = await driver.findElement(By.id("ManageContentTypes_select"));
    select.findElement(By.css("option[value='"+contenttype+"']")).click();
    let selectedValue = await select.getAttribute("value");
    console.log(selectedValue)

    await driver.findElement(By.name("edit_contenttype")).click();
    await driver.findElement(By.name("edit-fields")).click();
    //assert.notStrictEqual("", selectedValue)

    const add = await driver.findElement(By.name("addFields_btn"));

    await driver.executeScript("arguments[0].scrollIntoView(true)", add)
    await driver.sleep(1000)
    add.click();
    await driver.sleep(1000)
  

    let add_name = await driver.findElement(By.className("add_name"));
    let add_identifier = await driver.findElement(By.className("add_identifier"));


    const add_field = await driver.findElement(By.name("addField"));


    
    
    add_name.clear();
    add_identifier.clear();


    await driver.executeScript("arguments[0].scrollIntoView(true)", add_field)
    await driver.sleep(500)
    add_field.click(); 
    
    let add_name_err = await driver.findElement(By.className("feilmelding_addfieldname form-label")).getAttribute("value");
    let add_identifier_err = await driver.findElement(By.className("feilmelding_likidentifieras form-label")).getAttribute("value");
    let add_select_err= await driver.findElement(By.className("feilmelding_select form-label")).getAttribute("value");

    assert.notStrictEqual("", add_name_err)
    assert.notStrictEqual("", add_identifier_err)
    assert.notStrictEqual("", add_select_err)

    //duplicate 

    select = await driver.findElement(By.id("addField_select"));
    
   

    add_identifier.sendKeys("title", Key.RETURN);
    add_name.sendKeys("Test", Key.RETURN);
    await select.findElement(By.css("option[value='file']")).click();

    await driver.findElement(By.name("addField")).click();   
    
    add_identifier_err = await driver.findElement(By.className("feilmelding_likidentifieras form-label")).getAttribute("value");
    assert.notStrictEqual("", add_identifier_err);
    
    add_identifier.clear();add_identifier.sendKeys("test", Key.RETURN);
    await driver.findElement(By.name("addField")).click();   



}

//add_contenttype_fields("test")
