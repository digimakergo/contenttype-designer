const {Builder, By, Key, util} = require("selenium-webdriver");
const assert = require("assert");

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
deleteContenttype("brtikkel");