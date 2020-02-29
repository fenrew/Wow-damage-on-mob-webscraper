
const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://classicdb.ch/?npcs&filter=minl=39;maxl=50;zone=[3];rank=[0];');
    //await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
    await page.waitFor(1000);

    const result = await page.evaluate(() => {
        let data = []; 
        for (let i = 0; i < 51; i++){
            let elements = document.querySelectorAll('#lv-npcs > table > tbody > tr:nth-child('+i+') > td:nth-child(1) > a'); 
            for (var element of elements){ 
                let title = element.href; 
    
                data.push({title});
            }
        }
        // let elements = document.querySelectorAll('#lv-npcs > table > tbody > tr:nth-child(1) > td:nth-child(1) > a'); 
        // for (var element of elements){ 
        //     let title = element.href; 
        //     let price =" element.childNodes[7].children[0].innerText;"

        //     data.push({title, price});
        // }

        return data; 
    });

    browser.close();
    console.log("RES RESULT: ", result)
    return result; 
};

let scrapeTwo = async (titles) => {
    if(!titles) return
    console.log("Scrape two")
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(titles.title);
    //await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
    await page.waitFor(500);

    const result = await page.evaluate(() => {
        let regex = /Damage/
        let data = [];
        let name = []
        let level = []
        let elements = document.querySelectorAll('#markup-e826d6c6 > ul > li:nth-child(7) > div');
        let elementsTwo = document.querySelectorAll('#main-contents > div.text > h1');
        let elementsThree = document.querySelectorAll('#markup-e826d6c6 > ul > li:nth-child(6) > div');
        let elementsFour = document.querySelectorAll('#markup-e826d6c6 > ul > li:nth-child(1) > div');
        for (var [i, element] of elements.entries()){
            let title = element.innerText;
            if(!regex.test(title)){
                title = elementsThree[i].innerText
                if(!regex.test(title)){
                    title = "0"
                }
            }
            let price = "yoo"

            data.push({title, price});
        }
        for (var element of elementsTwo){ 
            let title = element.innerText; 
            let price =  "name"

            name.push({title, price});
        }
        for (var element of elementsFour){ 
            let title = element.innerText; 
            let price =  "Level"

            level.push({title, price});
        }

        return {data, name, level}; 
    });

    browser.close();
    return result; 
};

scrape().then((value) => {
    let i = 0
    let arrayOfData = []
    let newInterval = setInterval(() => {
        scrapeTwo(value[i]).then((valueTwo) => {
            console.log(valueTwo)
            arrayOfData.push(valueTwo)
            if(!valueTwo){
                clearInterval(newInterval)
                console.log("HELLO????", i)
                setTimeout(() => {
                    regexAndPrintResults(arrayOfData)
                }, 1500)
            }
        })
        i++
    }, 1000)


    //console.log(value);
});

function regexAndPrintResults(arrayOfData){
    let avgDamageData = []
    let regexMaxDamage = /(\d+)(?!.*\d)/
    let regexMinDamage = /\d+/
    console.log("ARRAY DATA", arrayOfData[0])
    for(let i = 0; i < arrayOfData.length; i++){
        if(arrayOfData[i]){
            let minDamage = arrayOfData[i].data[0].title.match(regexMinDamage)
            let maxDamage = arrayOfData[i].data[0].title.match(regexMaxDamage)
            console.log("mached", minDamage, maxDamage)
            minDamage = parseInt(minDamage[0])
            maxDamage = parseInt(maxDamage[0])
            console.log("avg", (minDamage+maxDamage)/2)
            avgDamageData.push({damage: (minDamage+maxDamage)/2, name: arrayOfData[i].name[0].title, level: arrayOfData[i].level[0].title})
        }
    }

    avgDamageData.sort( compare );


    console.log("ARRAY", avgDamageData)
}

function compare( a, b ) {
    if ( a.damage < b.damage ){
      return -1;
    }
    if ( a.damage > b.damage ){
      return 1;
    }
    return 0;
  }
  