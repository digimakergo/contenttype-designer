const {Builder, By, Key, util} = require("selenium-webdriver");
require("chromedriver");

async function example (){
    //try{
        /*let driver = await new Builder().forBrowser("chrome").build().catch((error) => {
            console.log(error)

            console.log("-----")
        })*/

        let driver = await new Builder().forBrowser('firefox').build()

        await driver.get("http://google.com").catch((error) => {
            
        });
        await driver.findElement(By.name("q")).sendKeys("Selenium Test", Key.RETURN).catch((error) => {
            
        });

        //await driver.quit()
    //}catch(error){
    //    console.log(error)
    //}
    

}
example();