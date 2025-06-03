const API_URL = '/api/data';

export async function getElectricalInventory() {

    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        console.log(result)
        return result;
        
    } catch (error){
        console.error("❌ Error fetching inventory:", error);
    }
    
}


