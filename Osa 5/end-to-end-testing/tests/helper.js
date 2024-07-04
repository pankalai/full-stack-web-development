const loginWith = async (page, username, password)  => {
    await page.getByText('username').getByRole('textbox').fill(username)
    await page.getByText('password').getByRole('textbox').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}
  
const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.locator('#new_blog_title').fill(title)
    await page.locator('#new_blog_author').fill(author)
    await page.locator('#new_blog_url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByRole('button', { name: 'new blog' }).waitFor()
}
  
const getLikes = async (blogElement) => {
    await blogElement.getByText('likes:').waitFor()
    const text = await blogElement.getByText('likes:').textContent()
    const array = text.split(' ')
    return Number(array[array.findIndex((element) => element === 'likes:') + 1])
}
export { loginWith, createBlog, getLikes }