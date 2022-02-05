export function mapEcoData(ecoData) {
    if (ecoData == undefined) return null;
    var retMap = new Map();
    ecoData.forEach(element => {
        retMap.set(element["Région"], element);
    });
    return retMap;
}