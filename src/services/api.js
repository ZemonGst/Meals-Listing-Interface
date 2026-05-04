export const fetchMeals = async () => {
  try {
    const res = await fetch("https://api.freeapi.app/api/v1/public/meals");
    const data = await res.json();

    // The API structure is { success, data: { data: [...] }, ... }
    // Note: The inner array is also called 'data' in this specific endpoint
    const meals = data?.data?.data || [];
    
    return { data: meals, error: null };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
};