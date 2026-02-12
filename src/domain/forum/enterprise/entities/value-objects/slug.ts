export default class Slug {
  private constructor(public value: string) {}

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and normalize it as a slug.
   * Example: "An example title" => "an-example-title"
   * @param text
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
