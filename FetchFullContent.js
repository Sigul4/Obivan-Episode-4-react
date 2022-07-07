export default async function FetchFullContent(url) {
  let data = await fetch(url);
  let json = await data.json();
  console.log(json);

  let resultData = {}
  for(let elementOfData of Object.entries(json)){
    if (!Array.isArray(elementOfData[1])) {
        resultData[elementOfData[0]] = elementOfData[1];
    }else{
        

    let texts = await Promise.all(elementOfData[1].map(async url => {
        const resp = await fetch(url);
        let result = resp.text();
        return result
      }));
    resultData[elementOfData[0]] = texts
    }
}
// debugger
  console.log("==========>", resultData);
  return resultData;
}
