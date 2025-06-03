import { useState, useEffect } from 'react';

export const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCards = async () => {
    try {
      const response = await fetch('https://api.pokemontcg.io/v2/cards', {
        headers: { 'X-Api-Key': '4ae3c2ac-cd50-4029-abcb-120be975891f' }
      });
      const data = await response.json();
      setCards(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return { cards, loading, error, refetch: fetchCards };
};