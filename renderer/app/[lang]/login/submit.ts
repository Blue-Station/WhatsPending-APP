'use server';

export async function submitForm(username: string, password: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const request = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        body: JSON.stringify({ email: username, password }),
      });
      const data = await request.json();
      console.log(data);
    
      return resolve(request.status < 400);
    }, 3000);
  });
}
