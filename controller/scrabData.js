import axios from "axios"
import * as cheerio from 'cheerio';

import pdf from "pdf-parse-debugging-disabled";
import dataModel from "../model/dataModel.js";

// Base URL of the website
const url = "http://www.comune.torino.it/ediliziaprivata/organizzazione/atti_org/";


const a='http://www.comune.torino.it/ediliziaprivata/'
async function parseData(urll){

    try {
        
        const response = await axios.get(urll, {
          responseType: "arraybuffer", 
          headers: {
               'Accept-Language': 'en;q=1.0'  
          }
      });
    
       
        const data = await pdf(response.data);
        const dateRegex = /\b(?:\(?\d{1,2}\)?(?:[/-]\d{1,2}[/-]\d{2,4}|\s(?:Gen(?:naio)?|Feb(?:braio)?|Mar(?:zo)?|Apr(?:ile)?|Mag(?:gio)?|Giu(?:gno)?|Lug(?:lio)?|Ago(?:sto)?|Set(?:tembre)?|Ott(?:obre)?|Nov(?:embre)?|Dic(?:embre)?)\s\d{4})|\(?[A-Za-z]+\s\d{1,2},?\s\d{4}\)?)\b/gi;



     
        
        const addressRegex = /\b(?:\d{1,5}\s[\w\s]+(?:\s(?:St|Ave|Blvd|Rd|Dr|Ln|Way|Pl|Ct|Cres|Boulevard|Square|Park))?(?:,\s[\w\s]+)?(?:,\s[\w\s]+)?(?:\s\d{5})?)\b/g;
        const typeRegex = /(<h[0-9]>.*?<\/h[0-9]>)+/


        const text = data.text;
    
        const dates = text.match(dateRegex) || [];
        const addresses = text.match(addressRegex) || [];

let header=''


       for(let i of text){

        if(i!=' '){
          let uppper=i.toUpperCase()
          if(i==uppper){
            header+=i
          }else{
           
            if(header.length>6){
            break
            }
             header=''
          }

        }else{

          header+=''
        }

       }
       


        let firstDate=dates[0]
        let firstAddress=addresses[0]
        
        let filteredHeader=header?.replace(/\n+/g, ' ').trim();
        const cleanedAddresses = firstAddress?.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
       
        

        

       const res = await dataModel.create({
      
        dates: firstDate,  
        header:filteredHeader,
        addresses: cleanedAddresses , 
        url:urll
    });
     

        
      } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log(`Error: PDF not found at  (404)`);
          } else {
            console.log(`Error fetching PDF from `, error.message);
          }
          return null; 
      
      }

}

async function scrapePdfLinks() {
  try {


    const { data } = await axios.get(url);
  
    const $ = cheerio.load(data);

    
    const pdfLinks = [];
    $('a[href]').each((index, element) => {
      const href = $(element).attr('href');
      if (href && /\.pdf(?:$|\?)/.test(href)) {
      
        const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
        pdfLinks.push(fullUrl);
      }
      
     
    });


    for(let i of pdfLinks){
        let ans=await parseData(i)

    }

   
    console.log("completed the data uploading");
    
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
}




export default scrapePdfLinks