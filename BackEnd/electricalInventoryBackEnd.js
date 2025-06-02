const API_URL = 'http://127.0.0.1:5700/api/data';

export async function getElectricalInventory() {

    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        return result;
        
    } catch (error){
        console.error("❌ Error fetching inventory:", error);
    }
    
}


