export const fetchMeals = async () => {
  try {
    const res = await fetch("https://api.freeapi.app/api/v1/public/meals");
    const data = await res.json();

    return { data: data.data, error: null };
  } catch (error) {
    console.error(error);
    return { data: [], error: true };
  }
};