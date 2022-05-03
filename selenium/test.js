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

    let title = await driver.findElement(By.className("login-name form-control"));
    let identifier = await driver.findElement(By.className("login-identifier identifiers form-control"));
    let max = await driver.findElement(By.className("login-max_length form-control"));

    title.clear();
    identifier.clear();
    max.clear();

    await driver.findElement(By.id("submitdata")).click(); 






}

edit_contenttype_fields("frontpage")