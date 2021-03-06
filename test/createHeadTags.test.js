import {
  filterUnique,
  objectToTag,
  prefixToObjects,
  createHeadTags
} from '../lib/createHeadTags'

export default async function (test, assert) {
  test('filterUnique', async () => {
    const unique = filterUnique([
      { name: 'author', content: 'foo' },
      { name: 'author', content: 'bar' }
    ])

    assert(unique[0].content === 'foo')
  })

  test('objectToTag', async () => {
    const meta = objectToTag('meta', { name: 'author', content: 'foo' })
    assert(meta === `<meta name="author" content="foo" />`)
    const link = objectToTag('link', { rel: 'stylesheet', href: 'foo' })
    assert(link === `<link rel="stylesheet" href="foo" />`)
    const script = objectToTag('script', { src: 'foo' })
    assert(script === `<script src="foo"></script>`)
    const scriptWithChild = objectToTag('script', { children: 'foo' })
    assert(scriptWithChild === `<script>foo</script>`)
    const style = objectToTag('style', { children: 'foo' })
    assert(style === `<style>foo</style>`)
  })

  test('prefixToObjects', () => {
    const objects = prefixToObjects('og', {
      url: 'test.com'
    })
    assert(objects[0].content === 'test.com')
  })

  test('createHeadTags - defaults', async () => {
    const head = createHeadTags({})

    assert(/presta/.test(head))
    assert(/charset/.test(head))
    assert(/viewport/.test(head))
  })

  test('createHeadTags - basic', async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description',
      og: {
        url: 'test.com'
      },
      twitter: {
        card: 'summary_large_image'
      },
      meta: [{ name: 'author', content: 'test' }],
      script: [`<script src="/test.js"></script>`]
    })

    assert(/<title>test/.test(head))
    assert(/name="description" content="test description.+\/>/.test(head))
    assert(/name="author" content="test.+\/>/.test(head))
    assert(/script.+src="\/test/.test(head))
  })

  test('twitter and og', async () => {
    const head = createHeadTags({
      title: 'test',
      description: 'test description'
    })

    assert(/og:title/.test(head))
    assert(/og:description/.test(head))
    assert(/twitter:title/.test(head))
    assert(/twitter:description/.test(head))
  })

  test('image shorthand', async () => {
    const head = createHeadTags({
      image: 'foo'
    })

    assert(/og:image/.test(head))
    assert(/twitter:image/.test(head))
  })
}
