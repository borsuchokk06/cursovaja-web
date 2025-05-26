export async function registerUser(userData) {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Ошибка при регистрации');
    const user = await response.json();
    window.location.href = '../pages/home.html';
    return user; 
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

export function setCurrentUser(userData) {
  localStorage.setItem('currentUser', JSON.stringify(userData));
}
