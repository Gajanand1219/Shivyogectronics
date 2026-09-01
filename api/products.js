const GITHUB_OWNER = 'Gajanand1219'
const GITHUB_REPO = 'Shivyogectronics'
const GITHUB_BRANCH = 'main'
const PRODUCTS_PATH = 'src/data/products.js'

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

function parseProductsFile(content) {
  const match = content.match(
    /const\s+products\s*=\s*(\[[\s\S]*?\])\s*export\s+default\s+products/
  )

  if (!match) {
    throw new Error('Could not parse products.js')
  }

  return Function(`"use strict"; return (${match[1]})`)()
}

function createProductsFile(products) {
  return `const products = ${JSON.stringify(products, null, 2)}

export default products
`
}

async function githubGetFile() {
  const url =
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}` +
    `/contents/${PRODUCTS_PATH}?ref=${GITHUB_BRANCH}`

  const response = await fetch(url, {
    headers: githubHeaders(),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub GET failed: ${text}`)
  }

  return response.json()
}

async function githubUpdateFile(content, sha, message) {
  const url =
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}` +
    `/contents/${PRODUCTS_PATH}`

  const encodedContent = Buffer.from(content, 'utf8').toString('base64')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ...githubHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: encodedContent,
      sha,
      branch: GITHUB_BRANCH,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GitHub UPDATE failed: ${text}`)
  }

  return response.json()
}

async function getProducts() {
  const file = await githubGetFile()

  const content = Buffer.from(file.content, 'base64').toString('utf8')

  return {
    products: parseProductsFile(content),
    sha: file.sha,
  }
}

export default async function handler(req, res) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        error: 'GITHUB_TOKEN is not configured',
      })
    }

    // GET — products fetch
    if (req.method === 'GET') {
      const data = await getProducts()

      return res.status(200).json({
        products: data.products,
      })
    }

    // POST — add/update/delete
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed',
      })
    }

    const { action, product, id, updates } = req.body || {}

    const current = await getProducts()

    let products = [...current.products]
    let resultProduct = null

    if (action === 'add') {
      resultProduct = {
        ...product,
        id:
          product.id ||
          `admin_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 7)}`,
        isAdmin: true,
        createdAt: Date.now(),
      }

      products.unshift(resultProduct)
    }

    else if (action === 'update') {
      const index = products.findIndex((p) => p.id === id)

      if (index === -1) {
        return res.status(404).json({
          error: 'Product not found',
        })
      }

      products[index] = {
        ...products[index],
        ...updates,
        id: products[index].id,
      }

      resultProduct = products[index]
    }

    else if (action === 'delete') {
      const exists = products.some((p) => p.id === id)

      if (!exists) {
        return res.status(404).json({
          error: 'Product not found',
        })
      }

      products = products.filter((p) => p.id !== id)
    }

    else {
      return res.status(400).json({
        error: 'Invalid action',
      })
    }

    const newFileContent = createProductsFile(products)

    await githubUpdateFile(
      newFileContent,
      current.sha,
      `Admin: ${action} product`
    )

    return res.status(200).json({
      success: true,
      product: resultProduct,
      products,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      error: error.message || 'Server error',
    })
  }
}
