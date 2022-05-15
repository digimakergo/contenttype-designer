const {Builder, By, Key, util, until} = require("selenium-webdriver");
const ltCapabilities= require("./capabilitites");
const assert = require("assert");

describe("Testing the management of the contenttype: 'test'",  async function (){
    this.timeout(100000000)
    var driver;
    
    const USERNAME = ltCapabilities.capabilities["LT:Options"].user;


    const KEY = ltCapabilities.capabilities["LT:Options"].accessKey;

    const GRID_HOST="hub.lambdatest.com/wd/hub";

    const gridURL= "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;

    beforeEach(function(){
        driver =  new Builder().usingServer(gridURL)
        .withCapabilities(ltCapabilities.capabilities)
        .build();

        // Starting the driver
    //let driver = await new Builder().forBrowser('firefox').build()
    
    


    });
    afterEach(async function(){
        // Closing window
        await driver.quit();
    });

    it("Creates the contenttype 'test'.", async function(){
        // adding a contenttype
        // Starting the driver
        await driver.get("http://designer.dev.digimaker.no")

        await driver.findElement(By.name("add_contenttype")).click();

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
        name.sendKeys("Test", Key.RETURN);
        pattern.sendKeys("{}", Key.RETURN);
        await driver.findElement(By.name("saveContenttype")).click();   
        
        identi_err = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
        assert.notStrictEqual("", identi_err);
        
        await identi.clear();
        await identi.sendKeys("test", Key.RETURN);
        await driver.findElement(By.name("saveContenttype")).click();   

        identi_err1 = await driver.findElement(By.className("contenttype-error-identifier")).getAttribute("value");
        identi_err2 = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
        assert.strictEqual(null, identi_err1);
        assert.strictEqual(null, identi_err2);

        await driver.findElement(By.name("back")).click()
        const select = await driver.findElement(By.id("ManageContentTypes_select"));
        await driver.sleep(1000)
        await select.findElement(By.css("option[value='test']")).click();
        const selectedValue = await select.getAttribute("value");
        assert.strictEqual("test", selectedValue);
    })
    it("edits the contenttype 'test'.", async function(){
        // adding a contenttype
        // Starting the driver
        await driver.get("http://designer.dev.digimaker.no/")
        let select = await driver.findElement(By.id("ManageContentTypes_select"));
        select.findElement(By.css("option[value='test']")).click();
        let selectedValue = await select.getAttribute("value");
    
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
        name.sendKeys("Test", Key.RETURN);
        pattern.sendKeys("{}", Key.RETURN);
        await driver.findElement(By.name("saveContenttype")).click();   
    
        identi_err = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
        assert.notStrictEqual("", identi_err);
    
        identi.clear();identi.sendKeys("test", Key.RETURN);
        await driver.findElement(By.name("saveContenttype")).click();   
    
        identi_err1 = await driver.findElement(By.className("contenttype-error-identifier")).getAttribute("value");
        identi_err2 = await driver.findElement(By.className("contenttype-error-identifier-equal")).getAttribute("value");
        assert.strictEqual(null, identi_err1);
        assert.strictEqual(null, identi_err2);
    
    
    })
})


describe("Testing the management of the contenttype test's fields",  async function (){
    this.timeout(100000000)
    var driver;
    
    const USERNAME = ltCapabilities.capabilities["LT:Options"].user;


    const KEY = ltCapabilities.capabilities["LT:Options"].accessKey;

    const GRID_HOST="hub.lambdatest.com/wd/hub";

    const gridURL= "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;

    beforeEach(function(){
        driver =  new Builder().usingServer(gridURL)
        .withCapabilities(ltCapabilities.capabilities)
        .build();

        // Starting the driver
    //let driver = await new Builder().forBrowser('firefox').build()
    
    


    });
    afterEach(async function(){
        // Closing window
        await driver.quit();
    });
    
    it("Manage a field 'title' for 'test'.", async function(){
            
        await driver.get("http://designer.dev.digimaker.no/")
        
        let select = await driver.findElement(By.id("ManageContentTypes_select"));
        select.findElement(By.css("option[value='test']")).click();
        let selectedValue = await select.getAttribute("value");
        //assert.notStrictEqual("", selectedValue)
    
        await driver.findElement(By.name("edit_contenttype")).click();
        await driver.sleep(10)
        await driver.findElement(By.name("edit_fields")).click();


        //adding a field

        const add = await driver.findElement(By.name("addFields_btn"));
    
        await driver.executeScript("arguments[0].scrollIntoView(true)", add)
        await driver.sleep(500)
        add.click();
        await driver.sleep(1000)


        let add_name = await driver.findElement(By.id("addField_name"));
        let add_identifier = await driver.findElement(By.id("addField-identifier"));
        select = await driver.findElement(By.id("addField_select"));

        add_identifier.sendKeys("title", Key.RETURN);
        add_name.sendKeys("Title", Key.RETURN);
        await select.findElement(By.css("option[value='text']")).click();
    
    
        await driver.findElement(By.name("addField")).click();
        
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
    
       
        
    })
    
    it("Manage multiple fields in 'test'.", async function(){
            
        await driver.get("http://designer.dev.digimaker.no/")
        
        let select = await driver.findElement(By.id("ManageContentTypes_select"));
        select.findElement(By.css("option[value='test']")).click();
        let selectedValue = await select.getAttribute("value");
        //assert.notStrictEqual("", selectedValue)
    
           
        await driver.findElement(By.name("edit_contenttype")).click();
        await driver.sleep(1000)
        await driver.findElement(By.name("edit_fields")).sendKeys(Key.ENTER);
        //assert.notStrictEqual("", selectedValue)
    
        const add = await driver.findElement(By.name("addFields_btn"));
    
        await driver.executeScript("arguments[0].scrollIntoView(true)", add)
        await driver.sleep(500)
        add.click();

        await driver.sleep(1000)    

        let add_name = await driver.findElement(By.id("addField_name"));
        let add_identifier = await driver.findElement(By.id("addField-identifier"));
        select = await driver.findElement(By.id("addField_select"));
    
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
        
       
    
        add_identifier.sendKeys("title", Key.RETURN);
        add_name.sendKeys("Test", Key.RETURN);
        await select.findElement(By.css("option[value='password']")).click();
    
        await driver.findElement(By.name("addField")).click();   
        
        add_identifier_err = await driver.findElement(By.className("feilmelding_likidentifieras form-label")).getAttribute("value");
        assert.notStrictEqual("", add_identifier_err);
        
        add_identifier.clear();
        await add_identifier.sendKeys("test", Key.RETURN);
        await driver.sleep(1000)
        await driver.findElement(By.name("addField")).click();   
    
    
    
        const element = await driver.findElement(By.className("id-1-identifier"));element.clear();element.sendKeys("title", Key.RETURN);
        const submit = await driver.findElement(By.id("submitdata"))
        await driver.executeScript("arguments[0].scrollIntoView(true)", submit)
        await driver.sleep(500)
        submit.click();
        await driver.sleep(500)
        await driver.findElement(By.name("hide-errors")).click()
        let val = await driver.findElement(By.className("id-1-identifier-error-equal")).getAttribute("value");
    
        assert.notStrictEqual("", val)
    
    
        //Move
        /*await driver.actions().dragAndDrop(move,move).perform();
    
        let target= await move.getText();
        if(target === "Dropped"){
            console.log("dropped")
        }else{
            console("not dropped")
        }
    
    
        let draggable = driver.findElement(By.id("move"));
     
        //To perform drag and drop by offset
        await driver.actions().dragAndDrop(draggable, { x: 50, y: 50 }).perform();*/    
        
        
        //Remove
        await driver.findElements(By.className("remove")).then(async function(res){
            await driver.executeScript("arguments[0].click()", res[1])
    
            await driver.wait(until.alertIsPresent());
            await driver.switchTo().alert().accept();
        })
        submit.click();
    
       
        
    })
    
})

describe("Testing the management of the contenttype: 'test'",  async function (){
    this.timeout(100000000)
    var driver;
    
    const USERNAME = ltCapabilities.capabilities["LT:Options"].user;


    const KEY = ltCapabilities.capabilities["LT:Options"].accessKey;

    const GRID_HOST="hub.lambdatest.com/wd/hub";

    const gridURL= "https://" + USERNAME + ":" + KEY + "@" + GRID_HOST;

    beforeEach(function(){
        driver =  new Builder().usingServer(gridURL)
        .withCapabilities(ltCapabilities.capabilities)
        .build();

        // Starting the driver
    //let driver = await new Builder().forBrowser('firefox').build()
    
    


    });
    afterEach(async function(){
        // Closing window
        await driver.quit();
    });
    
    it("Deletes the contenttype 'test'.", async function(){
        //Deletes a contentype
        await driver.get("http://designer.dev.digimaker.no/")   

        // Selecting the contenttype
        let select = await driver.findElement(By.id("ManageContentTypes_select"));
        select.findElement(By.css("option[value='test']")).click();
        let data = await select.getText();

        // Deleting the contenttype
        let remove=await driver.findElement(By.name("delete_contenttype"));
        remove.click();
        driver.sleep(100)
        await driver.wait(until.alertIsPresent()).then(async function(){
            await driver.switchTo().alert().accept();
        });

        // Checking that its deleted
        await driver.sleep(1000)
        let newData = await select.getText();
        assert.notStrictEqual(newData, data);
        let isEmpty = await select.getAttribute("value");
        assert.strictEqual("", isEmpty);

        
    })
    
})
//deleteContenttype("brtikkel");





