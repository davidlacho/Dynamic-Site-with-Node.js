const fs = require("fs"); 

mergeValues = (values, content) => {
  //Cycle over the keys of values replace all {{key}} with the value from the values object
  for (let key in values) {
    content = content.replace(`{{${key}}}`, values[key]); 
  }
  //return merged content
  return content;
}

view = (templateName, values, response) => {  
  // Read from the template files 
  let fileContents = fs.readFileSync(`views/${templateName}.html`, {encoding: "utf8"});
  //Insert values in to the content
  fileContents = mergeValues(values, fileContents); 
  //Write out the contents to the response
  response.write(fileContents); 
}

module.exports.view = view; 
