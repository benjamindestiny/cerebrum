const BASE_URL = 'https://opentdb.com/api.php';

export const fetchQuestions = async ({
  amount = 10,
  category = null,
  difficulty = null,
  type = 'multiple',
} = {}) => {
  const params = new URLSearchParams();
  params.append('amount', Math.min(amount, 50));
  if (category) params.append('category', category);
  if (difficulty) params.append('difficulty', difficulty);
  if (type) params.append('type', type);
  
  const url = `${BASE_URL}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.response_code === 0) {
      return data.results.map(q => ({
        ...q,
        question: decodeHTML(q.question),
        correct_answer: decodeHTML(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(a => decodeHTML(a)),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();
    return data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};
