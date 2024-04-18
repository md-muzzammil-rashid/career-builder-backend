export const replaceVariablesWithValues = (templateJson, dataset)=>{
    const convertedData = []

    dataset.forEach(replacement => {
        const newCertificate = { ...templateJson };
        
        for (const key in newCertificate) {
          if (typeof newCertificate[key] === 'string') {
            newCertificate[key] = replaceVariables(newCertificate[key], replacement);
          }
        }
        
        convertedData.push(newCertificate);
      });
      
      function replaceVariables(text, replacement) {
        return text.replace(/\[(.*?)\]/g, (match, variable) => {
          return replacement[variable.trim()] || match;
        });
      }
      
      console.log(convertedData);



    return convertedData
}