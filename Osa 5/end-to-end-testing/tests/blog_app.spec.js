const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, getLikes } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Mikko Mikkola',
        username: 'mmikkola',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Timo Timonen',
        username: 'ttimonen',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('username').getByRole('textbox')).toBeVisible()
    await expect(page.getByText('password').getByRole('textbox')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })


  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mmikkola', 'salainen')
      await page.getByRole('button', { name: 'logout' }).waitFor()
      expect(page.getByText('Mikko Mikkola')).toBeVisible()
      expect(page.getByText('logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mmikkola', 'virheellinen')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })

  })


  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, 'mmikkola', 'salainen')
      await page.getByText('logged in').waitFor()
    })
  
    test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Blog title', 'Blog author', 'Blog url')
        await page.waitForSelector('.blog')
        expect(page.getByText('Blog title Blog author')).toBeVisible()
    })

  })


  describe('When a blog exists', () => {

    beforeEach(async ({ page }) => {
      // Login
      await loginWith(page, 'mmikkola', 'salainen')
      await page.getByText('logged in').waitFor()

      // Create a blog
      await createBlog(page, 'Blog title', 'Blog author', 'Blog url')
      expect(page.getByText('Blog title Blog author')).toBeVisible()
    })

    test('it can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()
        const likesBefore = await getLikes(page.locator('.blog').first())
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText(`likes: ${likesBefore+1}`).waitFor()
        expect(page.getByText(`likes: ${likesBefore+1}`)).toBeVisible()
    })

    test('it can be deleted by a user that added it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click()
        await page.getByText('removed').waitFor()
        expect(page.getByText('Blog title Blog author')).not.toBeVisible()
    })

    test('it cannot be deleted by a user that did not add it', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'ttimonen', 'salainen')
        await page.getByText('logged in').waitFor()
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByText('Blog url').waitFor()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

  })


  describe('When multiple blogs exist', () => {
      
    beforeEach(async ({ page }) => {
      // Login
      await loginWith(page, 'mmikkola', 'salainen')
      await page.getByText('Mikko Mikkola').waitFor()

      // Create first blog
      await createBlog(page, 'First blog title', 'First blog author', 'First blog url')

      // Create another blog
      await createBlog(page, 'Second blog title', 'Second blog author', 'Second blog url')

      // Create a third blog
      await createBlog(page, 'Third blog title', 'Third blog author', 'Third blog url')

      // Like
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes: 1').waitFor()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()     
    })

    test('they are ordered by likes', async ({ page }) => { 
      const blogs = await page.locator('.blog').all()
      let likes = []
      for (let blog of blogs) {
          await blog.getByRole('button', { name: 'view' }).click()
          likes.push(await getLikes(blog))
          await blog.getByRole('button', { name: 'hide' }).click()
        }
      for (var i = 0; i < likes.length - 1; i++) {
        expect(likes[i] >= likes[i+1]).toBe(true)
      }
    })

  })

})